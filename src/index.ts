import algoliasearch from "algoliasearch";
import { config, cosmicSync } from "@anandchowdhary/cosmic";
cosmicSync("algoliacrawl");

const client = algoliasearch(config("appId"), config("apiKey"));
const index = client.initIndex(config("index"));

export const hello = "world";
