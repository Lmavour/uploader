document.documentElement.classList.add("js-enabled");

const VIDEY_ENDPOINT = "https://videy.co/api/upload";
const VIDEY_CDN = "https://cdn.videy.co";
const MAX_FILE_SIZE = 1_000_000_000;
const ALLOWED_EXTENSIONS = new Set(["mp4", "mov"]);

const elements = {
  sourceGate: document.querySelector("#source-gate"),
  uploadInterface: document.querySelector("#upload-interface"),
  confirmSource: document.querySelector("#confirm-source"),
  form: document.querySelector("#upload-form"),
  fileInput: document.querySelector("#file-input"),
  dropZone: document.querySelector("#drop-zone"),
  dropEmpty: document.querySelector("#drop-empty"),
  fileSelection: document.querySelector("#file-selection"),
  fileExtension: document.querySelector("#file-extension"),
  fileName: document.querySelector("#file-name"),
  fileMeta: document.querySelector("#file-meta"),
  removeFile: document.querySelector("#remove-file"),
  uploadButton: document.querySelector("#upload-button"),
  uploadMessage: document.querySelector("#upload-message"),
  uploadProgress: document.querySelector("#upload-progress"),
  progressFileName: document.querySelector("#progress-file-name"),
  progressValue: document.querySelector("#progress-value"),
  progressTrack: document.querySelector(".progress-track"),
  progressBar: document.querySelector("#progress-bar"),
  cancelUpload: document.querySelector("#cancel-upload"),
  uploadResult: document.querySelector("#upload-result"),
  resultPreview: document.querySelector("#result-preview"),
  resultLink: document.querySelector("#result-link"),
  copyResult: document.querySelector("#copy-result"),
  openResult: document.querySelector("#open-result"),
  uploadAnother: document.querySelector("#upload-another"),
  toast: document.querySelector("#toast"),
};

const state = {
  selectedFile: null,
  request: null,
  resultUrl: "",
  toastTimer: null,
};

elements.confirmSource.addEventListener("click", () => {
  elements.sourceGate.hidden = true;
  elements.uploadInterface.hidden = false;
  elements.dropZone.focus({ preventScroll: true });
});

function getExtension(fileName) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension && extension !== fileName.toLowerCase() ? extension : "";
}

function formatBytes(bytes) {
  if (bytes === 0) return "0 B";

  const units = ["B", "KB", "MB", "GB"];
  const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** unitIndex;
  const precision = value >= 100 || unitIndex === 0 ? 0 : value >= 10 ? 1 : 2;

  return `${value.toFixed(precision)} ${units[unitIndex]}`;
}

function validateFile(file) {
  if (!file) return "Choose an MP4 or MOV file before uploading.";

  const extension = getExtension(file.name);
  if (!ALLOWED_EXTENSIONS.has(extension)) {
    return "This playground accepts MP4 and MOV videos. Use the Node SDK for other file types.";
  }

  if (file.size === 0) return "The selected file is empty.";
  if (file.size >= MAX_FILE_SIZE) return "The selected file must be smaller than 1 GB.";

  return "";
}

function setMessage(message = "") {
  elements.uploadMessage.textContent = message;
  elements.uploadMessage.hidden = !message;
}

function resetProgress() {
  elements.progressValue.textContent = "0%";
  elements.progressBar.style.width = "0%";
  elements.progressTrack.classList.remove("is-indeterminate");
  elements.progressTrack.setAttribute("aria-valuenow", "0");
}

function clearSelectedFile({ keepMessage = false } = {}) {
  state.selectedFile = null;
  elements.fileInput.value = "";
  elements.dropEmpty.hidden = false;
  elements.fileSelection.hidden = true;
  elements.uploadButton.disabled = true;
  if (!keepMessage) setMessage();
}

function selectFile(file) {
  const validationError = validateFile(file);
  if (validationError) {
    clearSelectedFile({ keepMessage: true });
    setMessage(validationError);
    return;
  }

  state.selectedFile = file;
  elements.fileExtension.textContent = getExtension(file.name).toUpperCase();
  elements.fileName.textContent = file.name;
  elements.fileMeta.textContent = `${formatBytes(file.size)} · ${file.type || "video file"}`;
  elements.dropEmpty.hidden = true;
  elements.fileSelection.hidden = false;
  elements.uploadButton.disabled = false;
  setMessage();
}

function showForm({ preserveFile = true } = {}) {
  elements.form.hidden = false;
  elements.uploadProgress.hidden = true;
  elements.uploadResult.hidden = true;
  elements.resultPreview.pause();
  elements.resultPreview.removeAttribute("src");
  elements.resultPreview.load();
  state.resultUrl = "";
  resetProgress();

  if (!preserveFile) clearSelectedFile();
}

function describeProviderError(responseText, status) {
  try {
    const payload = JSON.parse(responseText);
    const detail = payload.message || payload.error || payload.data?.message;
    if (typeof detail === "string" && detail.trim()) return detail.trim();
  } catch {
    if (responseText.trim() && responseText.length < 180) return responseText.trim();
  }

  return status ? `The provider rejected the upload with HTTP ${status}.` : "The provider did not return a valid response.";
}

