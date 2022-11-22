const k8s = require('@kubernetes/client-node');

// FIXME provide a way to configure the context
const kc = new k8s.KubeConfig();
kc.loadFromDefault();


const k8sApi = kc.makeApiClient(k8s.CoreV1Api);
const appsV1Api = kc.makeApiClient(k8s.AppsV1Api);
const networkingV1Api = kc.makeApiClient(k8s.NetworkingV1Api);


function getContexts() {
    return kc.contexts;
}
function getCurrentContext() {
    return kc.currentContext;
}

function mapContainer(container) {
    const mappedContainer = {
        name: container.name,
        image: container.image,
        resources: container.resources
    }

    if (container.ports) {
        mappedContainer.ports = container.ports.map((port) => {
            return `${port.name}/${port.containerPort}/${port.protocol}`
        });
    }

    return mappedContainer;
}


function mapV1Deployment(v1deployment) {
    let c = {
        uid: v1deployment.metadata.uid,
        name: v1deployment.metadata.name,
        namespace: v1deployment.metadata.namespace,
        containers: v1deployment.spec.template.spec.containers.map(mapContainer)
    }

    if (v1deployment.spec.template.spec.initContainers) {
        c.initContainers = v1deployment.spec.template.spec.initContainers.map(mapContainer)
    }

    return c;
}

function mapV1Ingress(v1ingress) {

    //console.log(v1ingress);

    let c = {
        uid: v1ingress.metadata.uid,
        name: v1ingress.metadata.name,
        namespace: v1ingress.metadata.namespace,
    };

    c.ingress_class_name = v1ingress.spec.ingressClassName;

    if (v1ingress.spec.rules) {
        const rules = v1ingress.spec.rules.map((rule) => {
            if (rule.http.paths.length > 1) {
                console.warn("There are several rule paths : " + rule.http.paths.length);
            }

            const backend_services = rule.http.paths.map((path) => {
                return {
                    name: path.backend.service.name,
                    port: path.backend.service.port.number,
                    path: path.path
                }
            })

            if (backend_services.length > 1) {
                console.warn("There are several backend services : " + backend_services.length);
            }

            return {
                host: rule.host,
                backend_services
            }
        });

        if (rules.length > 1) {
            console.warn("There are several rules : " + rules.length);
        }

        c.rules = rules;
    } else {
        c.rules = [];
    }


    if (v1ingress.status.loadBalancer.ingress.length == 1) {
        c.loadbalancer_ip = v1ingress.status.loadBalancer.ingress[0].ip;
    } else {
        console.warn("There are several ingress statuses");
    }

    return c;
}

async function getDeployments() {
    const deps_raws = await appsV1Api.listDeploymentForAllNamespaces();
    return deps_raws.body.items.map(mapV1Deployment);
}
async function getStatefulSets() {
    const sts_raws = await appsV1Api.listStatefulSetForAllNamespaces();
    return sts_raws.body.items.map(mapV1Deployment);
}
async function getIngresses() {
    const ingresses = await networkingV1Api.listIngressForAllNamespaces();
    //return mapV1Ingress(ingresses.body.items[7]);
    return ingresses.body.items.map(mapV1Ingress);
}

module.exports = {
    getContexts,
    getCurrentContext,
    getDeployments,
    getStatefulSets,
    getIngresses
}