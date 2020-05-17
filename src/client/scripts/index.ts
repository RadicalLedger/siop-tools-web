import '../scss/style.scss';
console.log('client side script invoked');

let btn;

btn = window.document.getElementById('generate_did'); 
if (btn === null)
    console.log('btn == null');
else {
    console.log('button found');
    btn.addEventListener('click',onGenerateDID)!;
}

btn = window.document.getElementById('resolve_did'); 
if (btn === null)
    console.log('btn == null');
else {
    console.log('button found');
    btn.addEventListener('click',onResolveDID)!;
}
function onGenerateDID(){
    console.log("onGenerateDID");
}

function onResolveDID(){
    console.log("onResolveDID");
}