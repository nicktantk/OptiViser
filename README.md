# Historic Options Data Viewer

I use moomoo for trading, but I couldn't find data for expired options. I decided to create my own using Polygon.IO's API.

This is a form based application, taking the following parameters from the user - ticker, strike price, start date, expiration date, option type (call / put) - and generating the option's price chart using React's Rechart library. In addition, the underlying's price chart is displayed as add-on information.

The below shows the homepage.

![webpage img](./src/assets/HODV%20.png)

## Other relevant links

[Polygon.IO](https://polygon.io/)
[Polygon.IO Docs](https://polygon.io/docs)
