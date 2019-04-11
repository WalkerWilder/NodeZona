const { portaModelo } = require('../models/portas.js');

const portasAtivas = async () => {
	// return [1,2,3];
	let ret = [];
	await portaModelo.find({ ativo: true }, (e, r) => {
		ret = r;
	});
	return ret;
};

const adicionarPorta = (porta) => {
	portaModelo.findOneAndUpdate(
		{
			porta: porta.porta
		}, {
			$set: porta
		}, {
			upsert: true,
			new: true
		}
	).exec();
};

module.exports = { portasAtivas, adicionarPorta };