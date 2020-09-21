# 🕷️🔍 Algolia Crawl

Crawl your website and sync all pages to Algolia search, and auto generate sitemaps from their index.

## ⭐️ Features

- Crawl your website using Puppeteer
- Sync all pages to an Algolia search index
- Generate `sitemap.xml` from the index

## 💻 Getting started

Install from npm:

```bash
npm install algolia-crawl
```

Use API for Node.js:

```ts
import { algoliaCrawl, generateSitemap } from "algolia-crawl";

await algoliaCrawl(); // Crawl all pages and sync index
await generateSitemap("sitemap.xml"); // Generate a sitemap.xml file
```

CLI usage:

```bash
npx algolia-crawl crawl # Crawl all pages and sync index
npx algolia-crawl sitemap sitemap.xml # Generate a sitemap.xml file
```

### Configuration

You can either create a `.algoliacrawlrc.json` configuration file with the following keys:

```json
{
  "algoliaCrawlAppId": "2UFBBTMSYW",
  "algoliaCrawlIndex": "dev_KOJ",
  "algoliaCrawlStartUrl": "https://koj.co",
  "algoliaCrawlBaseUrl": "https://koj.co"
}
```

`appId` is your Algolia application ID and `index` is the name of the index. `startUrl` is the first page to crawl (it can also be an array of strings), and only pages starting with `baseUrl` will be indexed.

Alternately, you can provide these values as environment variables instead of the configuration file:

| Environment variable      | Description                    |
| ------------------------- | ------------------------------ |
| `ALGOLIA_CRAWL_APP_ID`    | Algolia search application ID  |
| `ALGOLIA_CRAWL_INDEX`     | Algolia search index           |
| `ALGOLIA_CRAWL_START_URL` | First page to crawl            |
| `ALGOLIA_CRAWL_BASE_URL`  | Index pages with this base URL |

Other environment variables required are:

| Environment variable    | Description            |
| ----------------------- | ---------------------- |
| `ALGOLIA_CRAWL_API_KEY` | Algolia search API key |

## 📄 License

[MIT](./LICENSE) © [Koj](https://koj.co)

<p align="center">
  <a href="https://koj.co">
    <img width="44" alt="Koj" src="https://kojcdn.com/v1598284251/website-v2/koj-github-footer_m089ze.svg">
  </a>
</p>
<p align="center">
  <sub>An open source project by <a href="https://koj.co">Koj</a>. <br> <a href="https://koj.co">Furnish your home in style, for as low as CHF175/month →</a></sub>
</p>
