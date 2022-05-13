const rp = require('request-promise');
const cheerio = require('cheerio');
const fs = require("fs");
const https = require('https');

const BASE_URL = "https://www.app.abihome.de/ajax.php?aktion=get_topic_content&id=11416";
let requestURL = "";

for(let i=0; i<7; i++){
    requestURL = BASE_URL + "&page=" + i;
    

}

const options = {
    hostname: "www.app.abihome.de",
    path: "/ajax.php?aktion=get_topic_content&id=11416&page=1",
    method: "POST",
    headers: {
        Connection: "keep-alive",
        Cookie: "_gcl_au=1.1.330399636.1652297731; _fbp=fb.1.1652297730888.1009192717; Abihome=690953%7C03f89d94d6eb50045c69da2ea08a31359f41dbf2%7Ce42af71715a71df37ee2ef4bf697102a2e3ddb12%7Ctuuarouthaesliaviosliacatriojaegioclaewaiproubonaecloubecokubulugaedioriphaireasewraidapreaviataidouslaipamaicriogoutrocohouchustaclocaihiapovouwroumeniodereanothahemidicheuoutufraphuhioclaijaichastaveagaepetha; _hjSessionUser_1723762=eyJpZCI6IjM1M2ZkZmE0LWIyZDEtNThjOC05MmZiLWVkM2QwYjA1NDZlMyIsImNyZWF0ZWQiOjE2NTIyOTc3MzEyNzksImV4aXN0aW5nIjp0cnVlfQ==; _hjSession_1723762=eyJpZCI6IjRjZWZlZDhiLTk5NzctNGNiMi04YWI0LTM5ZjIxNzM1YzQ4MCIsImNyZWF0ZWQiOjE2NTIzODkwNjQ2MDcsImluU2FtcGxlIjp0cnVlfQ==; _hjAbsoluteSessionInProgress=1; Abihome=690953|03f89d94d6eb50045c69da2ea08a31359f41dbf2|b64db3f8e2da33c16482901d1d74c37d82a352ab|uechofriatekaicleasuvaethepesteacoumucliviomipaihiodiuiariajailikeadrowiastathujifroustechaiviosliavaiwrousouhaheraebihuwrioprehadrearouroucrakeatrephihaerislonionaeslebithauouphaevonoufraicopocladrauewrojariov; PHPSESSID=qgmf1i9cl2oees3c89eqlbftga; SRVNAME=abh02"
    }
}

let resJSON = {};
let html = "";

const req = https.request(options, res => {
    let chunks = [];

    res.on("data", d => {
        chunks.push(d);
        // console.log(data);

        // console.log(resJSON);
        // 
    }).on("end", () => {
        let buffer = Buffer.concat(chunks);
        let resJSON = JSON.parse(buffer.toString());

        html = "<html><body>" + resJSON.payload.message + "</body></html>";

        const $ = cheerio.load(html);
        let commentElements = $(".css_table_col.message");

        let commentChildren = [];
        let commentStrings = [];
        let currentCommentString = "";
        for(let i=0; i<commentElements.length; i++){
            commentChildren = commentElements[i].children;

            for(let j=0; j<commentChildren.length; j++){
                if(commentChildren[j].type == "text") {
                    currentCommentString += commentChildren[j].data;
                }
                else if (commentChildren[j].type == "tag") {
                    currentCommentString += "\n";
                }
            }   

            commentStrings.push(currentCommentString);
            currentCommentString = "";
        }

        console.log(commentStrings)
    })
});

req.on('error', (e) => {
    console.error("da ist was schief gelaufen: ", e);
  });

req.end();