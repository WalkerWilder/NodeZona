const { usuarioModelo } = require('../models/usuarios.js');
const md5 = require('MD5');

const verificaAcesso = async (usuario, senha) => {
	let ret = -1;
	let nesha = md5(senha + global.SALT_KEY);
	await usuarioModelo.find({ usuario: usuario, senha: nesha }, (err, res) => {
		if (err) ret = -1;
		if (res.length > 0) {
			ret = 1;
		} else {
			ret = 0;
		}
	});
	return ret;
}

module.exports = { verificaAcesso };