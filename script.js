const pup=require("puppeteer");
let id="sikak94874@684hh.com";
let pass="sikak94874";
let tab;
let browser;
let dataArr=[];
let fs=require('fs');
async function main(){

     browser= await pup.launch({

     headless:true,
     defaultViewPort:false,
     



    });

let pages=await browser.pages();
tab= await pages[0];
await tab.goto("https://www.goodreads.com/user/sign_in");
await tab.type("#user_email",id);
await tab.type("#user_password",pass);
await tab.click(".gr-button.gr-button--large"); 
await tab.waitForSelector("body > div.siteHeader > div > header > div.headroom-wrapper > div > nav > ul > li:nth-child(3) > div > a")
await tab.click("body > div.siteHeader > div > header > div.headroom-wrapper > div > nav > ul > li:nth-child(3) > div > a")
await tab.click("body > div.siteHeader > div > header > div.headroom-wrapper > div > nav > ul > li:nth-child(3) > div > div > div > ul > li:nth-child(2) > a");
await tab.waitForSelector(".category.clearFix",{visible:true});
let elements= await tab.$$(".category.clearFix");
//console.log(elements.length);
let urls=[];
for(let element of elements){
 let aTag =await element.$("a");
  let elementurl=await tab.evaluate(function(ele){

return ele.getAttribute("href");
},aTag);

urls.push(elementurl);
}

for(i in urls){
  
await getbook(urls[i]);


}


var alldata=JSON.stringify(dataArr);

alldata=alldata.replace(/\\n/g, '');


fs.writeFileSync("goodreads.json",alldata);


browser.close();

}
main();

async function getbook(url){

 
  await tab.goto("https://www.goodreads.com"+url,{waitUntil:'networkidle2',timeout:0});
  let dataObject={};
  await tab.waitForSelector(".gcaMastheader.u-marginLeftMedium ");
  dataObject['book type']=await tab.$eval(".gcaMastheader.u-marginLeftMedium",el=>el.textContent);
  dataObject['book name']=await tab.$eval(".winningTitle.choice.gcaBookTitle",el=>el.textContent);
  dataObject[' votes ']= await tab.$eval(".gcaNumVotes",el=>el.textContent);
  
  dataObject['Author Name']=await tab.$eval(".authorName",el=>el.textContent);

   dataArr.push(dataObject);
}
