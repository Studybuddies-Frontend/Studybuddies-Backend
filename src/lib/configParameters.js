const nconf = require('nconf')

class Parametros {
    constructor(mysqlConf, mongoConf, expressConf, arrayOriginsCors) {
        this.mysqlConf = mysqlConf;
        this.mongoConf = mongoConf;
        this.expressConf = expressConf;
        this.arrayOriginsCors = arrayOriginsCors;
    }
}

let config = {};

module.exports = {
    configuracion() {
        return config;
    },
    cargarParametros() {
        return new Promise(function(resolve, reject) {
            try{
                let ficheroConfig = `./config/config.pro.json`;
                nconf.argv().env().file({ file: ficheroConfig });
                let mysqlConf = {};
                try {
                    mysqlConf = nconf.get('MySQL_DB');
                    if (!mysqlConf) {
                        reject("No se ha definido la configuracion mysql");
                    } else {
                        if (!mysqlConf.host) reject("No se ha definido el host mysql");
                        if (!mysqlConf.port) reject("No se ha definido el port mysql");
                        if (!mysqlConf.name) reject("No se ha definido la base de datos mysql");
                        if (!mysqlConf.username) reject("No se ha definido el usuario mysql");
                        if (!mysqlConf.password) reject("No se ha definido el password mysql");
                    }
                } catch (err) {
                    reject("No se ha podido cargar la configuracion mysql")
                } 

                let mongoConf = {};
                try {
                    mongoConf = nconf.get('Mongo_DB');
                    if (!mongoConf) {
                        reject("No se ha definido la configuracion mongo");
                    } else {
                        if (!mongoConf.host) reject("No se ha definido el host mongo");
                        if (!mongoConf.port) reject("No se ha definido el port mongo");
                        if (!mongoConf.name) reject("No se ha definido la base de datos mongo");
                        if (!mongoConf.username) reject("No se ha definido el usuario mongo");
                        if (!mongoConf.password) reject("No se ha definido el password mongo");
                        if (!mongoConf.dbAdmin) reject("No se ha definido el dbAdmin mongo");
                    }
                } catch (err) {
                    reject("No se ha podido cargar la configuracion mongo")
                }

                let expressConf = {};
                try {
                    expressConf = nconf.get('Launch_App');
                    if (!expressConf) {
                        reject("No se ha definido la configuracion redis");
                    } else {
                        if (!expressConf.host) reject("No se ha definido la ip de escucha del API");
                        if (!expressConf.port) reject("No se ha definido el puerto de escucha");
                    }
                } catch (err) {
                    reject("No se ha podido cargar la configuracion del API Rest")
                }
 
                let arrayOriginesCors = [];
                try {
                    arrayOriginesCors = nconf.get('Origins_Allowed');
                } catch (err) {
                    reject("No se ha podido cargar la configuracion cors")
                }

                config = new Parametros(mysqlConf, mongoConf, expressConf, arrayOriginesCors);
                resolve(config);
            }
            catch(err) {
                reject(err)
            }
        })
    }
}