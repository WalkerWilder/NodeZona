//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var Schema = mongoose.Schema;

var usuario = new Schema({
	usuario: String,
	senha: String
});

var usuarioModelo = mongoose.model('usuario', usuario );

module.exports = {usuarioModelo};