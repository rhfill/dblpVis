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

