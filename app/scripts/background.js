(function() {
  'use strict';
  var getHostName, updateBadge;

  chrome.runtime.onInstalled.addListener(function(details) {
    return console.log('previousVersion', details.previousVersion);
  });

  getHostName = function(href) {
    var l;
    l = document.createElement('a');
    l.href = href;
    return l;
  };

  updateBadge = function(getCount) {
    return chrome.browserAction.setBadgeText({
      text: "" + getCount
    });
  };

  chrome.tabs.onActivated.addListener(function(activeInfo) {
    return chrome.tabs.get(activeInfo.tabId, function(tab) {
      var getCount, host;
      host = getHostName(tab.url);
      if (host.protocol === "http:" || host.protocol === "https:") {
        if (host.hostname) {
          getCount = Backend.getCount(host.hostname);
        }
        return updateBadge(getCount);
      }
    });
  });

}).call(this);
