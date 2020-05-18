//********************************************************************
//* file : server.ts
//* https:localhost:5002
//*
//********************************************************************

const express = require('express');
const http = require('http');
const path = require('path');
const EthrDID = require('ethr-did');
const W3 = require('web3');
const axios = require('axios').default;

let PROVIDER_NODE = 'https://ropsten.infura.io/chim_himidumage';
let RESOLVER_URL = 'https://uniresolver.io/1.0/identifiers/';

let provider = new W3.providers.HttpProvider(PROVIDER_NODE);

var app = express();
// app.use('/',express.static(__dirname + '/build'));
app.use('/',express.static('./build/client'));
app.get('/', function (req, res) {
    res.redirect('/pageIndex');
});

app.get('/pageIndex',pageIndex);

function pageIndex(req, res, next) {
    console.log("indexPage Invoked");
    res.sendFile('index.html', { root: './build/client' });
}

const port = process.env.PORT || 5002;
http.createServer(app).listen(port, () => {
  console.log('Listening on ', port);
});
