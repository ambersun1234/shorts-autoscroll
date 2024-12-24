function waitUntil(selector) {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations) => {
      if (document.querySelector(selector)) {
        observer.disconnect();
        resolve(document.querySelector(selector));
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  });
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "executeScript") {
    waitUntil(".ytPlayerProgressBarDragContainer").then((scrubber) => {
      console.log(`ShortScroller: auto scroll for ${message.url}`);

      let observer;
      document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          observer.disconnect();
        }
      });

      const s = new Set();
      observer = new MutationObserver(function () {
        const step = scrubber.getAttribute("aria-valuenow");
        if (s.has(step)) {
          document.querySelector("#navigation-button-down button").click();
          observer.disconnect();
        }
        s.add(step);
      });

      observer.observe(scrubber, {
        attributes: true,
      });
    });
  }
});
