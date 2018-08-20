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
          <link href="https://fonts.googleapis.com/css?family=Barlow:500|Zilla+Slab:700" rel="stylesheet" />
          {this.props.styleTags}
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    )
  }
}