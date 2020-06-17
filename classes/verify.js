/**
 * Verify/Register Server Handler
 * @description Server registration service.
 */
const { ServiceBase } = require(`${__dirname}/@base.js`);

class VerifyHandler extends ServiceBase {
  async handleRequest(data)
  {
    this.Sentry.configureScope((scope) => {
      scope.setExtra("method", "handleRequest");
    });
    // do something
  }
}

module.exports = { VerifyHandler }