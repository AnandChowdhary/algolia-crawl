import algoliasearch from "algoliasearch";
import { config, cosmicSync } from "@anandchowdhary/cosmic";
import {} from "puppeteer";

cosmicSync("algoliacrawl");
const client = algoliasearch(config("appId"), config("apiKey"));
const index = client.initIndex(config("index"));

/** Index objects in Algolia search */
export const indexObjects = async (objects: Readonly<Record<string, any>>[]) => index.saveObjects(objects);

export const getUrls = async () => {};
getUrls();
