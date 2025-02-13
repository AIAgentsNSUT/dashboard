"use server";

import { connectDB } from "@/lib/db";
import redis from "@/lib/redis";
import Organisation, { IOrganisation } from "@/models/Organisation";

const CACHE_EXPIRY = 60 * 60 * 24; // 24 hours

async function cacheOrganisation(org: IOrganisation) {
  try {
    // Redis caching
    const pipeline = redis.pipeline();

    pipeline.set(`org:hostname:${org.hostname}`, org.workosId, {
      ex: CACHE_EXPIRY,
    });

    pipeline.set(`org:workos:${org.workosId}`, JSON.stringify(org), {
      ex: CACHE_EXPIRY,
    });

    await pipeline.exec();
  } catch (error) {
    console.error("Error in cacheOrganisation:", error);
  }
}

export async function getOrganisationByHostname(
  hostname: string
): Promise<IOrganisation | null> {
  try {
    // First get the workosId from hostname mapping
    const workosId = await redis.get<string>(`org:hostname:${hostname}`);
    if (workosId) {
      // If not in cookies, check Redis
      const org = await redis.get<IOrganisation>(`org:workos:${workosId}`);
      if (org) {
        // Update cookies and return
        await cacheOrganisation(org);
        return org;
      }
    }

    // If not in Redis, check MongoDB
    await connectDB();
    const org = await Organisation.findOne({ hostname });

    if (org) {
      await cacheOrganisation(org);
      return org;
    }

    return null;
  } catch (error) {
    console.error("Error fetching organisation by hostname:", error);
    throw error;
  }
}

export async function getOrganisationByWorkOSId(
  workosId: string
): Promise<IOrganisation | null> {
  try {
    // Check Redis
    const cachedOrg = await redis.get<IOrganisation>(`org:workos:${workosId}`);
    if (cachedOrg) {
      // Update cookies and return
      await cacheOrganisation(cachedOrg);
      return cachedOrg;
    }

    // If not in Redis, check MongoDB
    await connectDB();
    const org = await Organisation.findOne({ workosId });

    if (org) {
      await cacheOrganisation(org);
      return org;
    }

    return null;
  } catch (error) {
    console.error("Error fetching organisation by WorkOS ID:", error);
    throw error;
  }
}
