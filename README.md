# Ably realtime react-financial-charts demo

Node backend to publish events to Ably. Uses finnhub.io to fetch OHLC data.
To run this application, you will need [finnhub.io](https://finnhub.io/docs/api) and [Ably](https://ably.com/sign-up) API keys.

## Installation and running

1. Install the required dependencies:

   ```bash
   npm install
   ```

2. To run the application locally, you need to create a `.env` file with your Ably API key. Add the following lines to the `.env` file:

```
  PORT=3000
  FINNHUB_API_KEY=<YOUR_FINNHUB_API_KEY>
  ABLY_API_KEY=<YOUR_ABLY_API_KEY>
```

3. Execute the following command to run the application locally. It will be accessible at [localhost:3000](http://localhost:3000/):

   ```bash
   npm run dev
   ```
