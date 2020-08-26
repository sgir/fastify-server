/**
All core functionality goes here. Other stuff can be separated and loaded as plugins.
*/

// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })


//Require Plugins for later registration to fastify Object in the order of loading
const pointofView = require('point-of-view')

//modular code loaded as custom plugins (recommended to be loaded after core)
const oauth2Setup = require('./auth/oauth2Setup') //loaded using fastify-plugin
const routes = require('./router/router')




//Register Plugins to Fastify - Register API is async and creates a new context
fastify.register(pointofView, {
    engine: {
        ejs: require('ejs')
    }
})
fastify.register(oauth2Setup)


//Register routes
fastify.register(routes)

// Run the server!
const start = async () => {
    try {
        await fastify.listen(3000)
        fastify.log.info(`server listening on ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()
