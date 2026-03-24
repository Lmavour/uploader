<div align="center">

# 🚀 Uploader
**A lightweight, permanent file hosting uploader for Node.js**

[![NPM Version](https://img.shields.io/npm/v/@zanixongroup/uploader?style=for-the-badge&logo=npm&color=CB3837)](https://www.npmjs.com/package/@zanixongroup/uploader)
[![Repo Size](https://img.shields.io/github/repo-size/zanixongroup/uploader?style=for-the-badge&logo=github&color=2ea44f)](https://github.com/zanixongroup/uploader)
[![Last Commit](https://img.shields.io/github/last-commit/zanixongroup/uploader?style=for-the-badge&logo=github)](https://github.com/zanixongroup/uploader)
[![License](https://img.shields.io/github/license/zanixongroup/uploader?style=for-the-badge&color=informational)](https://github.com/zanixongroup/uploader/blob/main/LICENSE)

[Features](#-features) • [Installation](#-installation) • [Supported Hosts](#-supported-hosts) • [Quick Start](#-quick-start) • [Contributing](#-contributing)

</div>

---

## ✨ Features

- 📦 **Lightweight**: Zero unnecessary dependencies.
- ⚡ **Simple API**: Easy to integrate with just a few lines of code.
- 🌐 **Multi-Host**: Supports various permanent file hosting services.
- 🛡️ **Reliable**: Built-in error handling for seamless uploads.
- ♾️ **Permanent Storage**: All supported services provide long-term file hosting with no expiration.
- 🔒 **Stable Access**: Your files remain accessible indefinitely without time limits.

---

## 📥 Installation

Install the package via **npm**:

```bash
npm install @zanixongroup/uploader
```

Or using **yarn**:

```bash
yarn add @zanixongroup/uploader
```

---

## ☁️ Supported Hosts

Here is a list of currently supported permanent hosting services:

| Provider | File Type | Best For |
| :--- | :--- | :--- |
| **Pomf** | All | General usage |
| **Quax** | Image, Video, Audio | Media hosting |
| **Videy** | Video | Video sharing |
| **Catbox** | All | General usage |
| **Cloudku** | All | General usage |
| **Picsur** | Image | Simple images |

All services provide permanent file storage with no expiration time.

---

## 🚀 Quick Start

### 1. Basic Usage (ES Modules)

```javascript
import { Pomf } from "@zanixongroup/uploader";
import fs from "fs";

// Using Buffer
const buffer = fs.readFileSync("./my-image.jpg");

Pomf(buffer)
  .then((url) => console.log("Uploaded successfully:", url))
  .catch((err) => console.error("Upload failed:", err));
```

### 2. CommonJS Usage

If your project still uses CommonJS:

```javascript
const { Catbox } = require("@zanixongroup/uploader");

(async () => {
  try {
    const res = await Catbox(myBuffer);
    console.log("Result:", res);
  } catch (e) {
    console.error(e);
  }
})();
```

### 3. Using Different Services

```javascript
import { Catbox, Pomf, Quax, Videy, Cloudku, Picsur } from "@zanixongroup/uploader";

// Upload to Catbox
const catboxUrl = await Catbox(fileBuffer);

// Upload to Pomf
const pomfUrl = await Pomf(fileBuffer);

// Upload to Quax (for media files)
const quaxUrl = await Quax(fileBuffer);

// Upload to Videy (for videos)
const videyUrl = await Videy(fileBuffer);

// Upload to Cloudku
const cloudkuUrl = await Cloudku(fileBuffer);

// Upload to Picsur (for images)
const picsurUrl = await Picsur(fileBuffer);
```

---

## 🛠 Contributing

We greatly appreciate your contributions! If you want to add a new provider or fix a bug, please follow these steps:

1. Fork this repository.
2. Create a new branch (`git checkout -b feature/AmazingFeature`).
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to that branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

---

## 🐞 Issues

Found a bug or have a feature suggestion? Feel free to open an [Issue](https://github.com/zanixongroup/uploader/issues). We'll try to respond as soon as possible.

---

<div align="center">

Made with ❤️ by [ZanixonGroup](https://github.com/zanixongroup)

</div>
