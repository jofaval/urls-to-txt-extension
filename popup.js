function loadContent() {
  chrome.tabs.query({}, (tabs) => {
    const content = tabs.map((tab) => `${tab.title}\n${tab.url}\n\n`).join("");

    document.getElementById("tabsInfo").value = content;
  });
}

document.addEventListener("DOMContentLoaded", loadContent);
document.getElementById("resetButton").addEventListener("click", loadContent);

/**
 * @returns {string}
 */
function getFilename() {
  const now = new Date().toISOString();
  const date = now.replace(/[-:.]/g, "_").replace("T", "-").split(".")[0];

  return `tabs-${date}.txt`;
}

document.getElementById("saveButton").addEventListener("click", () => {
  const textAreaContent = document.getElementById("tabsInfo").value;

  const blob = new Blob([textAreaContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  chrome.downloads.download({ url, filename: getFilename() });
});

/**
 * @param {string} url
 */
function validUrl(url) {
  return url.trim() !== "" && url.startsWith("http");
}

document.getElementById("openTabsButton").addEventListener("click", () => {
  const textAreaContent = document.getElementById("tabsInfo").value;
  const urls = textAreaContent.split("\n").filter(validUrl);

  chrome.tabs.query({}, (tabs) => {
    const openUrls = tabs.map((tab) => tab.url);
    const unopenedUrls = urls.filter((url) => !openUrls.includes(url));

    unopenedUrls.forEach((url) => chrome.tabs.create({ url }));
  });
});
