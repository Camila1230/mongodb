const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const matriculadosSchema = new Schema ({
	cedula : {
		type : Number,
		required : true
	},
	nombre : {
		type : String,
		required : true,
		trim : true
	},
	telefono : {
		type : Number,
		required : true
	},
    contrasena : {
		type : String,
		required : true,
		trim : true,
        default : "123456789"
	},
	correo : {
		type : String,
		trim: true
	},
	cursos : [{
		type : Schema.Types.ObjectId,
		ref: 'Curso' 
	}]
});

const Matriculado = mongoose.model('Matriculados', matriculadosSchema);
module.exports = Matriculado