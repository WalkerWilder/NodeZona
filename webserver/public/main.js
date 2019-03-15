var ajxDat;

$(()=>{
	$.ajax({
		url: 'ajax.js',
		method: 'POST',
		headers: {
			'func': 'headers',
		},
		beforeSend : function(){
			if(ajxDat != null) {
				ajxDat.abort();
			}
		},
	}).done(function(data) {
		$('#menu').html(JSON.parse(data) + $('#menu').html());
	});
});