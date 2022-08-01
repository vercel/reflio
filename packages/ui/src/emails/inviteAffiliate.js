export default function inviteUser(){
  return(
    `<html>
      <head>
        <meta http-equiv="Content-Security-Policy" content="script-src 'none'; style-src * 'unsafe-inline'; default-src *; img-src * data:">
      </head>
      <body style="margin: 0; color: #142331;">
        <title>{{subject}}</title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
        <meta name="viewport" content="width=device-width">
        <style>
          @media (max-width: 600px) {
          .container {
          width: 94% !important;
          }
          .main-action-cell {
          float: none !important;
          margin-right: 0 !important;
          }
          .secondary-action-cell {
          text-align: center;
          width: 100%;
          }
          .header {
          margin-top: 20px !important;
          margin-bottom: 2px !important;
          }
          .shop-name__cell {
          display: block;
          }
          .order-number__cell {
          display: block;
          text-align: left !important;
          margin-top: 20px;
          }
          .button {
          width: 100%;
          }
          .or {
          margin-right: 0 !important;
          }
          .apple-wallet-button {
          text-align: center;
          }
          .customer-info__item {
          display: block;
          width: 100% !important;
          }
          .spacer {
          display: none;
          }
          .subtotal-spacer {
          display: none;
          }
          }
        </style>
        <table class="body" style="height: 100% !important; width: 100% !important; border-spacing: 0; border-collapse: collapse;">
          <tbody>
            <tr>
              <td style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                <table class="header row" style="width: 100%; border-spacing: 0; border-collapse: collapse; margin: 40px 0 20px;">
                  <tbody>
                    <tr>
                      <td class="header__cell" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                        <center>
                          <table class="container" style="width: 560px; text-align: left; border-spacing: 0; border-collapse: collapse; margin: 0 auto;">
                            <tbody>
                              <tr>
                                <td style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                  <table class="row" style="width: 100%; border-spacing: 0; border-collapse: collapse;">
                                    <tbody>
                                      <tr id="logoContainer">
                                        <td class="shop-name__cell" style="margin-bottom: 10px; font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;" align="center">
                                          <img src="{{logoUrl}}" alt="Logo" width="200" style="max-height: 100px; width: auto; max-width: 200px; height: auto;">
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </center>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table class="row content" style="width: 100%; border-spacing: 0; border-collapse: collapse;">
                  <tbody>
                    <tr>
                      <td class="content__cell" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; border: 0;">
                        <center>
                          <table class="container" style="width: 560px; text-align: left; border-spacing: 0; border-collapse: collapse; margin: 0 auto;">
                            <tbody>
                              <tr>
                                <td style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                  <h1 style="font-weight: normal; font-size: 24px; margin: 0 0 10px;">{{subject}}</h1>
                                  <p style="color: #444; line-height: 150%; font-size: 16px; margin: 0;">{{content}}</p>
                                  <table class="row actions" style="width: 100%; border-spacing: 0; border-collapse: collapse; margin-top: 20px;">
                                    <tbody>
                                      <tr>
                                        <td class="empty-line" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; line-height: 0em;">&nbsp;</td>
                                      </tr>
                                      <tr>
                                        <td class="actions__cell" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif;">
                                          <table class="button main-action-cell" style="border-spacing: 0; border-collapse: collapse; float: left; margin-right: 15px;">
                                            <tbody>
                                              <tr>
                                                <td class="button__cell" style="font-family: -apple-system, BlinkMacSystemFont, &quot;Segoe UI&quot;, &quot;Roboto&quot;, &quot;Oxygen&quot;, &quot;Ubuntu&quot;, &quot;Cantarell&quot;, &quot;Fira Sans&quot;, &quot;Droid Sans&quot;, &quot;Helvetica Neue&quot;, sans-serif; border-radius: 30px;" align="center"   bgcolor="#1b1b1b">
                                                  <a href="{{inviteURL}}" class="button__text" style="font-size: 16px; text-decoration: none; display: block; color: #fff; padding: 18px 35px; color: #FFFFFF">Accept Invite</a>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </center>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          </tbody>
        </table>
      </body>
    </html>`
  )
} 