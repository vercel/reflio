import Document, { Html, Head, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }
  render() {
    return (
      <Html lang="en">
        <Head>
          <script defer data-domain="affiliates.reflio.com" src="https://plausible.io/js/plausible.js"></script>
        </Head>
        <body className="loading bg-gray-50 affiliate-body">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;