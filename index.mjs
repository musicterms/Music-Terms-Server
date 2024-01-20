// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import dotenv from 'dotenv';
dotenv.config();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
};
// Config from .env file (HIDDEN IN GITHUB)

initializeApp(firebaseConfig);

import { getDatabase, ref, push, update } from "firebase/database";

const database = getDatabase();

// Import express
import express from 'express';

// Create express app
const app = express();
const port = process.env.PORT || 5000;

// import fetch from 'node-fetch';
import fetch from 'node-fetch';

app.use((req, res, next) => {
    const allowedOrigins = ['https://musicterms.github.io/'];
    const origin = req.headers.origin || req.headers.referer;
    var cannot_access = true;
    allowedOrigins.forEach((allowedOrigin) => {
        if (allowedOrigin.includes(origin)) cannot_access = false;
    });
    if (cannot_access) return res.status(403).send('403 Forbidden');
    const user_ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || '';
    try {
        if (life_time_de_ddos_ip_visited_numbers[user_ip] >= 60 * 5) return res.status(429).send('429 Too Many Requests');
    } catch { }
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// open routes to write on the database.

var life_time = 60 * 60 * 1000;
var life_time_session_ids = [];
var life_time_de_ddos_ip_visited_numbers = {};

app.get('/api/visit', (req, res) => {
    var user_ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || '';
    try {
        try {
        } catch { }
        life_time_de_ddos_ip_visited_numbers[user_ip] += 1;
    } catch { }
    var query_session_id = req.query.session_id;
    var visitRef = push(ref(database, 'visit'));
    if (life_time_session_ids.includes(query_session_id)) res.send('OK');
    else {
        update(visitRef, {
            session_id: query_session_id,
            time: new Date().getTime(),
            ip: user_ip,
            user_agent: req.headers['user-agent'],
            referer: req.headers.referer
        });
        life_time_session_ids.push(query_session_id);
        res.send('OK');
    }
});

setInterval(() => {
    life_time_session_ids = [];
    life_time_de_ddos_ip_visited_numbers = {};
}, life_time);

// random api
var random_api_url = process.env.RANDOM_API_URL;
app.get('/api/verify/', (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    var access_sub_link = "res/json";
    var access_link = random_api_url + access_sub_link;
    var query = {
        "api_key": process.env.RANDOM_API_KEY,
        "api_pass_id": process.env.RANDOM_API_PASS_ID,
        "api_pass_app": process.env.RANDOM_API_PASS_APP,
    }
    var query_string = Object.keys(query).map(key => key + '=' + query[key]).join('&');
    fetch(access_link + '?' + query_string)
        .then(response => {
            return response.json();
        }).then(json => {
            res.json(json);
        })
});

app.get('/api/check-verify', (req, res) => {
    res.set({
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
    });
    var session_id = req.query.session_id;
    var describe = req.query.describe;
    var action = req.query.action;
    var consistent = req.query.consistent;
    var user_ip = req.headers['x-forwarded-for'] || req.ip || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress || '';
    var token = req.query.token;
    var answer = req.query.answer;
    if (session_id == void 0 || describe == void 0 || action == void 0 || consistent == void 0 || token == void 0 || answer == void 0) return res.json({ "result": "error" });
    var query = {
        "api_key": process.env.RANDOM_API_KEY,
        "api_pass_id": process.env.RANDOM_API_PASS_ID,
        "api_pass_app": process.env.RANDOM_API_PASS_APP,
    }
    var query_string = Object.keys(query).map(key => key + '=' + query[key]).join('&');
    fetch(random_api_url + 'verify?token=' + token + '&answer=' + answer + '&' + query_string,
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }, mode: 'no-cors',
        })
        .then(response => {
            return response.json();
        }).then(json => {
            res.json(json);
        });

    var visitRef = push(ref(database, 'bugs'));
    update(visitRef, {
        session_id: session_id,
        time: new Date().getTime(),
        ip: user_ip,
        user_agent: req.headers['user-agent'],
        referer: req.headers.referer,
        describe: describe,
        action: action,
        consistent: consistent,
        token: token,
        answer: answer,
    });
});

app.get('/rondo-fetch', (req, res) => {
    fetch( random_api_url + '/rondo-fetch?back_url=https://musicterms.onrender.com/rondo-fetch');
    res.send('OK');
});

app.listen(port, () => console.log(`Listening on port ${port}.`));