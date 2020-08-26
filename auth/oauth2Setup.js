const fastifyPlugin = require('fastify-plugin')
const oauthPlugin = require('fastify-oauth2')

/**
 * Register the oauthPlugin to the fastify instance and expose using the fastify-plugin
 * @param fastify
 * @param options
 * @returns {Promise<void>}
 */
async function oauthSetup (fastify, options,done){ // if we want to require this as a plugin, this must expose a single function with the signature function (fastify, options, done) {}
    fastify.register(oauthPlugin, {
    name: 'customOauth2',
    credentials: {
        client: {
            id: 'Vmc0IpxUryAaL4UvtQj580djy8bCPEk0',
            secret: process.env.CLIENT_SECRET
        },
        auth: {
            authorizeHost: 'https://sathya01.auth0.com',
            authorizePath: '/authorize',
            tokenHost: 'https://sathya01.auth0.com',
            tokenPath: '/oauth/token'
        }
    },
    // register a fastify url to start the redirect flow
    startRedirectPath: '/auth',
    //register callback URI here
    callbackUri: 'http://localhost:3000/auth/callback',
    scope: 'openid email profile'
});

    done()
}

// Wrapping a plugin function with fastify-plugin exposes the decorators
// and hooks, declared inside the plugin to the parent scope.
module.exports = fastifyPlugin(oauthSetup)
