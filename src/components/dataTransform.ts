// Type for "Journals - Top paper - CS.csv"

// Index,Journals,Web of Science Documents,Cites,Cites/Paper,Top Papers
export type Journal = {
  index: number;
  name: string;
  webOfScienceDocuments: number;
  cites: number;
  citesPerPaper: number;
  topPapers: number;
};

export function transformJournal(data: any[]): Journal[] {
  return data.map((d, i) => {
    return {
      index: parseInt(d["Index"]),
      name: d.Journals,
      webOfScienceDocuments: parseInt(d["Web of Science Documents"]),
      cites: parseInt(d.Cites),
      citesPerPaper: parseFloat(d["Cites/Paper"]),
      topPapers: parseInt(d["Top Papers"]),
    } as Journal;
  });
}

// Index,Institutions,Countries/Regions,Web of Science Documents,Cites,Cites/Paper,Top Papers
export type Institution = {
  index: number;
  name: string;
  country: string;
  webOfScienceDocuments: number;
  cites: number;
  citesPerPaper: number;
  topPapers: number;
};

export function transformInstitution(data: any[]): Institution[] {
  return data.map((d, i) => {
    return {
      index: parseInt(d["Index"]),
      name: d.Institutions,
      country: d["Countries/Regions"],
      webOfScienceDocuments: parseInt(d["Web of Science Documents"]),
      cites: parseInt(d.Cites),
      citesPerPaper: parseFloat(d["Cites/Paper"]),
      topPapers: parseInt(d["Top Papers"]),
    } as Institution;
  });
}

// ,author,ee,mdate,key,title,pages,year,volume,journal,number,url
export type Article200 = {
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

export function transformArticle200(data: any[]): Article200[] {
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