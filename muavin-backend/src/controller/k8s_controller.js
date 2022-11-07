
const k8s = require("../modules/k8s");
const kubernetes = require("../connectors/kubernetes");

async function getContexts(request, reply) {
    return await kubernetes.getContexts();
}

module.exports = {
    getContexts
}