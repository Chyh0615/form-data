"use strict";
let http = require("http");
let fs = require("fs");
let querystring = require("querystring");
var path = require('path');
let port = process.env.PORT || 1337;
let page = "./index.html";
let formData = JSON.parse(fs.readFileSync("./form-data.json"));

fs.readFile(page, "utf-8", function (err, data) {
    if (err) {
        console.log("readFile err =" + err);
        return;
    }

    http.createServer(function (req, res) {
        let requestUrl = req.url;

        switch (requestUrl) {
            case "/":
                console.log("HTML init.");
                res.writeHead(200, { "Content-Type": "text/html" });
                res.end(data);
                break;
            case "/get_data":
                console.log("HTML connect.");
                res.writeHead(200, { "Content-Type": "application/json" });
                res.write(JSON.stringify({
                    username: "",
                    email: "",
                    phone: "",
                    comment: ""
                }));
                res.end();
                break;
            case "/update_data":
                console.log('Configuration updated.');

                let receiveData = "";
                req.on("data", buffer => {
                    receiveData += buffer;
                });

                req.on("end", function () {
                    console.log("receiveData=" + receiveData);
                    receiveData = querystring.parse(receiveData);
                    formData.username = receiveData.username;
                    formData.email = receiveData.email;
                    formData.phone = receiveData.phone;
                    formData.comment = receiveData.comment;

                    fs.writeFileSync("./form-data.json", JSON.stringify(formData), function (err) {
                        if (err) {
                             console.log("writeFile err =" + err);
                        }
                    });
                });
                break;
            default:
                res.writeHead(404);
                res.end();
                break;
        };
    }).listen(port);
});

console.log(`Node.js web server at port ${port} is running...`);
