
import * as homePage from "./homePage";
import * as createPage from "./generateDIDPage";
import * as resolvePage from "./resolveDIDPage";

console.log("in the index.ts");

initPage();

function initPage(){
    let divs = document.getElementsByClassName('content-menu-item');
    console.log(divs);
    for (let i=0;i<divs.length;i++){
        console.log(divs[i].innerHTML);
        divs[i].addEventListener('click',onStartButtonClick );
    }

    onStartButtonClick(null);
}

function onStartButtonClick(evt:any) {
    let menu = 'menu1';
    if (evt && evt.currentTarget.id)
        menu = evt.currentTarget.id ;

    let menus = document.getElementsByClassName('content-menu-item-select');
    if (menus) {
        for (let i=0;i<menus.length;i++){
            menus[i].className = "content-menu-item";
        }        
    }
    let elementMenu:any = document.getElementById(menu);
    elementMenu.className = "content-menu-item-select";

    console.log(menu);
    let elementTitle:any = document.getElementById('contentTitle');
    let elementInfo:any = document.getElementById('contentInfo');
    switch (menu) {
        case 'menu2' :
            createPage.initPage(elementTitle,elementInfo);
        break;
        case 'menu3' :
            resolvePage.initPage(elementTitle,elementInfo);
        break;
        default :
            homePage.initPage(elementTitle,elementInfo);
            let homeMenu:any = document.getElementById('menu1');
            homeMenu.focus();
        break;

    }
}

