'use strict';

# this script is used in popup.html
console.log("popup.js")

# use Stat for saving email and name
Stat =
  data: {}
  cur: null

# get our email and name from storage
chrome.storage.sync.get 'disqus.data', (item) ->
  if item['disqus.data']
    Stat.data = JSON.parse(item['disqus.data'])

# save email and name to chrome.storage in json type
saveInfo = (url) ->
  if Stat.cur
  	lst = Stat.data[Stat.cur]
  Stat.cur = url
  lst = Stat.data[url] or []
  lst.push($('#inputName').val())
  lst.push($('#inputEmail').val())
  Stat.data[url] = lst
  chrome.storage.sync.set {'disqus.data': JSON.stringify(Stat.data)}

# check email and name fields on bugs, like not filled, not write email and etc...
validateEmail = (email) ->
  re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i
  re.test email

if $('#inputEmail').val() == '' || $('#inputEmail').val() == null && $('#inputName').val() == '' || $('#inputName').val() == null
	$( "#inputComment" ).attr( "disabled", "" );

$('#inputEmail').on 'focusout', (e) ->
	if $('#inputEmail').val() != '' && $('#inputName').val() != '' && validateEmail $('#inputEmail').val()
		$( "#inputComment" ).removeAttr("disabled")
	else
		$( "#inputComment" ).attr( "disabled", "" )

$('#inputName').on 'focusout', (e) ->
	if $('#inputEmail').val() != '' && $('#inputName').val() != '' && validateEmail $('#inputEmail').val()
		$( "#inputComment" ).removeAttr("disabled")
	else
		$( "#inputComment" ).attr( "disabled", "" )

# check enter pressed or not
$('#inputComment').on 'keyup', (e) ->
	console.log('keyup');
	# keyCode of enter equal to 13
	if e.keyCode == 13
		# get tab url from chrome method
		chrome.tabs.query {
			active: true
			currentWindow: true
			}, (tab) ->
				# save
				saveInfo getHostName(tab[0].url).host
				# create new comment
				Backend.newComment(getHostName(tab[0].url).host, $('#inputName').val(), $('#inputEmail').val(), $('#inputComment').val())
				$('#inputComment').html('')
				return    
  	return

# get host name
getHostName = (href) ->
	l = document.createElement('a')
	l.href = href
	l

# get from data by host our email and name, and put this value to need fields
chrome.tabs.query {
  active: true
  currentWindow: true
}, (tab) ->
	Backend.getComments(getHostName(tab[0].url).host)
	lst = Stat.data[getHostName(tab[0].url).host]
	if(lst)
		$('#inputEmail').val(lst[lst.length-1])
		$('#inputName').val(lst[lst.length-2])
	return