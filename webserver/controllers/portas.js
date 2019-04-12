const { adicionarPorta, portasAtivas, alteraPorta } = require('./../repositories/portas.js');

const adicionarControle = async (req, res) => {
	await adicionarPorta({
		porta: 1,
		apelido: 'Testeasdf',
		estado: true,
		ativo: true
	});
	res.end();
}

const listaPortasAtivas = async (req, res) => {
	let ret = await portasAtivas();
	let portas = [];
	for (let i = 0; i < ret.length; i++) {
		const porta = ret[i];
		portas.push(porta.porta);
	}
	res.json(portas)
	res.end();
};

const listaControles = async (req, res) => {
	let ret = await portasAtivas(req.headers.filtro);
	let html = '';
	for (let i = 0; i < ret.length; i++) {
		const controle = ret[i];
		// html += controle.apelido;
		let estado = (controle.estado) ? 'ativo' : 'inativo';
		html += `<div class='controle'>\
					<div class='top'>\
						<p>${controle.apelido}</p>\
						<div class='config'>\
							<img fonte='img/config.svg'>\
						</div>\
					</div>\
					<div class='interruptor ${estado}' ativo='${controle.estado}' porta='${controle.porta}'>\
						<img fonte='img/power.svg'>\
					</div>\
				</div>`;
	}
	res.json({ html });
	res.end();
};

const alteraEstado = async (req, res) => {
	let porta = req.body.porta;
	let estado = req.body.estado;
	let ret = await alteraPorta(porta, estado);
	res.json(ret);
	res.end();
}

module.exports = { adicionarControle, listaPortasAtivas, listaControles, alteraEstado };