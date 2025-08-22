export type Manager = {
  name: string;
  slug: string;
  cik: string;            // 10-digit with leading zeros
  website?: string;
};

export const MANAGERS: Manager[] = [
  { name: "First Eagle Investment Management, LLC", slug: "first-eagle", cik: "0001325447" },
  { name: "Yacktman Asset Management LP", slug: "yacktman", cik: "0000905567" },
  { name: "Primecap Management Co/CA/", slug: "primecap", cik: "0000763212" },
  { name: "Ariel Investments, LLC", slug: "ariel", cik: "0000936753" },
  { name: "Himalaya Capital Management LLC", slug: "himalaya", cik: "0001709323" },
  { name: "Harris Associates L.P.", slug: "harris", cik: "0000813917" },
  { name: "Dorsey Asset Management, LLC", slug: "dorsey", cik: "0001671657" },
  { name: "Akre Capital Management, LLC", slug: "akre", cik: "0001112520" },
  { name: "Wedgewood Partners, Inc.", slug: "wedgewood", cik: "0000859804" },
  { name: "Berkshire Hathaway Inc.", slug: "berkshire", cik: "0001067983" },
];