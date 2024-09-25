let debounceTimer;

chrome.tabs.onUpdated.addListener((tabId, info, tab) => {
  if (info.status === "complete") {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      chrome.tabs.sendMessage(tabId, {
        action: "executeScript",
        url: tab.url,
      });
    }, 500);
  }
});
