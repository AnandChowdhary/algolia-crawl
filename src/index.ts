import algoliasearch from "algoliasearch";
import { config, cosmicSync } from "@anandchowdhary/cosmic";
import { launch, Page } from "puppeteer";

cosmicSync("algoliacrawl");
const client = algoliasearch(config("appId"), config("apiKey"));
const index = client.initIndex(config("index"));

/** Index objects in Algolia search */
export const indexObjects = async (objects: Readonly<Record<string, any>>[]) => index.saveObjects(objects);

const items: Set<{
  url: string;
  title: string;
  description?: string;
  text?: string;
}> = new Set();

let done: string[] = [];
export const getUrls = async (page: Page, _url: string, baseUrl?: string) => {
  const url = _url.split("#")[0];
  if (done.includes(url)) return;
  done.push(url);
  console.log("Fetching", url);
  try {
    await page.goto(url);
  } catch (error) {}
  let description: string | undefined = undefined;
  try {
    description =
      (await page.$eval("head > meta[name='description']", (element) => element.getAttribute("content"))) ?? undefined;
  } catch (error) {}
  let text: string | undefined = undefined;
  try {
    text = (await page.$eval("main, body, html", (element) => (element as HTMLBodyElement).innerHTML)) ?? undefined;
  } catch (error) {}
  let title = "";
  try {
    title = await page.title();
  } catch (error) {}
  items.add({
    url,
    title,
    description,
    text,
  });
  let hrefs: string[] = [];
  try {
    hrefs = await page.$$eval("a", (as) => as.map((a) => (a as HTMLAnchorElement).href));
  } catch (error) {}
  for await (const href of hrefs) {
    if (href) {
      if (baseUrl) {
        if (href.startsWith(baseUrl)) await getUrls(page, href, baseUrl);
      } else {
        await getUrls(page, href, baseUrl);
      }
    }
  }
};

export const crawl = async () => {
  const browser = await launch();
  const page = await browser.newPage();
  await getUrls(page, config("startUrl"), config("baseUrl"));
  await browser.close();
  return items;
};

export const algoliaCrawl = async () => {
  const items = await crawl();
  await indexObjects(Array.from(items));
  console.log("Done!");
};
algoliaCrawl();
