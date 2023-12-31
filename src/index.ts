import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { DefaultApi } from 'finnhub-ts'
import cron from 'node-cron';
import Ably from 'ably'

dotenv.config();
const app: Express = express();
const port = process.env.PORT;

const realtime = new Ably.Realtime(process.env.ABLY_API_KEY || '');

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
  const now = new Date()
  const from = Math.floor(now.setMonth(now.getMonth() - 2) / 1000); // 2 months ago in Unix timestamp
  const to = Math.floor(Date.now() / 1000); // Current time in Unix timestamp
  finnhubClient.stockCandles(symbol, '15', from, to).then(resp => {
    res.json(resp.data)
  }).catch(err => {
    console.error('Error fetching stock candle data:', err);
  })
});

cron.schedule('* * * * *', () => {
  const now = new Date().getTime(); 
  const to = Math.floor(now / 1000);
  const from = to - 300;
  const channel = realtime.channels.get('aapl-stock-value');
  finnhubClient.stockCandles("AAPL", '1', from, to).then(resp => {
    channel.publish("update", resp.data);
  }).catch(err => {
    console.error('Error fetching stock candle data:', err);
  })
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
