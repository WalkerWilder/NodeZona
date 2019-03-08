$(function(){
	let params = getAllUrlParams(document.URL);
	let origem = params['origem'] || '/index.html';
	$('#login').attr('action', '/login.html' + encodeURIComponent(origem));
});