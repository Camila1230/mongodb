require('./config');
const express = require ("express")
const app = express()
const path = require('path')
const hbs = require ('hbs')
const bodyParser = require('body-parser')
const mongoose = require ('mongoose')
require ('./helpers/helpers')
const session = require('express-session')
var MemoryStore = require('memorystore')(session)

//Path
const dirPublic = path.join(__dirname, '../public')
const dirViews = path.join(__dirname, '../template/views'); 
const dirPartials = path.join(__dirname, '../template/partials');

app.use(session({
	cookie: { maxAge: 86400000 },
 	store: new MemoryStore({
      	checkPeriod: 86400000 // prune expired entries every 24h
    	}),
  	secret: 'keyboard cat',
  	resave: true,
  	saveUninitialized: true
}))

app.use((req, res, next) =>{
	if(req.session.usuario){		
		res.locals.sesion = true
		res.locals.nombre = req.session.nombre
	}	
	next()
})


app.set ('view engine', 'hbs')
app.set ('views', dirViews)
hbs.registerPartials(dirPartials)

app.use(express.static(dirPublic))
app.use(bodyParser.urlencoded({extended: false}))
app.use(require('./routes/index.js'))

app.listen(process.env.PORT||3000,() => {
  console.log(`server en port ${process.env.PORT||3000}`)
});

 mongoose.connect(process.env.URLDB, {useNewUrlParser: true, useUnifiedTopology: true}, (err, resultado) => {
 	if (err){
 		return console.log(error)
 	}
 	console.log("conectado")
 });

/*mongoose.connect(urlDB ='mongodb://localhost:27017/MisCursos', {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false }, (err, resultado)=>{
	if (err) {
		console.log("error al conectar")
	}
	console.log("conectado a la BD")
});*/

