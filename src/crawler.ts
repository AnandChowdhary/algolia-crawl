import { config } from "@anandchowdhary/cosmic";
import { createHash } from "crypto";
import { Page } from "puppeteer-core";
import { index } from "./algolia";
import chrome from "chrome-aws-lambda";

/** Index objects in Algolia search */
export const indexObjects = async (objects: Readonly<Record<string, any>>[]) =>
  index.saveObjects(objects);

const items: Set<{
  objectID: string;
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
      (await page.$eval("head > meta[name='description']", (element) =>
        element.getAttribute("content")
      )) ?? undefined;
  } catch (error) {}
  let text: string | undefined = undefined;
  try {
    text =
      (await page.$eval("main, body, html", (element) => (element as HTMLBodyElement).innerText)) ??
      undefined;
  } catch (error) {}
  let title = "";
  try {
    title = await page.title();
  } catch (error) {}
  items.add({
    objectID: createHash("md5").update(url).digest("hex"),
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
  const browser = await chrome.puppeteer.launch({
    executablePath: await chrome.executablePath,
    args: chrome.args,
    defaultViewport: chrome.defaultViewport,
    headless: chrome.headless,
  });

  const page = await browser.newPage();
  if (Array.isArray(config<string | string[]>("algoliaCrawlStartUrl"))) {
    for await (const url of config<string[]>("algoliaCrawlStartUrl")) {
      await getUrls(page, url, config("algoliaCrawlBaseUrl"));
    }
  } else {
    await getUrls(page, config("algoliaCrawlStartUrl"), config("algoliaCrawlBaseUrl"));
  }
  await browser.close();
  return items;
};

export const algoliaCrawl = async () => {
  try {
    const items = await crawl();
    await indexObjects(Array.from(items));
    console.log("Done!");
  } catch (error) {
    console.log(error);
  }
};
