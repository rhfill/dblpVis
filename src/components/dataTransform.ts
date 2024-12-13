// Index,Journals,Web of Science Documents,Cites,Cites/Paper,Top Papers

export type Journal = {
  index: number;
  name: string;
  webOfScienceDocuments: number;
  cites: number;
  citesPerPaper: number;
  topPapers: number;
};

export function transformJ(data: any[]): Journal[] {
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
