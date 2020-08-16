import '../scss/style.scss';
console.log('client side script invoked');

import W3 from 'web3';
import axios from 'axios';

let PROVIDER_NODE = 'https://ropsten.infura.io/chim_himidumage';
let RESOLVER_URL = 'https://uniresolver.io/1.0/identifiers/';

let provider = new W3.providers.HttpProvider(PROVIDER_NODE);

let btn;

function bindEvents() {

    btn = window.document.getElementById('resolve_did'); 
    if (btn === null)
        console.log('btn == null');
    else {
        console.log('button found');
        btn.addEventListener('click',onResolveDID)!;
    }
}
function initPage(elementTitle:any, elementInfo:any){
    elementTitle.innerHTML = 'Resolve DID';
    elementInfo.innerHTML = pageContent;
    bindEvents();
}

let pageContent:string = `

<label class="lbl_basic">To view DID Document for an already generated DID, paste the DID on the space below and click 'Resolve DID'.</label>
<label class="lbl_basic">Decentralise Identity (DID):</label>                
<textarea class="txt_single" id="acc_did" placeholder="paste a DID here to resolve its document..."></textarea>
<button class="btn_basic" id="resolve_did" >Resolve DID</button>
<label class="lbl_basic">DID Document:</label>                
<textarea class="txt_multi" readonly="true" id="did_doc" ></textarea>

`;

function onResolveDID(){

    let did = getElementValue('acc_did');
    if (did && did !== ''){
        didResolve(did).then (doc => {
            setElementValue('did_doc', JSON.stringify(doc, undefined, 4));
        }).catch(err =>{
            setElementValue('did_doc', err);
        });
    }
}

function setElementValue(obj_id:string,obj_value:string){
    let element:any;
    element = window.document.getElementById(obj_id); 
    if (element === null)
        console.log('btn == null');
    else {
        console.log('element found');
        element.value = obj_value;
    }
}

function getElementValue(obj_id:string):string{
    let element:any;
    element = window.document.getElementById(obj_id); 
    if (element === null){
        return '';
    }
    else {
        console.log('element found');
       return element.value;
    }
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

export {initPage}