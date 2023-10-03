const fs = require("fs");
const http = require("http");
const url = require("url");

// Blocking
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8')
// console.log(textIn);
// const textOut  = `Xin chao cac ban ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut)
// console.log('File written!!');

//Non Blocking
// fs.readFile("./txt/start.txt", "utf-8", (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, "utf-8", (err, data2) => {
//         console.log(data2);
//     })
// });
// console.log("Reading ...");

/////////////////////////////
// SERVER
// const __dirname = ".";

const replaceTemplate = (temp, product) => {
  let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%QUANTITY%}/g, product.quantity);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);
  output = output.replace(/{%ID%}/g, product.id);

  if (!product.organic) {
    output = output.replace(/{%NOT_ORGANIC%}/g, "not-organic");
  }

  return output;
};

const templateOverview = fs.readFileSync(
  `${__dirname}/templates/template_overview.html`,
  "utf-8"
);
const templateCard = fs.readFileSync(
  `${__dirname}/templates/template_card.html`,
  "utf-8"
);
const templateProduct = fs.readFileSync(
  `${__dirname}/templates/template_product.html`,
  "utf-8"
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const sever = http.createServer((req, res) => {

  const {query, pathname } = url.parse(req.url, true)

  // Overview page
  if (pathname === "/overview" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });

    const cardsHtml = dataObj
      .map(el => replaceTemplate(templateCard, el))
      .join("");

    const output = templateOverview.replace("{%PRODUCT_CARDS%}", cardsHtml);

    res.end(output);

    // Api page
  } else if (pathname === "/api") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(data);

    // Product page
  } else if (pathname === "/product") {
    res.writeHead(200, { 'Content-type': 'text/html'})
    const product = dataObj[query.id]
    const output = replaceTemplate(templateProduct, product);

    res.end(output);

    // 404 page
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
      "my-own-header": "hello-mn",
    });
    res.end("<h1>Page not found</h1>");
  }
});

sever.listen(8000, "127.0.0.1", () => {
  console.log("Listening to requests on port 8000");
});
