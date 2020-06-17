/**
 * Server registration verifier
 * @description POST queue processor.
 */
const { VerifyHandler } = require('../classes/verify.js');

module.exports = async (job) => {

  // Construct handler instance.
  new VerifyHandler(job.data.body)

  // Resolve job.
  return Promise.resolve();
}