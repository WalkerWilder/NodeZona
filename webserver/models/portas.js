var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var porta = new Schema({
	porta: {
		type: Number,
		required: true,
		index: {
			unique: true,
		}
	},
	apelido: {
		type: String,
		required: true
	},
	estado: {
		type: Boolean,
		required: true
	},
	ativo: {
		type: Boolean,
		required: true
	}
})

var portaModelo = mongoose.model('porta', porta, 'portas');

module.exports = { portaModelo };