// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

const k8s_controller = require("./src/controller/k8s_controller");

// Declare a route
fastify.get('/', async (request, reply) => {
    return { hello: 'world' }
})

fastify.get('/k8s/contexts', k8s_controller.getContexts);

// Run the server!
const start = async () => {
    try {
        await fastify.listen({ port: 3000 })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}
start()