/**
 * Declare Routes
 */

let Bearer = require('permit').Bearer //ES Modules is supported by latest node. check how this works with CommonJS.
const permit = new Bearer({
    query: 'access_token' //enables `?access_token=` query parameter.
})

async function routes(fastify, options, done) { // if we want to require this as a plugin and register, this must expose a single function with the signature function (fastify, options, done) {}

    /**
     * use the Permit auth lib to check if each request possesses a bearer token
     * @param request
     * @param reply
     * @param done
     */
    function hasBearerToken (request,reply,done){
        //check for a bearer token - this is not validated yet!
        const token = permit.check(request.raw)

        console.log(token);

        //no token -> throw 401
        if(!token){
            permit.fail(reply.raw)
            done()
        }
        done()
    }

    fastify.get('/auth/callback', async(request,reply)=>{
        const token = await fastify.customOauth2.getAccessTokenFromAuthorizationCodeFlow(request)

        console.log(token.access_token)

        // if later you need to refresh the token you can use
        // const newToken = await this.getNewAccessTokenUsingRefreshToken(token.refresh_token)

        //store the token

        //decorate the req object with a token

        //display the token
        reply.send({
            access_token: token.access_token,
            id_token: token.id_token,
            type: token.token_type,
            scope: token.scope,
            expires_in: token.expires_in
        })
    });


    fastify.get('/', (request, reply) => {
        //todo - other files  such as /mushroom.png are not served at the moment.
        reply.view('/views/landing.ejs')
    });

    /**
     * This adds the preHandler hook to all routes - some routes need to be open.
     */
    // fastify.addHook('preHandler', (request,reply,done)=>{
    //     //check for a bearer token - this is not validated yet!
    //     const token = permit.check(request.raw)
    //
    //     console.log(token);
    //
    //     //no token -> throw 401
    //     if(!token){
    //         permit.fail(reply.raw)
    //     }
    //
    //     //how to validate the token
    //
    //     //how to store the token
    //     // Perform your authentication logic however you'd like...
    //     // const user = await db.users.findByToken(token)
    //
    //     // No user found, so their token was invalid.
    //     // if (!user) {
    //     //     permit.fail(reply.res)
    //     //     throw new Error('Authentication invalid!')
    //     // }
    //     //
    //     // // Authentication succeeded, save the context and proceed...
    //     // request.user = user
    //     done()
    // });

    /**
     * example for a protected resource
     */
    fastify.route({
        method: "GET",
        url: '/health',
        handler: async (request, reply) => {
            return reply.code;
        },
        preHandler: hasBearerToken
    });

    fastify.get('/unauthorized', (request, reply) => {
        //redirect to this route and display 401 page when needed
        reply.send(reply.path)
    });

    fastify.get('/logout', (request, reply) => {
        // remove session cookie/ remove bearer token
        reply.send(reply.path)
    });

    /**
     * example for a protected resource
     */
    fastify.route({
        method: "GET",
        url: '*',
        handler: (request, reply) => {
            reply.send(reply.path)
        },
        preHandler: hasBearerToken
    });
done()
}

module.exports = routes;