function buildResultUrl(responseText, file) {
  let payload;
  try {
    payload = JSON.parse(responseText);
  } catch {
    throw new Error("The provider returned an unreadable response.");
  }

  const id = payload?.id ?? payload?.data?.id;
  if (typeof id !== "string" || !/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw new Error(describeProviderError(responseText, 0));
  }

  return `${VIDEY_CDN}/${encodeURIComponent(id)}.${getExtension(file.name)}`;
}

function showResult(url) {
  state.resultUrl = url;
  elements.uploadProgress.hidden = true;
  elements.uploadResult.hidden = false;
  elements.resultLink.href = url;
  elements.resultLink.textContent = url.replace(/^https?:\/\//, "");
  elements.openResult.href = url;
  elements.resultPreview.src = url;
  elements.resultPreview.load();
  elements.copyResult.focus({ preventScroll: true });
}

function failUpload(message) {
  state.request = null;
  showForm({ preserveFile: true });
  setMessage(message);
  elements.uploadButton.focus({ preventScroll: true });
}

function startUpload(file) {
  const formData = new FormData();
  formData.append("file", file, file.name);

  const request = new XMLHttpRequest();
  state.request = request;
  elements.form.hidden = true;
  elements.uploadResult.hidden = true;
  elements.uploadProgress.hidden = false;
  elements.progressFileName.textContent = file.name;
  resetProgress();

  request.open("POST", VIDEY_ENDPOINT);

  request.upload.addEventListener("progress", (event) => {
    if (!event.lengthComputable) {
      elements.progressTrack.classList.add("is-indeterminate");
      elements.progressValue.textContent = "Sending";
      elements.progressTrack.removeAttribute("aria-valuenow");
      return;
    }

    const percentage = Math.min(99, Math.round((event.loaded / event.total) * 100));
    elements.progressTrack.classList.remove("is-indeterminate");
    elements.progressValue.textContent = `${percentage}%`;
    elements.progressBar.style.width = `${percentage}%`;
    elements.progressTrack.setAttribute("aria-valuenow", String(percentage));
  });

  request.addEventListener("load", () => {
    if (state.request !== request) return;
    state.request = null;

    if (request.status < 200 || request.status >= 300) {
      failUpload(describeProviderError(request.responseText, request.status));
      return;
    }

    try {
      const resultUrl = buildResultUrl(request.responseText, file);
      elements.progressValue.textContent = "100%";
      elements.progressBar.style.width = "100%";
      elements.progressTrack.setAttribute("aria-valuenow", "100");
      window.setTimeout(() => showResult(resultUrl), 220);
    } catch (error) {
      failUpload(error instanceof Error ? error.message : "The upload completed without a usable URL.");
    }
  });

  request.addEventListener("error", () => {
    if (state.request !== request) return;
    failUpload(
      "The browser could not reach the provider. Its API may be offline or blocking this origin; your file was not sent through our server.",
    );
  });

  request.addEventListener("abort", () => {
    if (state.request !== request) return;
    state.request = null;
    showForm({ preserveFile: true });
    setMessage("Upload cancelled. The selected file is still ready to retry.");
  });

  request.send(formData);
}

elements.dropZone.addEventListener("click", (event) => {
  if (event.target.closest("#remove-file") || state.request) return;
  elements.fileInput.click();
});

elements.dropZone.addEventListener("keydown", (event) => {
  if ((event.key === "Enter" || event.key === " ") && !state.request) {
    event.preventDefault();
    elements.fileInput.click();
  }
});

elements.fileInput.addEventListener("change", () => {
  selectFile(elements.fileInput.files?.[0]);
});

for (const eventName of ["dragenter", "dragover"]) {
  elements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    if (!state.request) elements.dropZone.classList.add("is-dragging");
  });
}

for (const eventName of ["dragleave", "drop"]) {
  elements.dropZone.addEventListener(eventName, (event) => {
    event.preventDefault();
    elements.dropZone.classList.remove("is-dragging");
  });
}

elements.dropZone.addEventListener("drop", (event) => {
  if (state.request) return;
  const files = [...(event.dataTransfer?.files ?? [])];
  if (!files[0]) return;

  selectFile(files[0]);
  if (files.length > 1 && state.selectedFile) {
    setMessage("Choose one file at a time. The first file was selected.");
  }
});

elements.removeFile.addEventListener("click", (event) => {
  event.stopPropagation();
  clearSelectedFile();
  elements.dropZone.focus();
});

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();
  const validationError = validateFile(state.selectedFile);
  if (validationError) {
    setMessage(validationError);
    return;
  }

  setMessage();
  startUpload(state.selectedFile);
});

elements.cancelUpload.addEventListener("click", () => {
  state.request?.abort();
});

