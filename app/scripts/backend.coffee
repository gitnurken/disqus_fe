'use strict';

# this script is supposed to have backend related code

module = exports ? this

# our host for requests
urlBackend = 'http://localhost:8000/api/v1/comment/'
# count sum of comments
total_count = 0

$this =
  # returns all our comments
  getComments: (url, callback, errback) ->
    # get div by id comments
    comments = document.getElementById('comments')
    # create our GET request
    hr = new XMLHttpRequest
    hr.open 'GET', urlBackend, true
    hr.setRequestHeader 'Content-type', 'application/json', true
    total_count = 0
    hr.onreadystatechange = ->
      if hr.readyState == 4 and hr.status == 200
        data = JSON.parse(hr.responseText)
        for i in data.objects
          if i.url == url
            total_count++
            # load our comments
            gravatar = '<img src = https://s.gravatar.com/avatar/' + hex_md5(i.email) + '?s=64 />'
            tableComment = '<table>
                              <tr><td>' + gravatar + '</td>
                        
                              <td><h4  style="margin-top:0px;">' + i.name + '</h4><h5>' + i.comment + '</h5></td>
                            
                              <td style="vertical-align:top; padding-left:120px;"><h6>' + (i.pub_date.substring 0, 10) + '</h6></td></tr></table></br>'
            # append this new table to some div, or whatever
            $('#count').html(total_count + ' Comment')
            # append our table to div 
            $('#comments').append tableComment
      return

    hr.send null
    
  # count comments of this url
  getCount: (url, callback, errback)->
    count = 0
    # create request
    xhr = new XMLHttpRequest
    xhr.open 'GET', urlBackend, true
    xhr.setRequestHeader 'Content-type', 'application/json', true
    xhr.send null
    xhr.onload = (e) ->
      if xhr.readyState == 4
        if xhr.status == 200
          data = JSON.parse(xhr.responseText)
          for i in data.objects
            if url == i.url
              count++
          # show sum of comments on extension image
          chrome.browserAction.setBadgeText({text: '' + count})
        else
          console.error xhr.statusText
      return

  # create new comment for this url
  newComment: (url, name, email, comment, callback, errback) ->
    # create POST request
    xhr = new XMLHttpRequest
    json = JSON.stringify(
      url: url
      name: name
      email: email
      comment: comment)

    xhr.open 'POST', urlBackend, true
    xhr.setRequestHeader 'Content-type', 'application/json; charset=utf-8'

    xhr.onreadystatechange = ->
      if @readyState != 4
        return
      alert @responseText
      return

    # console.log json
    xhr.send json

# exports Backend variable
module.Backend = $this