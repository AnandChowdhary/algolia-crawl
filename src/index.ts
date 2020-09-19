import algoliasearch from "algoliasearch";
import { config, cosmicSync } from "@anandchowdhary/cosmic";
import { launch, Page } from "puppeteer";

cosmicSync("algoliacrawl");
const client = algoliasearch(config("appId"), config("apiKey"));
const index = client.initIndex(config("index"));

/** Index objects in Algolia search */
export const indexObjects = async (objects: Readonly<Record<string, any>>[]) => index.saveObjects(objects);

const items: Array<{
  title: string;
  description?: string;
  text?: string;
}> = [];

export const getUrls = async (page: Page, url: string) => {
  await page.goto(url);
  let description: string | undefined = undefined;
  try {
    description =
      (await page.$eval("head > meta[name='description']", (element) => element.getAttribute("content"))) ?? undefined;
  } catch (error) {}
  let text: string | undefined = undefined;
  try {
    text = (await page.$eval("main, body, html", (element) => (element as HTMLBodyElement).innerText)) ?? undefined;
  } catch (error) {}
  items.push({
    title: await page.title(),
    description,
    text,
  });
  // const hrefs = await page.$$eval("a", (as) => as.map((a) => a.getAttribute("href")));
  // console.log(hrefs);
};

export const crawl = async () => {
  const browser = await launch();
  const page = await browser.newPage();
  getUrls(page, "https://example.com");
  await browser.close();
  console.log(items);
};
crawl();
