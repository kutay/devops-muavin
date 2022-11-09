const semver = require("semver");

const dockerhub = require("../connectors/dockerhub");
const cache = require("./cache");

async function getAvailableTagsWithCache(ns, name) {
    const cache_key = `${ns}_${name}_tags`;

    if (await cache.exists(cache_key)) {
        const data = await cache.retrieve(cache_key);
        return JSON.parse(data);
    } else {
        const tags = await dockerhub.get_tags_list(ns, name);
        await cache.save(cache_key, JSON.stringify(tags));
        return tags;
    }
}
async function getAvailableTags(ns, name) {
    const tags = await getAvailableTagsWithCache(ns, name);
    return tags.map(mapResultItem);
}


async function getAvailableTagsAfter(ns, name, version) {
    const tags = await getAvailableTagsWithCache(ns, name);
    const validTags = tags
        .filter((tag) => semver.valid(tag.name))
        .filter((tag) => semver.coerce(tag.name).raw === tag.name)
        .filter((tag) => semver.lt(version, tag.name));

    return validTags.map(mapResultItem);
}


function mapResultItem(item) {
    return {
        tag_name: item.name,
        last_updated: item.last_updated,
        digest: item.digest
    }
}



function split_image(image) {
    const result = {};

    const parts1 = image.split(":");
    const parts2 = parts1[0].split("/");

    if (parts1.length == 1) {
        result.version = "latest";
    } else if (parts1.length == 2) {
        result.version = parts1[1];
    } else {
        console.error("Error");
    }

    if (parts2.length == 1) {
        result.namespace = "";
        result.name = "";
    } else if (parts2.length == 2) {
        result.namespace = parts2[0];
        result.name = parts2[1];
    } else {
        console.error("Error");
    }

    return result;
}

module.exports = {
    getAvailableTags,
    getAvailableTagsAfter, 
    split_image
}