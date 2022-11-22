import axios from "axios";

async function doGet(url) {
    try {
        return await axios.get(url)
    }
    catch (error) {
        //alert(error)
        console.log(error)
    }
}

async function getKubernetesIngresses() {
    const response = await doGet("http://localhost:3000/k8s/ingresses");
    console.log(response);

    return response.data;
}

export { getKubernetesIngresses };