elements.uploadAnother.addEventListener("click", () => {
  showForm({ preserveFile: false });
  elements.dropZone.focus();
});

async function copyText(value) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = value;
  textArea.setAttribute("readonly", "");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.append(textArea);
  textArea.select();
  const copied = document.execCommand("copy");
  textArea.remove();
  if (!copied) throw new Error("Copy failed");
}

function showToast(message = "Copied to clipboard") {
  window.clearTimeout(state.toastTimer);
  elements.toast.querySelector("span").textContent = message;
  elements.toast.hidden = false;
  state.toastTimer = window.setTimeout(() => {
    elements.toast.hidden = true;
  }, 2100);
}

async function copyWithFeedback(value, button) {
  try {
    await copyText(value);
    showToast();

    const label = button?.querySelector("span");
    if (label) {
      const previousLabel = label.textContent;
      label.textContent = "Copied";
      window.setTimeout(() => {
        label.textContent = previousLabel;
      }, 1500);
    }
  } catch {
    showToast("Copy failed. Select the text manually.");
  }
}

elements.copyResult.addEventListener("click", () => {
  if (state.resultUrl) copyWithFeedback(state.resultUrl, elements.copyResult);
});

document.querySelectorAll("[data-copy-value]").forEach((button) => {
  button.addEventListener("click", () => copyWithFeedback(button.dataset.copyValue, button));
});

const codeTabs = [...document.querySelectorAll("[data-code-tab]")];
const codePanels = [...document.querySelectorAll("[data-code-panel]")];

function activateCodeTab(tabName, { focus = false } = {}) {
  for (const tab of codeTabs) {
    const isActive = tab.dataset.codeTab === tabName;
    tab.classList.toggle("active", isActive);
    tab.setAttribute("aria-selected", String(isActive));
    tab.tabIndex = isActive ? 0 : -1;
    if (isActive && focus) tab.focus();
  }

  for (const panel of codePanels) {
    const isActive = panel.dataset.codePanel === tabName;
    panel.classList.toggle("active", isActive);
    panel.hidden = !isActive;
  }
}

for (const tab of codeTabs) {
  tab.addEventListener("click", () => activateCodeTab(tab.dataset.codeTab));
  tab.addEventListener("keydown", (event) => {
    const currentIndex = codeTabs.indexOf(tab);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % codeTabs.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + codeTabs.length) % codeTabs.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = codeTabs.length - 1;
    if (nextIndex === currentIndex) return;

    event.preventDefault();
    activateCodeTab(codeTabs[nextIndex].dataset.codeTab, { focus: true });
  });
}

document.querySelector("[data-copy-active-code]").addEventListener("click", (event) => {
  const activeCode = document.querySelector("[data-code-panel].active code");
  if (activeCode) copyWithFeedback(activeCode.textContent, event.currentTarget);
});

const revealItems = [...document.querySelectorAll(".reveal")];
if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    },
    { rootMargin: "0px 0px -9%", threshold: 0.08 },
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const docsLinks = [...document.querySelectorAll(".docs-navigation a")];
const docsArticles = [...document.querySelectorAll(".docs-article")];

function activateDocsArticle(articleId, { focus = false, updateHash = false } = {}) {
  const selectedArticle = docsArticles.find((article) => article.id === articleId);
  if (!selectedArticle) return;

  for (const link of docsLinks) {
    const isActive = link.hash === `#${articleId}`;
    link.classList.toggle("active", isActive);
    link.setAttribute("aria-selected", String(isActive));
    link.tabIndex = isActive ? 0 : -1;
    if (isActive && focus) link.focus();
  }

  for (const article of docsArticles) {
    const isActive = article === selectedArticle;
    article.hidden = !isActive;
    if (isActive) article.classList.add("is-visible");
  }

  if (updateHash) history.replaceState(null, "", `#${articleId}`);
}

for (const link of docsLinks) {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    activateDocsArticle(link.hash.slice(1), { updateHash: true });
  });

  link.addEventListener("keydown", (event) => {
    const currentIndex = docsLinks.indexOf(link);
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight" || event.key === "ArrowDown") {
      nextIndex = (currentIndex + 1) % docsLinks.length;
    }
    if (event.key === "ArrowLeft" || event.key === "ArrowUp") {
      nextIndex = (currentIndex - 1 + docsLinks.length) % docsLinks.length;
    }
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = docsLinks.length - 1;
    if (nextIndex === currentIndex) return;

    event.preventDefault();
    const nextArticleId = docsLinks[nextIndex].hash.slice(1);
    activateDocsArticle(nextArticleId, { focus: true, updateHash: true });
  });
}

const initialDocsArticle = docsArticles.some((article) => `#${article.id}` === location.hash)
  ? location.hash.slice(1)
  : "quick-start";
activateDocsArticle(initialDocsArticle);

window.addEventListener("hashchange", () => {
  const articleId = location.hash.slice(1);
  if (docsArticles.some((article) => article.id === articleId)) activateDocsArticle(articleId);
});
