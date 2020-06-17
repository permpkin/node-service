/**
 * Uptime Check Service
 * @description Checks the health of an array of servers.
 */
const { ServiceBase } = require(`${__dirname}/@base.js`);

class UptimeHandler extends ServiceBase {
  async handleRequest(data)
  {
    this.Sentry.configureScope((scope) => {
      scope.setExtra("method", "handleRequest");
    });
    // do something
  }
}

module.exports = { UptimeHandler }