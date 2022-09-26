const http = require('http');
const puppeteer = require('puppeteer');
var browser,page;
let reviews,num=1;


(async () => {

    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage()
    await page.setCacheEnabled(false);
    const urls = [
        "https://www.trustpilot.com/review/panaceafinancial.com",
        "https://www.trustpilot.com/review/cruiseinsurance101.com"

    ]



    async function scrape(url) {

        await page.goto(url, {waitUntil: 'networkidle0'});
        await getPage(url);


    }

    async function getPage(url) {

        const data = await page.evaluate(() => document.querySelector('*').outerHTML);

        let m;

        var regex= /<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/g
        do {
            m = regex.exec(data);
            if (m) {
                reviews=JSON.parse(m[1]).props.pageProps.reviews;
                //console.log(reviews);
                if(reviews.length==20){
               console.log(reviews);
               await scrape(url.split("?")[0]+"?page="+(++num))
                }else{
                
                num=1;
                }


            }
        } while (m);







    };

    for (j = 0; j < urls.length; j++) {
        await scrape(urls[j]).then((value) => {

        }).catch(console.error);

    }
    browser.close();

})()
