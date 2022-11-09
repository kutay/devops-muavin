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


module.exports = {
    getAvailableTags,
    getAvailableTagsAfter
}