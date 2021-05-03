const express = require("express");
const app = express();
const cors = require("cors")
const parametros = require("./src/lib/configParameters");

const userRoute = require("./src/routes/user.route");
const roomRoute = require("./src/routes/room.route");
const tutorRoute = require("./src/routes/tutor.route");

// Cargamos la informacion de los ficheros de configuracion
parametros.cargarParametros()
    .then(() => {
        let configuracion = parametros.configuracion();

        // Añadimos los middleware
        app.use(cors({ origin: configuracion.arrayOriginesCors }));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));

        app.use(cors());

        // Añadimos las rutas
        app.use("/api/v3/user", userRoute);
        app.use("/api/v3/room", roomRoute);
        app.use("/api/v3/tutor", tutorRoute);

        //Starting the server
        app.listen(configuracion.expressConf.port, configuracion.expressConf.host, () => {
            console.log(`Servidor escuchando en ${configuracion.expressConf.host}:${configuracion.expressConf.port}`);
        });

    })
    .catch((err)=>{
        console.log("Error al cargar la configuración. " + err);
    });