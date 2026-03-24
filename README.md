<div align="center">

# 📤 Permanent File Uploader
**A lightweight Node.js uploader for permanent file hosting services**

[![NPM Version](https://img.shields.io/npm/v/@zanixongroup/uploader?style=for-the-badge&logo=npm&color=CB3837)](https://www.npmjs.com/package/@zanixongroup/uploader)
[![Repo Size](https://img.shields.io/github/repo-size/zanixongroup/uploader?style=for-the-badge&logo=github&color=2ea44f)](https://github.com/zanixongroup/uploader)
[![License](https://img.shields.io/github/license/zanixongroup/uploader?style=for-the-badge&color=informational)](https://github.com/zanixongroup/uploader/blob/main/LICENSE)

---

## 🎯 Modified Version

**⚡ Modif oleh lamvour**

This version has been modified by **lamvour** to focus exclusively on permanent file hosting services. All temporary hosting services have been removed to ensure your files remain accessible indefinitely.

---

[Features](#-features) • [What's Changed](#-whats-changed) • [Installation](#-installation) • [Supported Services](#-supported-services) • [Usage](#-usage) • [API](#-api) • [Contributing](#-contributing)

</div>

---

## ✨ Features

- 📦 **Lightweight**: Zero unnecessary dependencies
- ⚡ **Simple API**: Upload files with just a few lines of code
- 🌐 **Multi-Host**: Support for 6 permanent hosting services
- 🛡️ **Reliable**: Built-in error handling for seamless uploads
- ♾️ **Permanent Storage**: All services provide long-term file hosting with no expiration
- 🔒 **Stable Access**: Your files remain accessible indefinitely without time limits
- 🎯 **Focused**: Only permanent hosting services - no temporary links

---

## 🔄 What's Changed

### Modifications by lamvour

This version has been significantly modified from the original:

- ❌ **Removed**: All temporary file hosting services
- ✅ **Kept**: Only permanent hosting services that guarantee long-term storage
- 🎯 **Focus**: Simplified to provide reliable, permanent file hosting solutions
- 📝 **Purpose**: Ensure users have access to services that won't delete their files

**Why remove temporary services?**
Temporary hosting services can be unreliable for long-term storage. Files may be deleted after a certain period, making them unsuitable for important documents, backups, or permanent sharing. This modified version focuses exclusively on services that provide permanent storage.

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

Or using **pnpm**:

```bash
pnpm add @zanixongroup/uploader
```

---

## ☁️ Supported Services

| Service | File Types | Best For | Storage Type |
| :--- | :--- | :--- | :--- |
| **Pomf** | All files | General purpose | Permanent |
| **Quax** | Image, Video, Audio | Media hosting | Permanent |
| **Videy** | Video | Video sharing | Permanent |
| **Catbox** | All files | General purpose | Permanent |
| **Cloudku** | All files | General purpose | Permanent |
| **Picsur** | Image | Simple image hosting | Permanent |

✅ **All services provide permanent file storage with no expiration time.**

---

## 🚀 Usage

### Basic Example (ES Modules)

```javascript
import { Pomf } from "@zanixongroup/uploader";
import fs from "fs";

// Read file as Buffer
const buffer = fs.readFileSync("./my-file.jpg");

// Upload to Pomf
Pomf(buffer)
  .then((url) => console.log("✅ Uploaded successfully:", url))
  .catch((err) => console.error("❌ Upload failed:", err));
```

### CommonJS Example

```javascript
const { Catbox } = require("@zanixongroup/uploader");

(async () => {
  try {
    const buffer = fs.readFileSync("./my-file.pdf");
    const url = await Catbox(buffer);
    console.log("✅ Result:", url);
  } catch (error) {
    console.error("❌ Error:", error);
  }
})();
```

### Using All Services

```javascript
import { 
  Catbox, 
  Pomf, 
  Quax, 
  Videy, 
  Cloudku, 
  Picsur 
} from "@zanixongroup/uploader";
import fs from "fs";

const fileBuffer = fs.readFileSync("./my-file.jpg");

// Upload to different services
const catboxUrl = await Catbox(fileBuffer);
console.log("Catbox:", catboxUrl);

const pomfUrl = await Pomf(fileBuffer);
console.log("Pomf:", pomfUrl);

const quaxUrl = await Quax(fileBuffer);
console.log("Quax:", quaxUrl);

const videyUrl = await Videy(fileBuffer);
console.log("Videy:", videyUrl);

const cloudkuUrl = await Cloudku(fileBuffer);
console.log("Cloudku:", cloudkuUrl);

const picsurUrl = await Picsur(fileBuffer);
console.log("Picsur:", picsurUrl);
```

### Service-Specific Examples

#### For Images (Picsur, Quax)

```javascript
import { Picsur, Quax } from "@zanixongroup/uploader";

// Upload image to Picsur (simple image hosting)
const imageBuffer = fs.readFileSync("./photo.png");
const picsurUrl = await Picsur(imageBuffer);

// Upload image to Quax (media hosting)
const quaxUrl = await Quax(imageBuffer);
```

#### For Videos (Videy, Quax)

```javascript
import { Videy, Quax } from "@zanixongroup/uploader";

// Upload video to Videy (video-specific)
const videoBuffer = fs.readFileSync("./video.mp4");
const videyUrl = await Videy(videoBuffer);

// Upload video to Quax (media hosting)
const quaxUrl = await Quax(videoBuffer);
```

#### For General Files (Catbox, Pomf, Cloudku)

```javascript
import { Catbox, Pomf, Cloudku } from "@zanixongroup/uploader";

// Upload any file type
const fileBuffer = fs.readFileSync("./document.pdf");

// Choose any of these services
const catboxUrl = await Catbox(fileBuffer);
const pomfUrl = await Pomf(fileBuffer);
const cloudkuUrl = await Cloudku(fileBuffer);
```

### Error Handling

```javascript
import { Pomf } from "@zanixongroup/uploader";

try {
  const buffer = fs.readFileSync("./my-file.jpg");
  const url = await Pomf(buffer);
  console.log("✅ Upload successful:", url);
} catch (error) {
  console.error("❌ Upload failed:", error.message);
  // Handle error appropriately
}
```

---

## 📚 API Reference

### Available Functions

All upload functions accept a `Buffer` and return a `Promise<string>` with the file URL.

#### `Catbox(buffer: Buffer): Promise<string>`
Upload files to Catbox - supports all file types.

```javascript
const url = await Catbox(fileBuffer);
```

#### `Pomf(buffer: Buffer): Promise<string>`
Upload files to Pomf - supports all file types.

```javascript
const url = await Pomf(fileBuffer);
```

#### `Quax(buffer: Buffer): Promise<string>`
Upload media files to Quax - supports images, videos, and audio.

```javascript
const url = await Quax(fileBuffer);
```

#### `Videy(buffer: Buffer): Promise<string>`
Upload videos to Videy - optimized for video files.

```javascript
const url = await Videy(fileBuffer);
```

#### `Cloudku(buffer: Buffer): Promise<string>`
Upload files to Cloudku - supports all file types.

```javascript
const url = await Cloudku(fileBuffer);
```

#### `Picsur(buffer: Buffer): Promise<string>`
Upload images to Picsur - optimized for image files.

```javascript
const url = await Picsur(fileBuffer);
```

### Parameters

- **buffer** (`Buffer`): The file content as a Buffer

### Returns

- **Promise<string>**: A promise that resolves to the uploaded file URL

### Throws

- **Error**: If the upload fails or the service is unavailable

---

## 🛠 Contributing

We welcome contributions! If you want to add a new permanent hosting service or improve existing ones:

1. Fork this repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

**Note**: This modified version focuses on permanent hosting services only. Please ensure any new services provide permanent storage.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for more details.

---

## 🐞 Issues

Found a bug or have a feature suggestion? Open an [Issue](https://github.com/zanixongroup/uploader/issues). We'll respond as soon as possible.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/zanixongroup/uploader/blob/main/LICENSE) file for details.

---

<div align="center">

## 🙏 Credits

**Original Project**: [ZanixonGroup](https://github.com/zanixongroup)

**Modified by**: **lamvour** ⚡

---

Made with ❤️ for permanent file hosting

</div>
