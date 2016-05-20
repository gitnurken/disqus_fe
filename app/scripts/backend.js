(function() {
  'use strict';
  var $this, module, total_count, urlBackend;

  module = typeof exports !== "undefined" && exports !== null ? exports : this;

  urlBackend = 'http://localhost:8000/api/comment/';

  total_count = 0;

  $this = {
    getComments: function(url, callback, errback) {
      var comments, hr;
      comments = document.getElementById('comments');
      hr = new XMLHttpRequest;
      hr.open('GET', urlBackend, true);
      hr.setRequestHeader('Content-type', 'application/json', true);
      total_count = 0;
      hr.onreadystatechange = function() {
        var data, gravatar, i, tableComment, _i, _len, _ref;
        if (hr.readyState === 4 && hr.status === 200) {
          data = JSON.parse(hr.responseText);
          _ref = data.objects;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            if (i.url === url) {
              total_count++;
              gravatar = '<img src = https://s.gravatar.com/avatar/' + hex_md5(i.email) + '?s=64 />';
              tableComment = '<table> <tr><td>' + gravatar + '</td> <td><h4  style="margin-top:0px;">' + i.name + '</h4><h5>' + i.comment + '</h5></td> <td style="vertical-align:top; padding-left:120px;"><h6>' + (i.pub_date.substring(0, 10)) + '</h6></td></tr></table></br>';
              $('#count').html(total_count + ' Comment');
              $('#comments').append(tableComment);
            }
          }
        }
      };
      return hr.send(null);
    },
    getCount: function(url, callback, errback) {
      var count, xhr;
      count = 0;
      xhr = new XMLHttpRequest;
      xhr.open('GET', urlBackend, true);
      xhr.setRequestHeader('Content-type', 'application/json', true);
      xhr.send(null);
      return xhr.onload = function(e) {
        var data, i, _i, _len, _ref;
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            data = JSON.parse(xhr.responseText);
            _ref = data.objects;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              i = _ref[_i];
              if (url === i.url) {
                count++;
              }
            }
            chrome.browserAction.setBadgeText({
              text: '' + count
            });
          } else {
            console.error(xhr.statusText);
          }
        }
      };
    },
    newComment: function(url, name, email, comment, callback, errback) {
      var json, xhr;
      xhr = new XMLHttpRequest;
      json = JSON.stringify({
        url: url,
        name: name,
        email: email,
        comment: comment
      });
      xhr.open('POST', urlBackend, true);
      xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
      xhr.onreadystatechange = function() {
        if (this.readyState !== 4) {
          return;
        }
        alert(this.responseText);
      };
      return xhr.send(json);
    }
  };

  module.Backend = $this;

}).call(this);
