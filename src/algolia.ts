import { config, cosmicSync } from "@anandchowdhary/cosmic";
import algoliasearch from "algoliasearch";

cosmicSync("algoliacrawl");
const client = algoliasearch(config("appId"), config("apiKey"));
export const index = client.initIndex(config("index"));
