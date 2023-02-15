function saveCurrentUrl() {
    chrome.runtime.sendMessage({ type: 'saveCurrentUrl' }, function() {
      displayUrls();
    });
  }
  
  function openAllUrls() {
    chrome.storage.local.get(['urls'], function(result) {
      const urls = result.urls || {};
      const numTabs = chrome.tabs.query({ currentWindow: true }, function(tabs) {
        if (tabs.length === 1) {
          // If there's only one tab in the current window, open all urls in that tab.
          for (const domain in urls) {
            const url = urls[domain];
            chrome.tabs.create({ url: url });
          }
        } else {
          // If there are multiple tabs in the current window, open all urls in a new window.
          const urlsArray = Object.values(urls);
          chrome.windows.create({ url: urlsArray });
        }
      });
    });
  }
  
  function removeUrl(domain) {
    chrome.storage.local.get(['urls'], function(result) {
      const urls = result.urls || {};
      delete urls[domain];
      chrome.storage.local.set({ urls: urls }, function() {
        displayUrls();
      });
    });
  }
  
  function displayUrls() {
    chrome.storage.local.get(['urls'], function(result) {
      const urls = result.urls || {};
      const urlsList = document.getElementById('urls-list');
      urlsList.innerHTML = '';
      let count = 1;
      for (const domain in urls) {
        const url = urls[domain];
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = url;
        a.target = '_blank'; // add this line to open the link in a new tab
        a.textContent = `${count++}. ${domain}`;
        li.appendChild(a);
        const button = document.createElement('button');
        button.textContent = 'x';
        button.innerHTML = "&times;"
        button.addEventListener('click', function() {
          removeUrl(domain);
        });
        li.appendChild(button);
        urlsList.appendChild(li);
      }
    });
  }
  
  
  document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('save-button').addEventListener('click', saveCurrentUrl);
    document.getElementById('open-all-button').addEventListener('click', openAllUrls);
    displayUrls();
  });
    
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.type === 'urlSaved') {
      displayUrls();
    }
  });
  