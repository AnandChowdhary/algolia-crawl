import { config, cosmicSync } from "@anandchowdhary/cosmic";
import algoliasearch from "algoliasearch";

cosmicSync("algoliacrawl");
const client = algoliasearch(config("algoliaCrawlAppId"), config("algoliaCrawlApiKey"));
export const index = client.initIndex(config("algoliaCrawlIndex"));
