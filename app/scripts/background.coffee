'use strict';

# this script is used in background.html

chrome.runtime.onInstalled.addListener (details) ->
  console.log('previousVersion', details.previousVersion)

# get host name
getHostName = (href) ->
    l = document.createElement('a')
    l.href = href
    l

# update bagde text
updateBadge = (getCount)->
  chrome.browserAction.setBadgeText({text: "#{getCount}"})

# calls when tab is activated
chrome.tabs.onActivated.addListener (activeInfo) ->
  chrome.tabs.get activeInfo.tabId, (tab) ->
    host = getHostName(tab.url)
    # check protocols
    if host.protocol == "http:" or host.protocol == "https:"
      if host.hostname
      	getCount = Backend.getCount(host.hostname)
      updateBadge getCount