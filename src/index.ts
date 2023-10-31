import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { DefaultApi } from 'finnhub-ts'

dotenv.config();
const app: Express = express();
const port = process.env.PORT;

const finnhubClient = new DefaultApi({
  apiKey: process.env.FINNHUB_API_KEY,
  isJsonMime: (input) => {
    try {
      JSON.parse(input)
      return true
    } catch (error) {}
    return false
  },
})

app.get('/ohlc/:symbol', (req: Request, res: Response) => {
  const { symbol } = req.params
  const from = Math.floor((Date.now() - 7 * 24 * 60 * 60 * 1000) / 1000);  // 7 days ago in Unix timestamp
  const to = Math.floor(Date.now() / 1000);  // Current time in Unix timestamp

  finnhubClient.stockCandles(symbol, 'D', from, to).then(resp => {
    res.send(resp.data);
  }).catch(err => {
    console.error('Error fetching stock candle data:', err);
  })
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
