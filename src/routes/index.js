const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const bodyParser = require('body-parser')
require('./../helpers/helpers')
const dirPublic = path.join(__dirname, "../../public")
const dirViews = path.join(__dirname, "../../template/views")
const dirPartials = path.join(__dirname, '../../template/partials')
const Matriculado = require('../models/matriculados')
const Curso = require('../models/cursos')

//hbs
app.set('view engine', 'hbs');
app.set('views', dirViews);
hbs.registerPartials(dirPartials)

//Paginas
app.get('/', function (req, res) {
    res.render('index', {
    })
})
app.get('/index', function (req, res) {
    res.render('index', {
    })
})

app.post('/index', function (req, res) {
    user=req.body.usuario;
    password=req.body.contrasena;
    Matriculado.findOne({nombre:user},(err, estudiante)=>{
        if (err) return (err)
        var texto="";
        if(estudiante){
            if(estudiante.contrasena==password){
                texto="Bienvenido"
                req.session.usuario = estudiante._id;
            }else{
                texto="contraseña incorrecta";
            }
        }else{
            texto="no se encontró coinsidencias";
        }
        Matriculado.findById({_id:req.session.usuario}).populate('cursos').exec(function(err, result){
            if(err) return (err)
            res.render('ver_cursos2', {
                cursos:result.cursos
            })
        });
    })   
})

app.get('/crear', function (req, res) {
    res.render('crear', {
    })
})

app.post('/crear', function (req, res) {
    if (req.body.idCurso) {
        Curso.findOne({ id: req.body.idCurso }, (err, duplicado) => {
            if (err) {
                return console.log(err)
            }
            if (duplicado) {
                res.render('crear', {
                    resultado: "Ya existe un curso con ese Id"
                })
            } else {
                let curso = new Curso({
                    id: req.body.idCurso,
                    nombre: req.body.nombreCurso,
                    modalidad: req.body.modalidad,
                    valor: req.body.precio,
                    descripcion: req.body.descripcion,
                    intensidad: req.body.intensidad,
                    estado: "habilitado"
                })
                curso.save((err, resultado) => {
                    if (err) {
                        return (err);
                    }
                    res.render('crear', {
                        resultado: `curso guardado`
                    })
                })
            }
        });
    }
})

app.get('/ver_cursos', function (req, res) {
    Curso.find({},(err, result)=>{
        if(err) return (err)
        res.render('ver_cursos', {
            cursos:result
        })
    });
})

app.get('/ver_cursos2', function (req, res) {
    Matriculado.findById({_id:req.session.usuario}).populate('cursos').exec(function(err, result){
        if(err) return (err)
        res.render('ver_cursos2', {
            cursos:result.cursos
        })
    });
})

app.get('/inscribir', function (req, res) {
    Curso.find({},(err, result)=>{
        if(err) return (err)
        res.render('inscribir', {
            cursos:result
        })
    });
})

app.post('/inscribir', function (req, res) {
    if(req.body.cedula){
        Matriculado.findOne({cedula: req.body.cedula}, (err, antiguo) => {
            if (err) {
                return console.log(err)
            }
            if(antiguo){
                Matriculado.findOneAndUpdate({_id:antiguo._id},{"$push": {cursos : req.body.id_Curso}},{new:true},(err, actualidado)=>{
                    if(err){
                        return console.log(err)
                    }
                    res.render('inscribir', {
                        respuesta:`Se le ha añadido un nuevo curso`
                    })
                })
            }else{
                let estudiante = new Matriculado({
                    nombre: req.body.nombreEstudiante,
                    cedula: req.body.cedula,
                    contrasena: req.body.contrasena,
                    correo: req.body.correo,
                    telefono: req.body.telefono,
                    cursos:[req.body.id_Curso]
                });
                estudiante.save((err, resultado) => {
                    if (err) {
                        return (err);
                    }
                    res.render('inscribir', {
                        respuesta:`Usted ha sido matriculado`
                    })
                });
            }
        });
    }
})

app.get('/ver_inscritos', function (req, res) {
    Curso.find({},(err, result)=>{
        if(err) return (err)
            res.render('ver_inscritos', {
                cursos:result
            })
    });
})

app.post('/ver_inscritos', function (req, res) {
    cur=req.body.listaEst
    Curso.findOne({_id:cur},(err, curso)=>{
        if (err) return (err);
        Matriculado.find({cursos:cur},(err, alumnos)=>{
            var texto=`<div class="table-responsive"><table class="table table-hover"><thead><th>Nombre</th><th>Cedula</th><th>Email</th><th>Eliminar</th></thead><tbody>`
            alumnos.forEach(elemento=>{
                texto = texto + `<tr><td>${elemento.nombre}</td><td>${elemento.cedula}</td><td>${elemento.correo}</td><td><button type="submit" value="${elemento._id}" name="IdEstDelete" class="btn btn-outline-dark btn-sm">X</button></td></tr>`
            })
            texto = texto + `</tbody></table></div><input name="curso_Delete" value="${curso._id}" class="d-none"></input>`
            Curso.find({},(err, result)=>{
                if(err) return (err)
                res.render('ver_inscritos',{
                    cuenta:"Admin",
                    mostrar:texto,
                    cursos:result
                });
            })
        })
    })
});



app.post('/eliminarEstudiante', function (req, res) {
   aEliminar=req.body.IdEstDelete;
   console.log(aEliminar)
    if(aEliminar){
        Matriculado.findOneAndDelete({_id:aEliminar},(err, eliminado)=>{
            if(err) return (err);
            var texto = "Estudiante eliminado"
            Curso.find({},(err, result)=>{
                if(err) return (err)
                    res.render('ver_inscritos', {
                        cursos:result,
                        mostrar2:texto
                    })
            });
        })
    }
})

app.post('/modificar', function (req, res) {
    if (req.body.id_Update_Cur) {
        Curso.findOne({_id:req.body.id_Update_Cur},(err, result)=>{
            if(err) return (err);
            if(result.estado =="habilitado"){
                Curso.findOneAndUpdate({_id:req.body.id_Update_Cur},{estado: "deshabilitado"},{new:true},(err, resultado)=>{
                    if(err) return (err);
                    Curso.find({},(err, allCur)=>{
                        if(err) return (err)
                        res.render('ver_cursos', {
                            cursos:allCur,
                            respuesta: "El curso fue deshabilitado con exito"
                        })
                    });
                });
            }else if(result.estado =="deshabilitado"){
                Curso.findOneAndUpdate({_id:req.body.id_Update_Cur},{estado: "habilitado"},{new:true},(err, resultado)=>{
                    if(err) return (err);
                    Curso.find({},(err, allCur)=>{
                        if(err) return (err)
                        res.render('ver_cursos', {
                            cursos:allCur,
                            respuesta: "El curso fue habilitado con exito"
                        })
                    });
                });
            }
        })        
    }
})

app.post('/salir', function (req, res) {
    req.session.destroy((err) => {
        if (err) return console.log(err) 	
    })	
    res.redirect('/index')	
})

//error 404
app.get('*', function (req, res) {
    res.render('error', {
        titulo: 'Error 404'
    })
})

module.exports = app