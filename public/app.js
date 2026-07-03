const http = require('http');
const fs = require('fs');
const express = require('express');
const mysql = require('mysql2');

const server = express();

server.use(express.urlencoded({ extended: true }));
server.use(express.static('public'));


const conexion = mysql.createConnection({
    host:'10.1.15.29',
    user:'alumno',
    password:'alumno',
    database:'Renata'
});

const cabecera = fs.readFileSync('public/header.html','utf8');
const final = fs.readFileSync('public/footer.html','utf8');

server.listen(3002, () => {
    console.log('Servidor iniciado en puerto 3002');
});
server.post("/login",(req,res)=>{

    const correo = req.body.correo;
    const clave = req.body.clave;

    if ((correo=="usuario@correo.com")&&(clave=="12345"))
    {
        const contenido = `
            <h1>MICHAEL JACKSON SYSTEM</h1>
            <a href="/tabla"><img src="../images/login.png"></a>
            <a href="/tabla"><h2>ENTRAR AL CRUD</h2></a>
        `;
        res.send(cabecera + contenido + final);
    }
    else{
        const contenido = `
        <h1>ERROR DE ACCESO</h1>
        <a href="/"><img src="images/error.png" class="error"></a>
        `;
        res.send(cabecera + contenido + final);
    }
});
server.get("/tabla",(req,res)=>{

    conexion.query("select * from michael_jackson",(error,data)=>{

        let fila = ``;

        if(error){
            fila = `
            <tr>
                <td colspan="5" align="center">ERROR AL CARGAR DATOS</td>
            </tr>
            `;
        }
        else{
            for(const i of data){
                fila += `
                    <tr>
                        <td>${i.id}</td>
                        <td>${i.album}</td>
                        <td>${i.cancion}</td>
                        <td>${i.anio}</td>
                        <td>${i.duracion}</td>
                        <td>
                            <input type="button" value="Editar"
                            onClick="location='/editar?id=${i.id}'">

                            <input type="button" value="Eliminar"
                            onClick="location='/eliminar?id=${i.id}'">
                        </td>
                    </tr>
                `;
            }
        }

        const contenido = `
        <h1> MICHAEL JACKSON </h1>

        <input type="button" value="NUEVO"
        onClick="location='/nuevo'">

        <br><br>

        <table border="1" width="700">
            <tr>
                <td>ID</td>
                <td>ALBUM</td>
                <td>CANCION</td>
                <td>AÑO</td>
                <td>DURACION</td>
                <td>ACCION</td>
            </tr>

            ${fila}
        </table>
        `;

        res.send(cabecera + contenido + final);
    });

});
server.get("/nuevo",(req,res)=>{

    const contenido = `
    <h1>NUEVO REGISTRO </h1>

    <form action="/insertar" method="POST">

        <table border="1">

            <tr>
                <td>Álbum:</td>
                <td><input type="text" name="album"></td>
            </tr>

            <tr>
                <td>Canción:</td>
                <td><input type="text" name="cancion"></td>
            </tr>

            <tr>
                <td>Año:</td>
                <td><input type="number" name="anio"></td>
            </tr>

            <tr>
                <td>Duración:</td>
                <td><input type="text" name="duracion"></td>
            </tr>

            <tr>
                <td colspan="2" align="center">
                    <input type="submit" value="Guardar">
                </td>
            </tr>

        </table>

    </form>
    `;

    res.send(cabecera + contenido + final);
});
server.post("/insertar",(req,res)=>{

    const album = req.body.album;
    const cancion = req.body.cancion;
    const anio = req.body.anio;
    const duracion = req.body.duracion;

    conexion.query(
        "INSERT INTO michael_jackson(album,cancion,anio,duracion) VALUES(?,?,?,?)",
        [album,cancion,anio,duracion],
        (error,data)=>{

            if(error){
                res.send(cabecera + "<h1>Error al insertar</h1>" + final);
            }else{
                res.send(`
                    <script>
                        alert("Registro creado");
                        location="/tabla";
                    </script>
                `);
            }
        }
    );
});
server.get("/editar",(req,res)=>{

    const id = req.query.id;

    conexion.query("SELECT * FROM michael_jackson WHERE id=?",[id],(error,data)=>{

        const i = data[0];

        const contenido = `
        <h1>EDITAR REGISTRO</h1>

        <form action="/actualizar" method="POST">

            <input type="hidden" name="id" value="${i.id}">

            <table border="1">

                <tr>
                    <td>Álbum:</td>
                    <td><input type="text" name="album" value="${i.album}"></td>
                </tr>

                <tr>
                    <td>Canción:</td>
                    <td><input type="text" name="cancion" value="${i.cancion}"></td>
                </tr>

                <tr>
                    <td>Año:</td>
                    <td><input type="number" name="anio" value="${i.anio}"></td>
                </tr>

                <tr>
                    <td>Duración:</td>
                    <td><input type="text" name="duracion" value="${i.duracion}"></td>
                </tr>

                <tr>
                    <td colspan="2" align="center">
                        <input type="submit" value="Actualizar">
                    </td>
                </tr>

            </table>

        </form>
        `;

        res.send(cabecera + contenido + final);
    });

});
server.post("/actualizar",(req,res)=>{

    const id = req.body.id;
    const album = req.body.album;
    const cancion = req.body.cancion;
    const anio = req.body.anio;
    const duracion = req.body.duracion;

    conexion.query(
        "UPDATE michael_jackson SET album=?,cancion=?,anio=?,duracion=? WHERE id=?",
        [album,cancion,anio,duracion,id],
        (error,data)=>{

            if(error){
                res.send(cabecera + "<h1>Error al actualizar</h1>" + final);
            }else{
                res.send(`
                    <script>
                        alert("Actualizado correctamente");
                        location="/tabla";
                    </script>
                `);
            }
        }
    );
});
server.get("/eliminar",(req,res)=>{

    const id = req.query.id;

    conexion.query("DELETE FROM michael_jackson WHERE id=?",[id],(error,data)=>{

        if(error){
            res.send(cabecera + "<h1>Error al eliminar</h1>" + final);
        }else{
            res.send(`
                <script>
                    alert("Eliminado");
                    location="/tabla";
                </script>
            `);
        }
    });

});