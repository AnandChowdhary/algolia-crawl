#!/usr/bin/env node
import { argv } from "yargs";
import { algoliaCrawl } from "./crawler";
import { generateSitemap } from "./sitemap";

if (argv._[0] === "sitemap") {
  if (typeof argv._[1] === "string") generateSitemap(argv._[1]);
  else throw new Error("Provide a sitemap file name");
} else if (argv._[0] === "crawl") {
  algoliaCrawl();
}
