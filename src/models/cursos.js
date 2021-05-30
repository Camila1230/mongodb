const mongoose = require('mongoose')

const Schema = mongoose.Schema;
const cursosSchema = new Schema ({
	id : {
		type : Number,
		required : true
	},
	nombre : {
		type : String,
		required : true,
		trim : true
	},
	modalidad : {
		type : String,
		required : true
	},
    valor : {
		type : Number,
		required : true,
		trim : true,
        default : "123456789"
	},
	descripcion : {
		type : String,
		trim: true
	},
	intensidad : {
		type : Number,
		trim: true
	},
	estado : {
		type : String,
		trim: true
	}
});

const Curso = mongoose.model('Curso', cursosSchema);
module.exports = Curso