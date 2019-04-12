
$(() => {
	let ajxDat;
	$.ajax({
		url: 'ajax.js',
		method: 'POST',
		headers: {
			'func': 'headers',
		},
		beforeSend: function () {
			if (ajxDat != null) {
				ajxDat.abort();
			}
		},
	}).done(function (data) {
		$('#menu').html(JSON.parse(data) + $('#menu').html());
	});
	getImages();
});

var getImages = (end) => {
	let ajxDat;
	const images = document.querySelectorAll('img');
	images.forEach((a) => {
		if (a.hasAttribute('fonte')) {
			let fonte = a.getAttribute('fonte');
			$.ajax({
				url: fonte,
				method: 'GET',
				beforeSend : function(){
					if(ajxDat != null) {
						ajxDat.abort();
					}
				},
			}).done(function(data) {
				$('img[fonte="' + fonte + '"]').replaceWith(data.documentElement);
				if (end) {
					end();
				}
			});
		}
	})
}