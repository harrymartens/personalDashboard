const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
const PORT = 3001;

app.use(cors());

app.get("/api/yahoo/:ticker", async (req, res) => {
  const ticker = req.params.ticker;
  try {
    console.log("Fetching data ....");

    const response = await fetch(`https://finance.yahoo.com/quote/${ticker}/`)

    const body = await response.text();


    let price = body
    //   .split(`"${ticker}"`)
      .split(`"quote-price"`)[1]
    //   .split("regularMarketPrice")[1]
    //   .split('fmt":"')[1]
    //   .split('"')[0];

    console.log(body)

    // price = parseFloat(price.replace(",", ""));

    // const currencyMatch = body.match(/Currency in ([A-Za-z]{3})/);
    // let currency = null;
    // if (currencyMatch) {
    //   currency = currencyMatch[1];
    // }

    // console.log(currency, price);

    // const html = await response.text();
    // res.send(html);
  } catch (error) {
    console.error("Error fetching data:", error);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
