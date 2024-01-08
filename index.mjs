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
console.log(firebaseConfig);
// Config from .env file (HIDDEN IN GITHUB)

initializeApp(firebaseConfig);

import { getDatabase, ref, push, update } from "firebase/database";

const database = getDatabase();

// import express
import express from 'express';

// create express app
const app = express();
const port = process.env.PORT || 5000;

app.use((req, res, next) => {
    const allowedOrigins = ['https://musicterms.github.io/'];
    const origin = req.headers.origin || req.headers.referer;
    var cannot_access = true;
    allowedOrigins.forEach((allowedOrigin) => {
        if (allowedOrigin.includes(origin)) cannot_access = false;
    });
    if (cannot_access) {
        return res.status(403).send('403 Forbidden');
    }
    next();
});

// open routes to write on the database.

var life_time_session_ids = []

app.get('/api/visit', (req, res) => {
    var query_session_id = req.query.session_id;
    console.log(session_id);
    var visitRef = push(ref(database, 'visit'));
    if (life_time_session_ids.includes(query_session_id)) res.send('OK');
    else {
        update(visitRef, {
            session_id: query_session_id,
            time: new Date().getTime(),
            ip: req.ip,
            user_agent: req.headers['user-agent'],
            referer: req.headers.referer
        });
        life_time_session_ids.push(query_session_id);
        res.send('OK');
    }
});

app.listen(port, () => console.log(`Listening on port ${port}.`));