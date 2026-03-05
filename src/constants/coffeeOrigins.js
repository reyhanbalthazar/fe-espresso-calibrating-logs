export const COFFEE_ORIGIN_GROUPS = [
  {
    region: 'South America',
    producers: ['Brazil', 'Colombia', 'Peru', 'Ecuador', 'Bolivia', 'Venezuela', 'Paraguay', 'Guyana'],
  },
  {
    region: 'Central America',
    producers: ['Honduras', 'Guatemala', 'Nicaragua', 'Costa Rica', 'El Salvador', 'Panama', 'Belize'],
  },
  {
    region: 'North America',
    producers: ['Mexico', 'USA (Hawaii and California)'],
  },
  {
    region: 'Africa',
    producers: [
      'Ethiopia',
      'Uganda',
      "Cote d'Ivoire",
      'Kenya',
      'Tanzania',
      'Rwanda',
      'Burundi',
      'Madagascar',
      'Guinea',
      'Togo',
      'Cameroon',
      'DR Congo',
      'Central African Republic',
      'Angola',
      'Malawi',
      'Zambia',
      'Zimbabwe',
    ],
  },
  {
    region: 'Asia',
    producers: [
      'Vietnam',
      'Indonesia',
      'India',
      'China (Yunnan)',
      'Thailand',
      'Laos',
      'Philippines',
      'Myanmar',
      'Malaysia',
      'Timor-Leste',
      'Yemen',
      'Nepal',
      'Cambodia',
    ],
  },
  {
    region: 'Caribbean',
    producers: [
      'Dominican Republic',
      'Jamaica (Blue Mountain)',
      'Haiti',
      'Cuba',
      'Puerto Rico',
      'Trinidad and Tobago',
    ],
  },
  {
    region: 'Oceania',
    producers: ['Papua New Guinea', 'Australia (small scale)', 'Fiji', 'New Caledonia'],
  },
];

const ORIGIN_LOOKUP = COFFEE_ORIGIN_GROUPS.flatMap((group) => group.producers).reduce(
  (acc, producer) => {
    acc[producer.toLowerCase()] = producer;
    return acc;
  },
  {}
);

const ORIGIN_ALIASES = {
  'usa': 'USA (Hawaii and California)',
  'united states': 'USA (Hawaii and California)',
  "cote d'ivoire": "Cote d'Ivoire",
  'ivory coast': "Cote d'Ivoire",
  'drc': 'DR Congo',
  'congo dr': 'DR Congo',
  'congo': 'DR Congo',
  'china': 'China (Yunnan)',
  'jamaica': 'Jamaica (Blue Mountain)',
  'australia': 'Australia (small scale)',
};

export const normalizeCoffeeOrigin = (value) => {
  if (!value) return '';
  const normalizedKey = value.trim().toLowerCase();
  return ORIGIN_LOOKUP[normalizedKey] || ORIGIN_ALIASES[normalizedKey] || '';
};

