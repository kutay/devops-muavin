// Require the framework and instantiate it
const fastify = require('fastify')({ logger: true })

const k8s_controller = require("./src/controller/k8s_controller");

fastify.addHook('preHandler', (req, res, done) => {

    // https://github.com/fastify/fastify-cors

    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET");
    res.header("Access-Control-Allow-Headers", "*");

    const isPreflight = /options/i.test(req.method);
    if (isPreflight) {
        return res.send();
    }

    done();
})

fastify.get('/k8s/contexts', k8s_controller.getContexts);
fastify.get('/k8s/ingresses', k8s_controller.getIngresses);

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