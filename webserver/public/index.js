var ajxDat;

$(() => {
	$.ajax({
		url: 'index.js',
		method: 'POST',
		headers: {
			'func': 'listaControles',
		},
		beforeSend: function () {
			if (ajxDat != null) {
				ajxDat.abort();
			}
		},
	}).done(function (data) {
		$('#conteudo').html(data.html);
		getImages();
	});
});