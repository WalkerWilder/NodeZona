const criarControles = (local, filtro) => {
	let ajxDat;
	$.ajax({
		url: 'portas.js',
		method: 'POST',
		headers: {
			'func': 'listaControles',
			'filtro': filtro
		},
		beforeSend: function () {
			if (ajxDat != null) {
				ajxDat.abort();
			}
		},
	}).done(function (data) {
		$(local).html(data.html);
		getImages(vinculaControles);
	});
};

const vinculaControles = () => {
	$('.controle .config > svg').off('click');
	$('.controle .config > svg').click(() => {
		console.log('config');
	});

	$('.controle .interruptor > svg').off('click');
	$('.controle .interruptor > svg').click((e) => {
		let estado = e.currentTarget.parentElement.getAttribute('ativo');
		let porta = e.currentTarget.parentElement.getAttribute('porta');
		estado = (estado == 'true') ? false : true;

		let ajxDat;
		$.ajax({
			url: 'portas.js',
			method: 'POST',
			headers: {
				'func': 'alteraEstado',
			},
			data: {
				porta: porta,
				estado: estado
			},
			beforeSend: function () {
				if (ajxDat != null) {
					ajxDat.abort();
				}
			},
		}).done(function () {
			e.currentTarget.parentElement.setAttribute('ativo', estado)
			if (estado) {
				e.currentTarget.parentElement.className = e.currentTarget.parentElement.className.replace(/\binativo\b/g, "ativo");
			} else {
				e.currentTarget.parentElement.className = e.currentTarget.parentElement.className.replace(/\bativo\b/g, "inativo");
			}
		});
	});
};