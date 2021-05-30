const Curso = require('../models/cursos');
const Matriculado = require('../models/matriculados');
const hbs = require('hbs');
const fs = require('fs');
let Cursos = [];
let Joins = [];
let Estudiantes = [];

const guardarJoin = () => {
    let dato = JSON.stringify(Joins);
    fs.writeFile('src/join.json', dato, (err) => {
        if (err) throw (err);
        console.log('nuevo registro')
    })
}

hbs.registerHelper("mostrarTodosLosCursos", (Cursos) => {
    var texto = ""
    Cursos.forEach(curso => {
        texto += `<tr><td>${curso.id}</td><td>${curso.nombre}</td><td>${curso.descripcion}</td><td>${curso.valor}</td><td>${curso.modalidad}</td><td>${curso.intensidad}</td><td>${curso.estado}</td></tr>`
    });
    return texto;
});

hbs.registerHelper("eliminarUnEstudiante", (idEstDelete, idDelete) => {
    Joins = require('./../join.json');
    if (idEstDelete && idDelete) {
        res = "Estudiante eliminado";
        nuevaLista = [];
        for (let i = 0; i < Joins.length; i++) {
            if (Joins[i].curso == idDelete && Joins[i].cedula == idEstDelete) {
            } else {
                nuevaLista.push(Joins[i])
            }
        }
        Joins = nuevaLista;
        guardarJoin();
        return res
    }

})

hbs.registerHelper("verCursosDisponibles", (Cursos) => {
    texto = "";
    i = 0;
    Cursos.forEach(curso => {
        if (curso.estado == "habilitado") {
            texto += `<div class="accordion-item">
            <h2 class="accordion-header" id="headingOne${i}">
                <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne${i}"
                    aria-expanded="true" aria-controls="collapseOne${i}">
                    <strong>Nombre del Curso: ${curso.nombre}</strong>&nbsp;  Valor: $${curso.valor}
                </button>
            </h2>
            <div id="collapseOne${i}" class="accordion-collapse collapse" aria-labelledby="headingOne${i}"
                data-bs-parent="#accordionExample">
                <div class="accordion-body"> 
                    <strong>Nombre: </strong> ${curso.nombre}<br>  
                    <strong>Valor: </strong> $${curso.valor}<br>  
                    <strong>Descripción: </strong> ${curso.descripcion}<br>  
                    <strong>Modalidad: </strong> ${curso.modalidad}<br>  
                    <strong>Intensidad: </strong> ${curso.intensidad}<br>  
                </div>
            </div>`
        }
        i++;
    })
    return texto;
});
