import type { City } from './city';

export const CITIES: readonly City[] = [
  {
    id: 'singapore',
    name: 'Singapore',
    climate: 'tropical',
    clues: {
      tempRange: '24–32°C in every month',
      rainfall: 'About 2,200 mm a year, with storms in all seasons',
      seasonFeel: 'Hot and sticky all year, with no real cool season',
    },
    explanation: 'Singapore stays hot and very wet in every month, so the climate is tropical.',
  },
  {
    id: 'manaus',
    name: 'Manaus, Brazil',
    climate: 'tropical',
    clues: {
      tempRange: '23–33°C',
      rainfall: 'About 2,300 mm a year',
      seasonFeel: 'Heavy wet-season downpours and rainforest heat',
    },
    explanation: 'Manaus is hot and soaked by Amazon rain, so the climate is tropical.',
  },
  {
    id: 'mumbai',
    name: 'Mumbai, India',
    climate: 'tropical',
    clues: {
      tempRange: '24–33°C',
      rainfall: 'About 2,200 mm a year, most of it in a fierce wet season',
      seasonFeel: 'Hot and humid, then weeks of flooding rain',
    },
    explanation: "Mumbai's heat and long wet season make the climate tropical.",
  },
  {
    id: 'cairo',
    name: 'Cairo, Egypt',
    climate: 'dry',
    clues: {
      tempRange: '14–35°C across the year',
      rainfall: 'About 25 mm a year',
      seasonFeel: 'Harsh sun, dusty air, and months that stay rainless',
    },
    explanation: 'Cairo gets almost no rain and long dry heat, so the climate is dry.',
  },
  {
    id: 'phoenix',
    name: 'Phoenix, United States',
    climate: 'dry',
    clues: {
      tempRange: '8–41°C',
      rainfall: 'About 200 mm a year',
      seasonFeel: 'Blazing summers, cool winter nights, and long gaps between storms',
    },
    explanation: 'Phoenix has desert heat and little yearly rain, so the climate is dry.',
  },
  {
    id: 'lima',
    name: 'Lima, Peru',
    climate: 'dry',
    clues: {
      tempRange: '16–26°C',
      rainfall: 'About 15 mm a year',
      seasonFeel: 'Gray mornings and mild days, but real rain almost never arrives',
    },
    explanation: 'Lima stays mild but nearly rainless, so the climate is dry.',
  },
  {
    id: 'london',
    name: 'London, United Kingdom',
    climate: 'temperate',
    clues: {
      tempRange: '5–23°C',
      rainfall: 'About 600 mm a year, spread through the months',
      seasonFeel: 'Cool, cloudy, and damp, without a deep freeze or a long hot spell',
    },
    explanation: 'London has mild seasons and moderate rain, so the climate is temperate.',
  },
  {
    id: 'lisbon',
    name: 'Lisbon, Portugal',
    climate: 'temperate',
    clues: {
      tempRange: '11–28°C',
      rainfall: 'About 750 mm a year, mostly in the cooler months',
      seasonFeel: 'Mild winters and warm, brighter summers',
    },
    explanation: 'Lisbon has a mild winter, a warm summer, and moderate rain, so the climate is temperate.',
  },
  {
    id: 'wellington',
    name: 'Wellington, New Zealand',
    climate: 'temperate',
    clues: {
      tempRange: '6–20°C',
      rainfall: 'About 1,250 mm a year',
      seasonFeel: 'Windy and changeable, cool in winter and mild in summer',
    },
    explanation: 'Wellington stays mild and often wet, without a hard winter, so the climate is temperate.',
  },
  {
    id: 'moscow',
    name: 'Moscow, Russia',
    climate: 'continental',
    clues: {
      tempRange: '−8–24°C',
      rainfall: 'About 700 mm of rain and snow a year',
      seasonFeel: 'Snow-covered winters and warm summers',
    },
    explanation: 'Moscow swings from a hard winter to a warm summer, so the climate is continental.',
  },
  {
    id: 'chicago',
    name: 'Chicago, United States',
    climate: 'continental',
    clues: {
      tempRange: '−4–29°C',
      rainfall: 'About 950 mm of rain and snow a year',
      seasonFeel: 'Icy winters, hot summers, and a sharp change between them',
    },
    explanation: 'Chicago goes from frozen winters to hot summers, so the climate is continental.',
  },
  {
    id: 'montreal',
    name: 'Montreal, Canada',
    climate: 'continental',
    clues: {
      tempRange: '−9–26°C',
      rainfall: 'About 1,000 mm of rain and snow a year',
      seasonFeel: 'Long snowy winters and warm, humid summers',
    },
    explanation: "Montreal's long freeze and warm summer make the climate continental.",
  },
  {
    id: 'longyearbyen',
    name: 'Longyearbyen, Norway',
    climate: 'polar',
    clues: {
      tempRange: '−16–7°C',
      rainfall: 'About 200 mm a year, much of it snow',
      seasonFeel: 'Weeks without sunrise in winter, midnight sun in summer, and cold in every month',
    },
    explanation: 'Longyearbyen stays below freezing for much of the year, so the climate is polar.',
  },
  {
    id: 'nuuk',
    name: 'Nuuk, Greenland',
    climate: 'polar',
    clues: {
      tempRange: '−9–10°C',
      rainfall: 'About 750 mm of precipitation a year',
      seasonFeel: 'Cold wind, frequent snow, and a short cool summer',
    },
    explanation: "Nuuk's year is dominated by cold and snow, so the climate is polar.",
  },
  {
    id: 'utqiagvik',
    name: 'Utqiagvik, United States',
    climate: 'polar',
    clues: {
      tempRange: '−25–8°C',
      rainfall: 'About 130 mm a year, mostly snow',
      seasonFeel: 'The sea freezes, winter darkness lasts for weeks, and summer stays chilly',
    },
    explanation: 'Utqiagvik stays cold even in summer, so the climate is polar.',
  },
];
