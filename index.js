console.log(`::: ${(process.env.NODE_ENV||'development')} :::`)

/**
 * Start error handler
 */
const Sentry = require(`${__dirname}/classes/sentry.js`)

/**
 * Create http instance
 */
const Http = require('fastify')({
  ignoreTrailingSlash: true
})

/**
 * Capture Http errors, route to Sentry.
 */
Http.setErrorHandler((err, req, reply) => {
  Sentry.withScope(scope => {
    scope.setUser({
      ip_address: req.raw.ip
    });
    scope.setTag("path", req.raw.url);
    Sentry.captureException(err);
    reply.send({
      error: 500,
      message: "Internal Server Error"
    });
  });
});

/**
 * Register sensible responders
 */
Http.register(require('fastify-sensible'), {})

/**
 * Register security handlers
 */
Http.register(require('fastify-helmet'), { hidePoweredBy: true })

/**
 * Add Job Queues
 */
const Queue = require('bull')

// handles inbound requests queue.
const RequestHandler = new Queue('RequestHandler');

// split POST requests into sepeerate process handler. (max 1 concurrent active service).
RequestHandler.process(1, `${__dirname}/methods/verify.js`)

/**
 * Uptime Cron
 * @description handles scheduled uptime queue.
 */
const UptimeCronScheduler = new Queue('UptimeCronScheduler')

// create uptime cron routine.
UptimeCronScheduler.process(`${__dirname}/methods/uptime-cron.js`)

// run routine every 30 minutes.
UptimeCronScheduler.add({time: new Date}, { repeat: { cron: '*/5 * * * *' } })

/**
 * Capture POST
 * @description listens for device/server registration.
 */
Http.post('/api/v1/:token', async (req, res) => {

  // log JSON body.
  RequestHandler.add({ body: req.body, token: req.params.token })
  
  // return OK and continue.
  res.code(200).send()

})

/**
 * Catch all, return 404
 */
Http.all('*', (req, res) => res.code(404).send())

/**
 * Start listening
 */
const start = async () => {
  try {
    await Http.listen({
      port: process.env.PORT,
      host: ((process.env.NODE_ENV !== 'production')?'0.0.0.0':'127.0.0.1')
    })
    console.log(`listening on ${Http.server.address().port}`)
  } catch (err) {
    Http.log.error(err)
    process.exit(1)
  }
}

start()