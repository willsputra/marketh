import Document, { Head, Main, NextScript } from 'next/document'
import { ServerStyleSheet, injectGlobal } from 'styled-components'

injectGlobal`

    html {
        min-height: 100%;
        margin: 0;
    }
    body {
        background-color: #F7F8FD;
        background-repeat: no-repeat;
        background-size: cover; 
        min-height: 100%;
        margin: 0;
    }
    a {
        text-decoration: none;
        color: #56C99D;
    }
    img {
      max-height: 100%;
      width: auto;
      margin: 0 auto;
    }
    p {
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 400;
      color: #35353E;
      font-size: 14px;
    }
    h1 {
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 700;
      color: #35353E;
      font-size: 48px;
    }
    h2 {
      font-family: 'IBM Plex Sans', sans-serif;
      font-weight: 700;
      color: #35353E;
      font-size: 20px;
    }
    
`

export default class MyCustomDocument extends Document {
  static getInitialProps ({ renderPage }) {
    const sheet = new ServerStyleSheet()
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />))
    const styleTags = sheet.getStyleElement()
    return { ...page, styleTags } // return styles collected
  }

  render () {
    return (
      <html>
        <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0" />
          <link href="/static/favicon.ico" rel="shortcut icon" />
          <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Sans:300,400,700" rel="stylesheet" />
          {this.props.styleTags}
          <title>Marketh | Buy & sell anything on the blockchain</title>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}