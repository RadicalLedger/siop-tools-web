import '../scss/style.scss';
console.log('client side script invoked');

import EthrDID from 'ethr-did';
import W3 from 'web3';

let PROVIDER_NODE = 'https://ropsten.infura.io/chim_himidumage';

let provider = new W3.providers.HttpProvider(PROVIDER_NODE);

let btn;

function bindEvents() {
    btn = window.document.getElementById('generate_did'); 
    if (btn === null)
        console.log('btn == null');
    else {
        console.log('button found');
        btn.addEventListener('click',onGenerateDID)!;
    }
}

function initPage(elementTitle:any, elementInfo:any){
    elementTitle.innerHTML = 'Generate DID';
    elementInfo.innerHTML = pageContent;
    bindEvents();
}

let pageContent:string = `
<label class="lbl_basic">You could create an Ethereum adderes along with a private key and register that as a Decentralised Identity here. Click 'Generate DID' to generate a DID.</label>
<button class="btn_basic" id="generate_did" >Generate DID</button>
<label class="lbl_basic">Address:</label>
<textarea class="txt_single" readonly="true" id="acc_address" ></textarea>
<label class="lbl_basic">Private Key:</label>                
<textarea class="txt_single" readonly="true" id="acc_pvtkey" ></textarea>
<label class="lbl_basic">Decentralise Identity (DID):</label>                
<textarea class="txt_single" id="acc_did"></textarea>
`;

function onGenerateDID(){
    try{
        var w3 = new W3(provider);

        let acc = w3.eth.accounts.create();
        
        const ethrDid = new EthrDID({address: acc.address, privateKey: acc.privateKey, provider})
        
        setElementValue('acc_address',acc.address);
        setElementValue('acc_pvtkey',acc.privateKey.replace('0x', ''));
        setElementValue('acc_did',ethrDid.did);        

    }
    catch (error){
        console.log("error", error);
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


export {initPage}