function loadContent() {
  chrome.tabs.query({}, (tabs) => {
    let content = "";

    tabs.forEach((tab) => {
      content += `${tab.title}\n${tab.url}\n\n`;
    });

    document.getElementById("tabsInfo").value = content;
  });
}

(() => {
  loadContent();
})();

document.getElementById("saveButton").addEventListener("click", () => {
  chrome.tabs.query({}, () => {
    const textAreaContent = document.getElementById("tabsInfo").value;

    const blob = new Blob([textAreaContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const date = new Date().toISOString().replace(/[-:.]/g, "_").replace("T", "-").split(".")[0];
    const filename = `tabs-${date}.txt`;

    chrome.downloads.download({
      url: url,
      filename: filename,
    });
  });
});

document.getElementById("resetButton").addEventListener("click", () => {
  loadContent();
});
