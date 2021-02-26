'use strict';

let axios = require('axios');
let qs = require('qs');
let setCookie = require('set-cookie-parser');

const LOGIN_URL = 'https://login.aci.it/index.php';
const API_URL = 'https://prenotaci.aci.it/api'

async function login(username, password) {
    const config = {
        method: 'post',
        url: LOGIN_URL,
        params: {
            'do': 'login',
            'application_key': 'prenota_pra'
        },
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify({
            username,
            password
        })
    };
    const response = await axios(config);
    const cookies = setCookie.parse(
        response.headers['set-cookie'],
        { map: true }
    );
    const access_token = cookies['loginAciSsoId']['value'];
    return access_token;
}

async function getDates(access_token, idUfficioPra) {
    const config = {
        method: 'post',
        url: `${API_URL}/SistemaPrenotazioni/getCalendario`,
        params: {
            access_token
        },
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            idUfficioPra
        })
    };
    const response = await axios(config);
    return response.data['return']['date'];
}

async function isDateAvailable(access_token, data, idUfficioPra, idPratica, targaTelaio, tipoVeicolo) {
    const config = {
        method: 'post',
        url: `${API_URL}/SistemaPrenotazioni/verificaDisponibilita`,
        params: {
            access_token
        },
        headers: {
            'Content-Type': 'application/json'
        },
        data: JSON.stringify({
            data,
            idUfficioPra,
            pratiche: [
                {
                    idPratica,
                    targaTelaio,
                    tipoVeicolo
                }
            ]
        })
    };
    const response = await axios(config);
    return !response.data['return']['appuntamentoDisponibile'].includes(null);
}

module.exports = {
    login,
    getDates,
    isDateAvailable
}