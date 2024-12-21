import fs from "fs";
import * as d3 from "d3";
import { processData2Weight, transformArticle200, transformPeople200 } from "./util.js";

const getRidOf = [
    "the", 'of', 'with', 'and', 'or', 'in', 'for'
]
export async function Article200FromYear(year?: number) {
    const __data = fs.readFileSync("../public/Article200.csv");
    const _data = d3.csvParse(__data.toString());
    const allData = transformArticle200(_data)
    if (!year) {
        let _allData = allData.map(d => d.year);
        _allData = Array.from(new Set(_allData));
        return _allData;
    }

    let data = allData.filter(d => d.year === year);
    const realData = processData2Weight(data);
    let realCloudData = Array.from(realData).map(([text, size]) => ({ text, size }));
    realCloudData = realCloudData.sort((a, b) => b.size - a.size);
    const okFine = realCloudData.filter(d => {
        if (getRidOf.includes(d.text)) {
            return false;
        }
        return true;
    });
    return okFine;
}

import { author_link, author_key_link, key_link } from "./util.js";
export async function CollaborationGraph() {
    const __data = fs.readFileSync("../public/People200.csv");
    const _data = d3.csvParse(__data.toString()).slice(1000, 1500);
    const allData = transformPeople200(_data)

    const _author_link = author_link(allData);
    const [_key_link, _key] = key_link(allData);
    const _author_key_link = author_key_link(allData);

    const allAuthors = allData.map(d => ({ id: `author_${d.index}`, name: d.name, group: 'author' }));
    const allKeys = Array.from(new Set(_key)).map(d => ({ id: d, name: d, group: 'type' }));

    const allNodes = allAuthors.concat(allKeys);
    const allLinks = _author_link.concat(_key_link).concat(_author_key_link);
    return {
        nodes: allNodes,
        links: allLinks.map(d => ({ id: `link_${d.source}-${d.target}`, source: d.source, target: d.target }))
    };
}
