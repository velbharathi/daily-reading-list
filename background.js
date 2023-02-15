function saveUrl() {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      const url = tabs[0].url;
      const domain = getDomainFromUrl(url);
      chrome.storage.local.get(['urls'], function(result) {
        let urls = result.urls || {};
        urls[domain] = url;
        chrome.storage.local.set({ urls }, function() {
            chrome.runtime.sendMessage({ type: 'urlSaved' });
          });
      });
    });
  }
  
  function getDomainFromUrl(url) {
    const a = document.createElement('a');
    a.href = url;
    return a.hostname;
  }
  
  chrome.browserAction.onClicked.addListener(saveUrl);
  
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'saveCurrentUrl') {
      saveUrl();
    }
  });
  