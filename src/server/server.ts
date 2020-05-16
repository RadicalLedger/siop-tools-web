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
app.use('/',express.static(__dirname + 'src/client'));
app.get('/', function (req, res) {
    res.redirect('/pageIndex');
});

app.get('/pageIndex',pageIndex);
app.get('/pageGenerateDID',pageGenerateDID);
app.get('/generate_did',apiGenerateDID);
app.get('/resolve_did',apiResolveDID);

function pageIndex(req, res, next) {
    console.log("indexPage Invoked");
    res.sendFile('index.html', { root: './src/client' });
}

function pageGenerateDID(req, res, next) {
    console.log("generateDIDPage Invoked");
    res.sendFile('generate_did.html', { root: './src/client' });
}

function apiGenerateDID(req, res, next) {
    console.log("apiGenerateDID Invoked");

    try{
        var w3 = new W3(provider);

        let acc = w3.eth.accounts.create();
        
        const ethrDid = new EthrDID({address: acc.address, privateKey: acc.privateKey, provider})
        
        let msg = {accinfo:acc,did:ethrDid.did};
        console.log('acc/did info returned',msg);
        
        res.send({status:"success", message:msg});
    }
    catch (error){
        res.send({status:"error", message:error});        
    }
}

function apiResolveDID(req, res, next) {
    console.log("apiResolveDID Invoked");
    let did = req.query.did; 
    didResolve(did).then (doc => {
        res.send({status:"success", message:{didDoc:doc}});
    }).catch(err =>{
        res.send({err});
    });

}

function didResolve(did: string):Promise<any>{
    let doc:any;

    return new Promise((resolve, reject)=>{
            axios.get(RESOLVER_URL + did).then(result => {
            if(
                result &&
                result.data &&
                result.data.didDocument &&
                result.data.didDocument['@context'] === 'https://w3id.org/did/v1' &&
                result.data.didDocument.id == did &&
                result.data.didDocument.authentication &&
                result.data.didDocument.authentication.length > 0
            ){
                doc = result.data.didDocument;
                resolve(doc);
            }
            else {
                reject({status:'error',message:'Invalid DID Document'})
            }

        }).catch(err =>{
            reject({status:'error',message:'Failed to retrive DID Document'})            
        })    
    })
}

const port = process.env.PORT || 5002;
http.createServer(app).listen(port, () => {
  console.log('Listening on ', port);
});
