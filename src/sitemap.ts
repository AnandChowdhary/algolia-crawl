import { index } from "./algolia";
import { writeFile } from "fs/promises";

export const generateSitemap = async (path: string) => {
  let hits: Array<any> = [];
  await index.browseObjects({
    query: "",
    batch: (batch) => (hits = hits.concat(batch)),
  });
  let xml = `<?xml version="1.0" encoding="utf-8" ?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">`;
  hits.forEach(
    (item) =>
      (xml += `
  <url>
      <loc>${item.url}</loc>
  </url>`)
  );
  xml += "\n</urlset>\n";
  writeFile(path, xml);
};
