var ajxDat;

$(function(){
	$.ajax({
		url: 'ajax.js',
		method: 'POST',
		headers: {
			'func': 'teste',
		},
		beforeSend : function(){
			if(ajxDat != null) {
				ajxDat.abort();
			}
		},
	}).done(function(data) {
		console.log('Fim');
		console.log(data);
	});
	console.log('Teste');
});