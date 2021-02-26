'use strict';

function checkEnv(name) {
    if (!process.env[name]) {
        console.log(`Enviroment variable ${name} not set!`);
        process.exit(1);
    }
    console.log(`${name}: ${process.env[name]}`);
    return process.env[name]
}

module.exports = {
    checkEnv
}