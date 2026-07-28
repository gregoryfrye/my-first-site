export type Role = {
  company: string;
  title: string;
  years: string;
  location: string;
  clients: string[];
  description: string;
  /** Matches a /content folder slug when this role has a linkable case study. */
  slug?: string;
};

// Reverse-chronological: most recent role first.
export const roles: Role[] = [
  {
    company: "Hudson Cannabis",
    title: "Creative Director",
    years: "2022–2025",
    location: "Hudson, NY",
    clients: [],
    description:
      "First outside creative hire; brand, product, and marketing through CBD-to-operator transition; scaled in-house product to $500K/month; acquired Dec 2025.",
    slug: "hudson-cannabis",
  },
  {
    company: "Independent",
    title: "Designer & Creative Director",
    years: "2019–2022",
    location: "Brooklyn, NY",
    clients: [
      "Fabric Risk",
      "Field Mag",
      "Gossamer",
      "HealHaus",
      "Mosspark",
      "Sanctuary Computer",
      "Smalls",
    ],
    description:
      "Guiding startups and studios through brand identities, digital products, and campaigns.",
  },
  {
    company: "Human NYC",
    title: "Design Director",
    years: "2016–2019",
    location: "New York, NY",
    clients: [
      "Beni Rugs",
      "Block Renovation",
      "Bobbie Baby",
      "Casper",
      "Lalo",
      "Myro",
      "Octave Health",
      "Sustain Natural",
    ],
    description:
      "Brand and digital expressions to launch startups with founders, investors, and teams.",
  },
  {
    company: "Wondersauce",
    title: "Senior Designer–ACD",
    years: "2013–2016",
    location: "New York, NY",
    clients: ["The Fader", "GQ", "Greats Brand", "Master & Dynamic"],
    description:
      "Led creative on digital products for ecommerce brands and established publications.",
  },
  {
    company: "Gin Lane",
    title: "Designer",
    years: "2010–2012",
    location: "New York, NY",
    clients: ["Adidas", "AOL", "Jason Nocito", "Saturdays NYC"],
    description:
      "Digital experiences for artists, culture-defining brands, and Fortune 500 companies.",
  },
  {
    company: "Eastern Mountain Sports",
    title: "Designer",
    years: "2008–2010",
    location: "Peterborough, NH",
    clients: ["EMS Soho signage", "Nor'easter Music Festival"],
    description:
      "Refined marketing and brand design systems; concepted and pitched new brand initiatives.",
  },
];
