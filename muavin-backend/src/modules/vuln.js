const _ = require("lodash");
const cache = require("./cache");
const trivy = require("../connectors/trivy");
const container_versions = require("./container_versions");

async function scan_with_cache(image) {

    // FIXME use sha 
    const cache_key = image;

    if (await cache.exists(cache_key)) {
        const data = await cache.retrieve(cache_key);
        return JSON.parse(data);
    } else {
        const scan_result = await trivy.scan_image(image);
        await cache.save(cache_key, JSON.stringify(scan_result));
        return scan_result;
    }
}


async function analyze_image(image) {
    const scan = await scan_with_cache(image);

    const clean_results = scan.Results.map((result) => {
        if (!result.Vulnerabilities) {
            return [];
        }
        return result.Vulnerabilities.map((vuln) => {
            return {
                Target: result.Target,
                Type: result.Type,
                VulnerabilityID: vuln.VulnerabilityID,
                PkgName: vuln.PkgName,
                InstalledVersion: vuln.InstalledVersion,
                FixedVersion: vuln.FixedVersion,
                Severity: vuln.Severity,
                Score: vuln.CVSS && vuln.CVSS.nvd && vuln.CVSS.nvd.V3Score
            }
        })
    });

    return _.flatten(clean_results);
}

async function compare_images(image1, image2) {
    const vulns1 = await analyze_image(image1);
    const vulns2 = await analyze_image(image2);

    const ids1 = vulns1.map((v) => v.VulnerabilityID);
    const ids2 = vulns2.map((v) => v.VulnerabilityID);

    const fixedVulns = _.difference(ids1, ids2);
    const newVulns = _.difference(ids2, ids1);
    const unfixedVulns = _.intersection(ids1, ids2);

    return {
        image: {
            from: image1,
            to: image2
        },
        vulns: {
            fixed: fixedVulns,
            unfixedVulns: unfixedVulns,
            newVulns: newVulns
        }
    }
}

async function generate_matrix_images(image_versions) {

    const mapp = {};

    for (const im of image_versions) {
        const scan = await analyze_image(im);

        for (const vuln of scan) {
            if (!mapp[vuln.VulnerabilityID]) {
                mapp[vuln.VulnerabilityID] = {
                    details: vuln,
                    impacted_images: []
                }
            }

            mapp[vuln.VulnerabilityID].impacted_images.push(im);
        }
    }

    const vulnKeys = Object.keys(mapp);

    const matrix = [];

    for (const vkey of vulnKeys) {

        const line = {
            vuln_id: vkey,
            vuln_type: mapp[vkey].details.Type,
            vuln_severity: mapp[vkey].details.Severity,
            vuln_score: mapp[vkey].details.Score,
        }

        for (const im of image_versions) {
            if (mapp[vkey].impacted_images.includes(im)) {
                line[container_versions.split_image(im).version] = "y";
            } else {
                line[container_versions.split_image(im).version] = " ";
            }
        }

        matrix.push(line);
    }

    matrix.sort((a, b) => b.vuln_score - a.vuln_score);

    return matrix;
}

module.exports = {
    analyze_image,
    compare_images,
    generate_matrix_images
}