console.log('homePage.ts')

function initPage(elementTitle:any, elementInfo:any){
    elementTitle.innerHTML = 'SIOP-DID Tools Home';
    elementInfo.innerHTML = pageContent;
}

let pageContent = `
<label class="lbl_basic">You could find all essential tools and utilities to start with using SIOP-DID here. When you this website, none of the info you see or generate does not leave your browser, meaning it is perfectly secure and safe to use these services.</label>
`;

export {initPage}