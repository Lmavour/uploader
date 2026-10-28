<div align="center">

# Permanent File Uploader

**A compact Node.js uploader for long-lived file hosting services.**

[![npm version](https://img.shields.io/npm/v/@zanixongroup/uploader?style=flat-square&logo=npm&color=CB3837)](https://www.npmjs.com/package/@zanixongroup/uploader)
[![npm downloads](https://img.shields.io/npm/dm/@zanixongroup/uploader?style=flat-square&logo=npm)](https://www.npmjs.com/package/@zanixongroup/uploader)
[![license](https://img.shields.io/npm/l/@zanixongroup/uploader?style=flat-square)](https://www.npmjs.com/package/@zanixongroup/uploader)
[![repository](https://img.shields.io/badge/source-Lmavour%2Fuploader-181717?style=flat-square&logo=github)](https://github.com/Lmavour/uploader)

[Playground](https://lmavour.github.io/uploader/) | [Installation](#installation) | [Providers](#supported-providers) | [Usage](#usage) | [API](#api-reference) | [Development](#development)

</div>

> [!NOTE]
> This README documents `@zanixongroup/uploader` version **2.1.5**.

## Overview

Permanent File Uploader exposes six small, asynchronous upload adapters through one package. Each adapter accepts a Node.js `Buffer`, uploads it directly to the selected provider, and resolves with the resulting public URL.

This fork is maintained by [Lmavour](https://github.com/Lmavour) and focuses on providers intended for long-lived storage. It also includes a static browser playground and API reference.

## Highlights

- Six provider adapters with one consistent API
- Named exports for both ESM and CommonJS projects
- TypeScript declarations included in the package
- MIME detection and provider-specific size validation
- No account or API key required by the current integrations
- Static playground with direct browser-to-provider uploads

## Supported Providers

| Export | Provider | Intended content | Upload limit |
| :--- | :--- | :--- | ---: |
| `Catbox` | [Catbox](https://catbox.moe/) | General files | Less than 200 MB |
| `Pomf` | [Pomf](https://pomf.lain.la/) | General files | Less than 1 GB |
| `Quax` | [Qu.ax](https://qu.ax/) | Images, video, and audio | Less than 256 MB |
| `Videy` | [Videy](https://videy.co/) | MP4 and MOV video | Less than 1 GB |
| `Cloudku` | [Cloudku](https://cloudkuimages.guru/) | Provider-supported files | Less than 10 GB |
| `Picsur` | [Picsur](https://picsur.org/) | Images | Less than 256 MB |

> [!IMPORTANT]
> File availability, retention, acceptable content, and service uptime are controlled by each provider. "Permanent" describes this project's long-lived hosting focus; it is not a guarantee that a third-party provider will retain a file forever.

## Installation

Install with your preferred package manager:

```bash
npm install @zanixongroup/uploader
```

```bash
pnpm add @zanixongroup/uploader
```


```bash
yarn add @zanixongroup/uploader
```

## Usage

### ES Modules

```javascript
import { readFile } from "node:fs/promises";
import { Catbox } from "@zanixongroup/uploader";

async function main() {
  const file = await readFile("./photo.jpg");
  const url = await Catbox(file);

  console.log(url);
}

main().catch(console.error);
```

### CommonJS

```javascript
const { readFile } = require("node:fs/promises");
const { Pomf } = require("@zanixongroup/uploader");

async function main() {
  const file = await readFile("./document.pdf");
  const url = await Pomf(file);

  console.log(url);
}

main().catch(console.error);
```

### Selecting a Provider

All adapters use the same call pattern, so you only need to change the imported function:

```javascript
import { readFile } from "node:fs/promises";
import {
  Catbox,
  Pomf,
  Quax,
  Videy,
  Cloudku,
  Picsur,
} from "@zanixongroup/uploader";

const file = await readFile("./file.jpg");

const catboxUrl = await Catbox(file);
const pomfUrl = await Pomf(file);
const quaxUrl = await Quax(file);
const cloudkuUrl = await Cloudku(file);
const picsurUrl = await Picsur(file);

// Videy only accepts MP4 and MOV input.
const video = await readFile("./video.mp4");
const videyUrl = await Videy(video);
```

### Error Handling

Adapters throw when the input is invalid, exceeds the provider limit, has an unsupported Videy file type, or when the upstream request fails.

```javascript
import { readFile } from "node:fs/promises";
import { Videy } from "@zanixongroup/uploader";

try {
  const video = await readFile("./video.mp4");
  const url = await Videy(video);

  if (!url) {
    throw new Error("The provider did not return a file URL");
  }

  console.log("Uploaded:", url);
} catch (error) {
  console.error("Upload failed:", error.message);
}
```

## API Reference

Every named export follows this interface:

```typescript
function upload(buffer: Buffer): Promise<string | null>;
```

| Function | Description |
| :--- | :--- |
| `Catbox(buffer)` | Uploads a general file to Catbox. |
| `Pomf(buffer)` | Uploads a general file to Pomf. |
| `Quax(buffer)` | Uploads a media file to Qu.ax. |
| `Videy(buffer)` | Uploads an MP4 or MOV video to Videy. |
| `Cloudku(buffer)` | Uploads a provider-supported file to Cloudku. |
| `Picsur(buffer)` | Uploads an image to Picsur. |

### Parameter

- `buffer`: A Node.js `Buffer` containing the complete file data.

### Return Value

- `Promise<string | null>`: The public file URL, or `null` when a provider response does not contain a URL.

## Web Playground

The [`docs/`](./docs) directory contains a responsive, serverless playground and browser-friendly API reference.

[Open the live playground](https://lmavour.github.io/uploader/)

Run it locally:

```bash
npx serve docs
```

Browser uploads currently support MP4 and MOV files through Videy. The selected file is sent directly from the browser to the provider; this repository does not proxy or retain it. Use the Node.js package for the other adapters.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FLmavour%2Fuploader)

The root [`vercel.json`](./vercel.json) serves `docs/` as a static site without a build step or environment variables.

## Fork Scope

Compared with the original project, this fork:

- Removes temporary hosting adapters
- Keeps six integrations aimed at long-lived file hosting
- Adds a static web playground and API reference
- Uses the Lmavour repository for issues and project documentation

## Development

Clone the repository and install its dependencies:

```bash
git clone https://github.com/Lmavour/uploader.git
cd uploader
npm install
```

Available scripts:

| Command | Purpose |
| :--- | :--- |
| `npm run build` | Builds CommonJS, ESM, and declaration outputs with tsup. |
| `npm test` | Runs the current live Picsur upload test. |
| `npm run clean` | Removes the generated `dist/` directory. |

`npm test` performs a real network upload using the repository fixture; it is not an isolated unit test.

## Project Structure

```text
src/
  index.ts          Package exports
  services/         Provider adapters
  utils/helper.ts   MIME and file-size helpers
docs/               Static playground and API reference
test/               Live upload test
```

## Contributing

Contributions that improve an existing integration or add a suitable long-lived provider are welcome.

1. Fork the repository and create a focused branch.
2. Build and test your changes.
3. Open a pull request with a clear description of the behavior changed.

Read [`CONTRIBUTING.md`](./CONTRIBUTING.md) for the commit and contribution guidelines. Report bugs through [GitHub Issues](https://github.com/Lmavour/uploader/issues).

## License

The package metadata declares the project under the **ISC License**.

## Credits

- Original project: [ZanixonGroup](https://github.com/zanixongroup)
- Fork and playground: [Lmavour](https://github.com/Lmavour)
