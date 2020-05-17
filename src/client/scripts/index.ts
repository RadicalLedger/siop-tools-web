console.log('client side script invoked');

let btn = window.document.getElementById('discover_button'); 
if (btn === null)
    console.log('btn == null');
else {
    console.log('button found');
    btn.addEventListener('click',onOIDCPDiscover)!;
}

function onOIDCPDiscover(){
    console.log("onOIDCPDiscover22");
    alert('onOIDCPDiscover');
}