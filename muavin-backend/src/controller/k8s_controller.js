
const k8s = require("../modules/k8s");
const kubernetes = require("../connectors/kubernetes");

async function getContexts(request, reply) {
    return await kubernetes.getContexts();
}

async function getIngresses(request, reply) {
    return await kubernetes.getIngresses();
}

module.exports = {
    getContexts,
    getIngresses
}