const axios = require('axios');

const cache = require("../modules/cache");

const DOCKERHUB_USER = process.env.DOCKERHUB_USERNAME;
const DOCKERHUB_PASSWORD = process.env.DOCKERHUB_PASSWORD;

async function authenticate() {
    const res = await axios.post("https://hub.docker.com/v2/users/login", {
        username: DOCKERHUB_USER,
        password: DOCKERHUB_PASSWORD
    })

    return res.data.token;
}

async function getToken() {
    const CACHE_KEY = "dockerhub_api_token4";
    if (!(await cache.exists(CACHE_KEY))) {
        const authtoken = await authenticate();
        await cache.save(CACHE_KEY, authtoken);
    }
    const token = await cache.retrieve(CACHE_KEY);

    //console.log(token);
    return token;
}

async function createAxiosInstance() {
    const token = await getToken();
    const instance = axios.create({
        baseURL: 'https://hub.docker.com/v2/',
        timeout: 3000,
        headers: {
            'Accept': "application/json",
            'Authorization': `Bearer ${token}`
        }
    });
    return instance;
}
async function doGet(url) {
    return await (await createAxiosInstance()).get(url);
}

async function get_details(namespace, repository) {
    const url = `namespaces/${namespace}/repositories/${repository}/images-summary`;
    const res = await doGet(url);
}
async function get_tags_list(namespace, repository) {
    const url = `namespaces/${namespace}/repositories/${repository}/tags?page_size=100`;
    const res = await doGet(url);
    return res.data.results;
}
async function get_repository_images(namespace, repository) {
    const url = `namespaces/${namespace}/repositories/${repository}/images?page_size=10`;
    const res = await doGet(url);
}

module.exports = {
    get_tags_list
}