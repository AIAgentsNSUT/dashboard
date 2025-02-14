import "server-only";
import { create } from "zustand";
import { connectDB } from "@/lib/db";
import redis from "@/lib/redis";
import Organisation, { IOrganisation } from "@/models/Organisation";

const CACHE_EXPIRY = 60 * 60 * 24; // 24 hours

interface OrgState {
  orgs: {
    byHostname: Record<string, IOrganisation>;
    byWorkosId: Record<string, IOrganisation>;
  };
  setOrg: (org: IOrganisation) => void;
  getOrgByHostname: (hostname: string) => Promise<IOrganisation | null>;
  getOrgByWorkOSId: (workosId: string) => Promise<IOrganisation | null>;
}

const useOrgStore = create<OrgState>((set, get) => ({
  orgs: {
    byHostname: {},
    byWorkosId: {},
  },

  setOrg: (org: IOrganisation) => {
    set((state) => ({
      orgs: {
        byHostname: {
          ...state.orgs.byHostname,
          [org.hostname]: org,
        },
        byWorkosId: {
          ...state.orgs.byWorkosId,
          [org.workosId]: org,
        },
      },
    }));
  },

  getOrgByHostname: async (hostname: string) => {
    // First check Zustand store
    const state = get();
    if (state.orgs.byHostname[hostname]) {
      return state.orgs.byHostname[hostname];
    }

    try {
      // Then check Redis
      const workosId = await redis.get(`org:hostname:${hostname}`);
      if (workosId) {
        const orgStr = await redis.get(`org:workos:${workosId}`);
        if (orgStr) {
          const org = JSON.parse(orgStr) as IOrganisation;
          // Update cache and store
          await cacheOrganisation(org);
          state.setOrg(org);
          return org;
        }
      }

      // Finally check MongoDB
      await connectDB();
      const org = await Organisation.findOne({ hostname });

      if (org) {
        await cacheOrganisation(org);
        state.setOrg(org);
        return org;
      }

      return null;
    } catch (error) {
      console.error("Error fetching organisation by hostname:", error);
      throw error;
    }
  },

  getOrgByWorkOSId: async (workosId: string) => {
    // First check Zustand store
    const state = get();
    if (state.orgs.byWorkosId[workosId]) {
      return state.orgs.byWorkosId[workosId];
    }

    try {
      // Then check Redis
      const orgStr = await redis.get(`org:workos:${workosId}`);
      if (orgStr) {
        const org = JSON.parse(orgStr) as IOrganisation;
        // Update cache and store
        await cacheOrganisation(org);
        state.setOrg(org);
        return org;
      }

      // Finally check MongoDB
      await connectDB();
      const org = await Organisation.findOne({ workosId });

      if (org) {
        await cacheOrganisation(org);
        state.setOrg(org);
        return org;
      }

      return null;
    } catch (error) {
      console.error("Error fetching organisation by WorkOS ID:", error);
      throw error;
    }
  },
}));

// Helper function to cache in Redis
async function cacheOrganisation(org: IOrganisation) {
  try {
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

export default useOrgStore;
