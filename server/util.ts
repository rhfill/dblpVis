type Article200 = {
    index: number;
    authors: string[];
    ee: string[];
    mdate: string;
    key: string;
    title: string;
    pages: string;
    year: number;
    volume: string;
    journal: string;
    number: string;
    url: string;
};

function transformArticle200(data: any[]): Article200[] {
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
        } as Article200;
    });
}

import * as d3 from "d3";

function processData2Weight(data: Article200[]) {
    const segmenterFr = new (Intl as any).Segmenter('en', { granularity: 'word', localeMatcher: 'best fit' });
    let weight = new Map<string, number>();
    data.forEach((d) => {
        const iterator = segmenterFr.segment(d.title);
        for (let { segment } of iterator) {
            segment = segment.toLowerCase()
            if (segment.length < 2) {
                continue;
            }
            if (weight.has(segment)) {
                weight.set(segment, weight.get(segment) + 1);
            } else {
                weight.set(segment, 1);
            }
        }
    });
    return weight;
}

const getRidOf = [
    "the", 'of', 'with', 'and', 'or', 'in', 'for'
]

import fs from "fs";

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

