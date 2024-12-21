export function transformArticle200(data) {
    return data.map((d, i) => {
        return {
            index: parseInt(d["index"]),
            authors: d["author"].slice(1, -1).split(","),
            ee: d["ee"].slice(1, -1).split(","),
            mdate: d["mdate"],
            key: d["key"],
            title: d["title"],
            pages: d["pages"],
            year: parseInt(d["year"]),
            volume: d["volume"],
            journal: d["journal"],
            number: d["number"],
            url: d["url"],
        };
    });
}
export function processData2Weight(data) {
    const segmenterFr = new Intl.Segmenter('en', { granularity: 'word', localeMatcher: 'best fit' });
    let weight = new Map();
    data.forEach((d) => {
        const iterator = segmenterFr.segment(d.title);
        for (let { segment } of iterator) {
            segment = segment.toLowerCase();
            if (segment.length < 2) {
                continue;
            }
            if (weight.has(segment)) {
                weight.set(segment, weight.get(segment) + 1);
            }
            else {
                weight.set(segment, 1);
            }
        }
    });
    return weight;
}
export function transformPeople200(data) {
    return data.map((d, i) => {
        return {
            index: parseInt(d["index"]),
            name: d["name"],
            key: d["key"],
            type: d["type"],
        };
    });
}
export function author_link(allAuthors) {
    const giantMap = new Map();
    for (let i = 0; i < allAuthors.length; i++) {
        const author = allAuthors[i];
        if (giantMap.has(author.key)) {
            giantMap.set(author.key, [...giantMap.get(author.key), author.index.toString()]);
        }
        else {
            giantMap.set(author.key, [author.index.toString()]);
        }
    }
    let author_link = [];
    for (let [key, value] of giantMap) {
        for (let i = 0; i < value.length; i++) {
            for (let j = i + 1; j < value.length; j++) {
                author_link.push({ source: `author_${value[i]}`, target: `author_${value[j]}` });
            }
        }
    }
    return author_link;
}
export function author_key_link(allAuthors) {
    return allAuthors.map(d => {
        const keys = d.key.split("/");
        return { source: `author_${d.index}`, target: keys[keys.length - 1] };
    });
}
export function key_link(allAuthors) {
    const giantMap = new Map();
    const allKeys = allAuthors.map(d => d.key);
    const allKeySet = new Set(allKeys);
    allKeys.forEach((key) => {
        const keys = key.split("/");
        keys.forEach((key) => {
            if (!allKeySet.has(key)) {
                allKeySet.add(key);
            }
        });
        for (let i = 0; i < keys.length - 1; i++) {
            if (giantMap.has(keys[i])) {
                if (giantMap.get(keys[i]).has(keys[i + 1])) {
                    continue;
                }
                giantMap.get(keys[i]).add(keys[i + 1]);
            }
            else {
                giantMap.set(keys[i], new Set([keys[i + 1]]));
            }
        }
    });
    let key_link = [];
    let keys = new Set();
    for (let [key, value] of giantMap) {
        if (!keys.has(key)) {
            keys.add(key);
        }
        const _value = Array.from(value);
        for (let i = 0; i < _value.length; i++) {
            key_link.push({ source: key, target: _value[i] });
            if (!keys.has(_value[i])) {
                keys.add(_value[i]);
            }
        }
    }
    return [key_link, Array.from(keys)];
}
import fs from "fs";
import * as d3 from "d3";
export function debug() {
    const __data = fs.readFileSync("../public/People200.csv");
    const _data = d3.csvParse(__data.toString()).slice(1000, 1010);
    const allData = transformPeople200(_data);
    return [key_link(allData), _data];
}
