(function() {
  'use strict';
  var Stat, getHostName, saveInfo, validateEmail;

  console.log("popup.js");

  Stat = {
    data: {},
    cur: null
  };

  chrome.storage.sync.get('disqus.data', function(item) {
    if (item['disqus.data']) {
      return Stat.data = JSON.parse(item['disqus.data']);
    }
  });

  saveInfo = function(url) {
    var lst;
    if (Stat.cur) {
      lst = Stat.data[Stat.cur];
    }
    Stat.cur = url;
    lst = Stat.data[url] || [];
    lst.push($('#inputName').val());
    lst.push($('#inputEmail').val());
    Stat.data[url] = lst;
    return chrome.storage.sync.set({
      'disqus.data': JSON.stringify(Stat.data)
    });
  };

  validateEmail = function(email) {
    var re;
    re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
  };

  if ($('#inputEmail').val() === '' || $('#inputEmail').val() === null && $('#inputName').val() === '' || $('#inputName').val() === null) {
    $("#inputComment").attr("disabled", "");
  }

  $('#inputEmail').on('focusout', function(e) {
    if ($('#inputEmail').val() !== '' && $('#inputName').val() !== '' && validateEmail($('#inputEmail').val())) {
      return $("#inputComment").removeAttr("disabled");
    } else {
      return $("#inputComment").attr("disabled", "");
    }
  });

  $('#inputName').on('focusout', function(e) {
    if ($('#inputEmail').val() !== '' && $('#inputName').val() !== '' && validateEmail($('#inputEmail').val())) {
      return $("#inputComment").removeAttr("disabled");
    } else {
      return $("#inputComment").attr("disabled", "");
    }
  });

  $('#inputComment').on('keyup', function(e) {
    console.log('keyup');
    if (e.keyCode === 13) {
      chrome.tabs.query({
        active: true,
        currentWindow: true
      }, function(tab) {
        saveInfo(getHostName(tab[0].url).host);
        Backend.newComment(getHostName(tab[0].url).host, $('#inputName').val(), $('#inputEmail').val(), $('#inputComment').val());
        $('#inputComment').html('');
      });
    }
  });

  getHostName = function(href) {
    var l;
    l = document.createElement('a');
    l.href = href;
    return l;
  };

  chrome.tabs.query({
    active: true,
    currentWindow: true
  }, function(tab) {
    var lst;
    Backend.getComments(getHostName(tab[0].url).host);
    lst = Stat.data[getHostName(tab[0].url).host];
    if (lst) {
      $('#inputEmail').val(lst[lst.length - 1]);
      $('#inputName').val(lst[lst.length - 2]);
    }
  });

}).call(this);
