"use server";

import { connectDB } from "@/lib/db";
import redis from "@/lib/redis";
import Organisation, { IOrganisation } from "@/models/Organisation";

const CACHE_EXPIRY = 60 * 60 * 24; // 24 hours

async function cacheOrganisation(org: IOrganisation) {
  try {
    // Create a multi command (pipeline equivalent in node-redis)
    const multi = redis.multi();

    multi.setEx(`org:hostname:${org.hostname}`, CACHE_EXPIRY, org.workosId);

    multi.setEx(
      `org:workos:${org.workosId}`,
      CACHE_EXPIRY,
      JSON.stringify(org)
    );

    await multi.exec();
  } catch (error) {
    console.error("Error in cacheOrganisation:", error);
  }
}

export async function getOrganisationByHostname(
  hostname: string
): Promise<IOrganisation | null> {
  try {
    // First get the workosId from hostname mapping
    const workosId = await redis.get(`org:hostname:${hostname}`);
    if (workosId) {
      const orgStr = await redis.get(`org:workos:${workosId}`);
      if (orgStr) {
        const org = JSON.parse(orgStr) as IOrganisation;
        // Update cache and return
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
    const orgStr = await redis.get(`org:workos:${workosId}`);
    if (orgStr) {
      const org = JSON.parse(orgStr) as IOrganisation;
      // Update cache and return
      await cacheOrganisation(org);
      return org;
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
