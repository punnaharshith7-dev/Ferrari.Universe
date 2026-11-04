export interface FerrariModel {
  id: string;
  name: string;
  category: 'Supercars' | 'Hypercars' | 'GT Cars' | 'Sports Cars' | 'Convertible/Spider' | 'Track Cars' | 'Limited Editions' | 'Icona Series' | 'Classic' | 'Formula 1' | 'SUVs' | 'Concepts';
  year: number;
  price: string;
  priceNum: number;
  engine: string;
  horsepower: number;
  torque: string;
  torqueNum: number;
  topSpeed: string;
  topSpeedNum: number;
  zeroToHundred: string;
  zeroToHundredNum: number;
  weight: string;
  weightNum: number;
  transmission: string;
  fuelType: 'Petrol' | 'Hybrid' | 'Electric' | 'Racing Fuel';
  driveType: 'RWD' | 'AWD';
  dimensions: string;
  productionNumbers: string;
  description: string;
  history: string;
  interiorFeatures: string[];
  exteriorFeatures: string[];
  safetyFeatures: string[];
  images: string[];
  soundFreq: number;
  idleFreq: number;
  exhaustFlame: boolean;
  inProduction: boolean;
  availability: 'Available to Order' | 'Sold Out' | 'Discontinued' | 'Historical Archive' | 'Upcoming';
}

const rawFerrariData: Array<{
  id: string;
  name: string;
  category: FerrariModel['category'];
  year: number;
  engine: string;
  horsepower: number;
  images: [string, string];
  priceNum?: number;
  topSpeedNum?: number;
  zeroToHundredNum?: number;
  weightNum?: number;
  productionNumbers?: string;
  description?: string;
  history?: string;
}> = [
  {
    id: '125-s',
    name: 'Ferrari 125 S',
    category: 'Classic',
    year: 1947,
    engine: '1.5L Naturally Aspirated V12',
    horsepower: 118,
    images: [
      'https://upload.wikimedia.org/wikipedia/commons/b/b6/Ferrari_125_S_-_Museo_Enzo_Ferrari.jpg',
      'https://upload.wikimedia.org/wikipedia/commons/b/b8/1947_Ferrari_125_S_Petersen_Automotive_Museum.jpg'
    ],
    priceNum: 5000000,
    topSpeedNum: 210,
    zeroToHundredNum: 8.5,
    weightNum: 750,
    productionNumbers: '2 Units',
    description: 'The first vehicle to bear the Ferrari name, featuring Gioacchino Colombo\'s legendary high-revving 1.5-litre V12 engine.',
    history: 'Debuted on May 11, 1947, at the Piacenza racing circuit. Enzo Ferrari famously called its debut race "a promising failure" before it won the Rome Grand Prix shortly after.'
  },
  {
    id: '166-inter',
    name: 'Ferrari 166 Inter',
    category: 'Classic',
    year: 1948,
    engine: '2.0L Naturally Aspirated V12',
    horsepower: 110,
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 2000000,
    topSpeedNum: 150,
    zeroToHundredNum: 10.0,
    weightNum: 900,
    productionNumbers: '38 Units',
    description: 'Ferrari\'s first true grand tourer, designed for road use and fitted with custom coachwork by Carrozzeria Touring, Farina, or Ghia.',
    history: 'An evolution of the 166 S racing car, the Inter brought track reliability to the road, launching Ferrari as a builder of premium road-going GT cars.'
  },
  {
    id: '195-inter',
    name: 'Ferrari 195 Inter',
    category: 'Classic',
    year: 1950,
    engine: '2.3L Colombo V12',
    horsepower: 130,
    images: [
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 1500000,
    topSpeedNum: 155,
    zeroToHundredNum: 9.5,
    weightNum: 950,
    productionNumbers: '28 Units',
    description: 'A luxurious early GT with an enlarged Colombo V12 engine, built with custom bodies by Ghia, Vignale, and Touring.',
    history: 'Introduced at the 1950 Paris Motor Show as a grand tourer with a longer wheelbase to accommodate spacious bespoke cabins.'
  },
  {
    id: '212-inter',
    name: 'Ferrari 212 Inter',
    category: 'Classic',
    year: 1951,
    engine: '2.6L Colombo V12',
    horsepower: 150,
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1627454819213-f7724a733732?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 1800000,
    topSpeedNum: 185,
    zeroToHundredNum: 9.0,
    weightNum: 1000,
    productionNumbers: '82 Units',
    description: 'An iconic classic grand tourer featuring coachbuilt designs primarily by Pininfarina and Vignale.',
    history: 'Replacing the 195 Inter, it successfully bridge-crossed into international racing, winning the Carrera Panamericana in 1951.'
  },
  {
    id: '342-america',
    name: 'Ferrari 342 America',
    category: 'Classic',
    year: 1952,
    engine: '4.1L Lampredi V12',
    horsepower: 200,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 3500000,
    topSpeedNum: 186,
    zeroToHundredNum: 8.8,
    weightNum: 1200,
    productionNumbers: '6 Units',
    description: 'An ultra-rare grand tourer designed specifically for the affluent North American market, carrying Aurelio Lampredi\'s large V12.',
    history: 'Built exclusively for premium clients (including King Leopold of Belgium), featuring a custom long hood and bespoke coachwork.'
  },
  {
    id: '250-europa',
    name: 'Ferrari 250 Europa',
    category: 'Classic',
    year: 1953,
    engine: '3.0L Lampredi V12',
    horsepower: 200,
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 2500000,
    topSpeedNum: 218,
    zeroToHundredNum: 8.0,
    weightNum: 1150,
    productionNumbers: '22 Units',
    description: 'The foundation of the legendary 250 family, styled elegantly by Pininfarina and Vignale.',
    history: 'Revealed at the 1953 Paris Motor Show, the Europa is unique among 250s as it used the Lampredi V12 instead of the Colombo block.'
  },
  {
    id: '375-america',
    name: 'Ferrari 375 America',
    category: 'Classic',
    year: 1953,
    engine: '4.5L Lampredi V12',
    horsepower: 300,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 4000000,
    topSpeedNum: 240,
    zeroToHundredNum: 7.0,
    weightNum: 1300,
    productionNumbers: '12 Units',
    description: 'One of the fastest road cars of its time, combining a large 4.5L racing V12 with a highly luxurious tourer body.',
    history: 'Built side-by-side with the 250 Europa, the 375 was reserved for the world\'s most high-profile collectors and industrialists.'
  },
  {
    id: '250-gt-coupe',
    name: 'Ferrari 250 GT Coupé',
    category: 'Classic',
    year: 1954,
    engine: '3.0L Colombo V12',
    horsepower: 220,
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 1200000,
    topSpeedNum: 230,
    zeroToHundredNum: 7.5,
    weightNum: 1100,
    productionNumbers: '353 Units',
    description: 'The definitive standard road-going 250 GT, establishing the historic Pininfarina partnership for series production.',
    history: 'A cornerstone commercial success for Ferrari, allowing Enzo to fund his Scuderia racing program via highly polished road car sales.'
  },
  {
    id: '410-superamerica',
    name: 'Ferrari 410 Superamerica',
    category: 'Classic',
    year: 1955,
    engine: '5.0L Lampredi V12',
    horsepower: 340,
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 5500000,
    topSpeedNum: 262,
    zeroToHundredNum: 6.0,
    weightNum: 1200,
    productionNumbers: '35 Units',
    description: 'A monument to luxury and performance, boasting a massive 5.0L V12 and styling featuring classic fin tails.',
    history: 'The flagship model of the 1950s, representing the ultimate in grand touring prestige, owned by royalty, stars, and heads of state.'
  },
  {
    id: '250-gt-tdf',
    name: 'Ferrari 250 GT Berlinetta \"TdF\"',
    category: 'Classic',
    year: 1956,
    engine: '3.0L Colombo V12',
    horsepower: 240,
    images: [
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 8000000,
    topSpeedNum: 240,
    zeroToHundredNum: 6.5,
    weightNum: 1050,
    productionNumbers: '77 Units',
    description: 'Renowned racing Berlinetta featuring a distinctive louvred C-pillar and aggressive competition-derived stance.',
    history: 'Named after the legendary Tour de France Automobile race, which Ferrari dominated during the late 1950s with this model.'
  },
  {
    id: '250-gt-california',
    name: 'Ferrari 250 GT California Spyder',
    category: 'Classic',
    year: 1957,
    engine: '3.0L Colombo V12',
    horsepower: 240,
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 16000000,
    topSpeedNum: 240,
    zeroToHundredNum: 6.8,
    weightNum: 1100,
    productionNumbers: '106 Units',
    description: 'An open-top design masterpiece styled by Scaglietti, epitomizing the romance of 1950s California coasting.',
    history: 'Created by request of US distributors Luigi Chinetti and John von Neumann, who wanted a high-performance open-top spyder for sunny climates.'
  },
  {
    id: '250-gt-swb',
    name: 'Ferrari 250 GT SWB',
    category: 'Classic',
    year: 1959,
    engine: '3.0L Colombo V12',
    horsepower: 280,
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 10000000,
    topSpeedNum: 250,
    zeroToHundredNum: 5.8,
    weightNum: 1050,
    productionNumbers: '176 Units',
    description: 'An legendary short-wheelbase (SWB) racing model featuring a perfect, balanced, muscular stance.',
    history: 'A dual-purpose masterpiece designed for both track domination and road driving. It remains one of the most revered cars ever built.'
  },
  {
    id: '400-superamerica',
    name: 'Ferrari 400 Superamerica',
    category: 'Classic',
    year: 1959,
    engine: '4.0L Colombo V12',
    horsepower: 340,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 4500000,
    topSpeedNum: 265,
    zeroToHundredNum: 6.0,
    weightNum: 1250,
    productionNumbers: '47 Units',
    description: 'Showcasing the Pininfarina Aerodynamica nose, this V12 tourer represented the peak of 1950s aerodynamics.',
    history: 'Succeeded the 410 series, shifting back to Colombo engine architecture but bored-out for massive luxury cruising torque.'
  },
  {
    id: '250-gt-2-plus-2',
    name: 'Ferrari 250 GT 2+2',
    category: 'Classic',
    year: 1960,
    engine: '3.0L Colombo V12',
    horsepower: 240,
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 400000,
    topSpeedNum: 230,
    zeroToHundredNum: 7.8,
    weightNum: 1400,
    productionNumbers: '957 Units',
    description: 'Ferrari\'s first mass-produced four-seater grand tourer, offering the classic V12 in a highly practical family silhouette.',
    history: 'Enzo Ferrari\'s personal daily driver of choice, proving that high performance V12 machinery could adapt to refined touring.'
  },
  {
    id: '250-gto',
    name: 'Ferrari 250 GTO',
    category: 'Classic',
    year: 1962,
    engine: '3.0L Naturally Aspirated V12',
    horsepower: 300,
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 70000000,
    topSpeedNum: 280,
    zeroToHundredNum: 4.4,
    weightNum: 950,
    productionNumbers: '36 Units',
    description: 'The holy grail of car collecting. An iconic aerodynamic race homologation model with three triple nose intakes.',
    history: 'Created to compete in FIA Group 3 GT racing, the GTO won three consecutive World Championships. Today, it stands as the most valuable car in history.'
  },
  {
    id: '250-gt-lusso',
    name: 'Ferrari 250 GT Berlinetta Lusso',
    category: 'Classic',
    year: 1962,
    engine: '3.0L Colombo V12',
    horsepower: 240,
    images: [
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 2500000,
    topSpeedNum: 240,
    zeroToHundredNum: 7.2,
    weightNum: 1020,
    productionNumbers: '351 Units',
    description: 'Widely considered Pininfarina\'s most beautiful road design, featuring a sleek glasshouse and minimalist elegant cabin.',
    history: 'Introduced as the final grand road tourer in the 250 family, famously driven by legendary Hollywood icon Steve McQueen.'
  },
  {
    id: '330-america',
    name: 'Ferrari 330 America',
    category: 'Classic',
    year: 1963,
    engine: '4.0L Colombo V12',
    horsepower: 300,
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 550000,
    topSpeedNum: 245,
    zeroToHundredNum: 7.0,
    weightNum: 1380,
    productionNumbers: '50 Units',
    description: 'Combining the body layout of the 250 GT 2+2 with the newly engineered, high-displacement 4.0L V12 engine.',
    history: 'A transition model bridging the 250 and 330 eras, built specifically for the American market needing larger torque capacity.'
  },
  {
    id: '275-gtb',
    name: 'Ferrari 275 GTB',
    category: 'Classic',
    year: 1964,
    engine: '3.3L Colombo V12',
    horsepower: 280,
    images: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 3000000,
    topSpeedNum: 258,
    zeroToHundredNum: 6.0,
    weightNum: 1100,
    productionNumbers: '450 Units',
    description: 'An elegant long-nose silhouette representing Ferrari\'s transition to rear transaxles and independent rear suspension.',
    history: 'Introduced at the 1964 Paris Salon, the 275 GTB marked the end of pure mechanical solid rear axles, bringing F1-style transaxles to GT roads.'
  },
  {
    id: '500-superfast',
    name: 'Ferrari 500 Superfast',
    category: 'Classic',
    year: 1964,
    engine: '5.0L Colombo V12',
    horsepower: 400,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 3200000,
    topSpeedNum: 280,
    zeroToHundredNum: 5.9,
    weightNum: 1400,
    productionNumbers: '36 Units',
    description: 'The ultimate high-speed cruiser of the 1960s, carrying a massive 5-litre V12 producing an incredible 400 horsepower.',
    history: 'Designed as Ferrari\'s absolute premium flagship, sold exclusively to industry titans, kings, and elite sports car connoisseurs.'
  },
  {
    id: '330-gtc',
    name: 'Ferrari 330 GTC',
    category: 'Classic',
    year: 1966,
    engine: '4.0L Colombo V12',
    horsepower: 300,
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 750000,
    topSpeedNum: 242,
    zeroToHundredNum: 6.3,
    weightNum: 1300,
    productionNumbers: '598 Units',
    description: 'Highly acclaimed for combining the front styling of the 500 Superfast with the refined chassis of the 275 GTB.',
    history: 'Praised by motoring journalists as perhaps the best all-around road-going Ferrari of the decade, featuring superior luxury and visibility.'
  },
  {
    id: '365-california',
    name: 'Ferrari 365 California',
    category: 'Classic',
    year: 1966,
    engine: '4.4L Colombo V12',
    horsepower: 320,
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1627454819213-f7724a733732?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 4800000,
    topSpeedNum: 245,
    zeroToHundredNum: 6.5,
    weightNum: 1320,
    productionNumbers: '14 Units',
    description: 'An exceptionally rare, coachbuilt luxury convertible featuring a striking, long-tailed rear deck assembly.',
    history: 'Pininfarina styled only 14 examples of this grand speedster, reserving them for high-society jet setters in Europe and America.'
  },
  {
    id: 'dino-206-gt',
    name: 'Ferrari Dino 206 GT',
    category: 'Classic',
    year: 1967,
    engine: '2.0L V6 (All-Aluminum)',
    horsepower: 180,
    images: [
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 600000,
    topSpeedNum: 235,
    zeroToHundredNum: 7.5,
    weightNum: 900,
    productionNumbers: '152 Units',
    description: 'Ferrari\'s first mid-engined production road car, featuring voluptuous, curvaceous styling and aluminum panels.',
    history: 'Marketed under the "Dino" sub-brand as an homage to Enzo\'s late son, who helped conceptualize Ferrari\'s high-revving V6 racing engine.'
  },
  {
    id: '365-gtb-4-daytona',
    name: 'Ferrari 365 GTB/4 Daytona',
    category: 'Classic',
    year: 1968,
    engine: '4.4L Colombo V12',
    horsepower: 352,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 850000,
    topSpeedNum: 280,
    zeroToHundredNum: 5.4,
    weightNum: 1450,
    productionNumbers: '1406 Units',
    description: 'The ultimate front-engined classic V12. Featuring chiseled front profile design and a striking flat Kamm tail.',
    history: 'Informally named "Daytona" after Ferrari\'s historic 1-2-3 podium finish at the 1967 24 Hours of Daytona.'
  },
  {
    id: 'dino-246-gt',
    name: 'Ferrari Dino 246 GT',
    category: 'Classic',
    year: 1969,
    engine: '2.4L Naturally Aspirated V6',
    horsepower: 195,
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 450000,
    topSpeedNum: 235,
    zeroToHundredNum: 7.1,
    weightNum: 1080,
    productionNumbers: '3761 Units',
    description: 'A masterpiece of compact design. Curvaceous fender contours, mid-engine agility, and a distinctive round tail-light profile.',
    history: 'An evolution of the 206 GT with a steel body and higher-displacement V6, establishing Enzo\'s mid-engine concept on a massive scale.'
  },
  {
    id: '365-gtc-4',
    name: 'Ferrari 365 GTC/4',
    category: 'Classic',
    year: 1971,
    engine: '4.4L Colombo V12',
    horsepower: 340,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 350000,
    topSpeedNum: 260,
    zeroToHundredNum: 6.4,
    weightNum: 1450,
    productionNumbers: '505 Units',
    description: 'A comfortable, wedge-shaped 2+2 grand tourer featuring matte-black rear body panels and a low hood line.',
    history: 'A sibling of the Daytona but tuned for refined luxury, fitted with power steering and a quieter mechanical setup.'
  },
  {
    id: '365-gt4-bb',
    name: 'Ferrari 365 GT4 Berlinetta Boxer',
    category: 'Classic',
    year: 1973,
    engine: '4.4L Flat-12',
    horsepower: 380,
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 400000,
    topSpeedNum: 300,
    zeroToHundredNum: 5.4,
    weightNum: 1160,
    productionNumbers: '387 Units',
    description: 'Ferrari\'s first production mid-engine 12-cylinder model, styled in an avant-garde two-tone lower body color theme.',
    history: 'Created to take on the Lamborghini Miura and Countach. The "Boxer" flat-12 configuration lowered the car\'s center of gravity immensely.'
  },
  {
    id: 'dino-308-gt4',
    name: 'Ferrari Dino 308 GT4',
    category: 'Classic',
    year: 1973,
    engine: '3.0L V8',
    horsepower: 255,
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 100000,
    topSpeedNum: 250,
    zeroToHundredNum: 6.9,
    weightNum: 1150,
    productionNumbers: '2826 Units',
    description: 'Bertone-styled angular wedge 2+2 layout, introducing Ferrari\'s highly successful mid-engine V8 architecture.',
    history: 'Unique as the only production road-going Ferrari styled by Bertone instead of Pininfarina, causing quite a stir at launch.'
  },
  {
    id: '308-gtb',
    name: 'Ferrari 308 GTB',
    category: 'Sports Cars',
    year: 1975,
    engine: '3.0L Naturally Aspirated V8',
    horsepower: 255,
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 120000,
    topSpeedNum: 252,
    zeroToHundredNum: 6.5,
    weightNum: 1090,
    productionNumbers: '12000 Units (All 308/328)',
    description: 'The legendary Pininfarina mid-engine V8 silhouette. Features side scalloped vents and pop-up round-nose styling.',
    history: 'Succeeded the Dino range, establishing a generation of successful V8 mid-engine road cars. Earliest models were famous for Vetroresina (fiberglass) bodies.'
  },
  {
    id: '400',
    name: 'Ferrari 400',
    category: 'GT Cars',
    year: 1976,
    engine: '4.8L Colombo V12',
    horsepower: 340,
    images: [
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 150000,
    topSpeedNum: 250,
    zeroToHundredNum: 7.1,
    weightNum: 1700,
    productionNumbers: '502 Units',
    description: 'A straight-lined, three-box notchback layout, presenting a highly elegant 2+2 grand touring silhouette.',
    history: 'The first production Ferrari to offer an automatic transmission option, appealing to elite executives in American and European markets.'
  },
  {
    id: '512-bb',
    name: 'Ferrari 512 BB',
    category: 'Sports Cars',
    year: 1976,
    engine: '5.0L Flat-12',
    horsepower: 360,
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 350000,
    topSpeedNum: 302,
    zeroToHundredNum: 5.4,
    weightNum: 1400,
    productionNumbers: '929 Units',
    description: 'An evolution of the Boxer with a wider, low-slung stance and a raw mechanical flat-12 exhaust growl.',
    history: 'Renamed "512" to denote its 5-litre engine and 12 cylinders, continuing Ferrari\'s battle with Lamborghini on the performance charts.'
  },
  {
    id: 'mondial-8',
    name: 'Ferrari Mondial 8',
    category: 'Sports Cars',
    year: 1980,
    engine: '3.0L V8',
    horsepower: 214,
    images: [
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 65000,
    topSpeedNum: 230,
    zeroToHundredNum: 8.2,
    weightNum: 1440,
    productionNumbers: '703 Units',
    description: 'A highly functional mid-engine 2+2 sporting large horizontal side grille slats for V8 engine cooling.',
    history: 'A family-friendly Ferrari designed for usable daily driving, styled by Pininfarina and highly loved for its spacious cabin.'
  },
  {
    id: '288-gto',
    name: 'Ferrari 288 GTO',
    category: 'Supercars',
    year: 1984,
    engine: '2.9L Twin-Turbo V8',
    horsepower: 400,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 3500000,
    topSpeedNum: 305,
    zeroToHundredNum: 4.9,
    weightNum: 1160,
    productionNumbers: '272 Units',
    description: 'Aggressive wide-body racing styling with quad driving lights and a highly advanced twin-turbocharged V8 engine.',
    history: 'Designed to homologate Ferrari for Group B rallying, though the series was cancelled before it could race, leaving a pure street monster.'
  },
  {
    id: 'testarossa',
    name: 'Ferrari Testarossa',
    category: 'Sports Cars',
    year: 1984,
    engine: '4.9L Naturally Aspirated Flat-12',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 390,
    priceNum: 250000,
    topSpeedNum: 290,
    zeroToHundredNum: 5.2,
    weightNum: 1508,
    productionNumbers: '7,177 Units',
    description: 'An 1980s pop culture icon. Featuring radical cheese-grater side strakes and an ultra-wide flat-12 rear gridded profile.',
    history: 'Debuted at the Lido club in Paris, becoming a worldwide design sensation and a poster child for a generation of enthusiasts.'
  },
  {
    id: '328-gtb',
    name: 'Ferrari 328 GTB',
    category: 'Sports Cars',
    year: 1985,
    engine: '3.2L V8',
    horsepower: 270,
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 130000,
    topSpeedNum: 263,
    zeroToHundredNum: 5.5,
    weightNum: 1260,
    productionNumbers: '7412 Units',
    description: 'A highly refined evolution of the 308 profile, adding molded color-coded bumpers and improved cabin ventilation.',
    history: 'Highly praised as one of the most mechanically reliable classic V8 Ferraris, providing a direct connection to mechanical purity.'
  },
  {
    id: '412',
    name: 'Ferrari 412',
    category: 'GT Cars',
    year: 1985,
    engine: '4.9L V12',
    horsepower: 340,
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 140000,
    topSpeedNum: 250,
    zeroToHundredNum: 6.7,
    weightNum: 1800,
    productionNumbers: '576 Units',
    description: 'The final and most refined edition of the 400-series grand tourers, carrying a raised rear bumper stance.',
    history: 'Features early active ABS systems and an enlarged 4.9-litre Colombo-derived engine, popular with high-class executives.'
  },
  {
    id: 'f40',
    name: 'Ferrari F40',
    category: 'Supercars',
    year: 1987,
    engine: '2.9L Twin-Turbo V8',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 478,
    priceNum: 3200000,
    topSpeedNum: 324,
    zeroToHundredNum: 4.1,
    weightNum: 1100,
    productionNumbers: '1,311 Units',
    description: 'A carbon-kevlar street race car celebrating 40 years of Ferrari. Featuring a massive integrated rear wing.',
    history: 'The last car personally approved by Enzo Ferrari before his death. It broke the 200 mph barrier, becoming a timeless masterpiece.'
  },
  {
    id: '348-tb',
    name: 'Ferrari 348 tb',
    category: 'Sports Cars',
    year: 1989,
    engine: '3.4L V8',
    horsepower: 300,
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 90000,
    topSpeedNum: 275,
    zeroToHundredNum: 5.6,
    weightNum: 1370,
    productionNumbers: '8000 Units',
    description: 'Styled like a mini Testarossa with slatted side intakes and a sleek horizontal rear tail light grille.',
    history: 'Representing a massive leap with its longitudinal engine and transverse gearbox layout, paving the way for modern mid-engine dynamics.'
  },
  {
    id: '512-tr',
    name: 'Ferrari 512 TR',
    category: 'Sports Cars',
    year: 1991,
    engine: '4.9L Naturally Aspirated Flat-12',
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1627454819213-f7724a733732?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 428,
    priceNum: 220000,
    topSpeedNum: 314,
    zeroToHundredNum: 4.8,
    weightNum: 1473,
    productionNumbers: '2,261 Units',
    description: 'The updated Testarossa nose profile with lowered engine mountings for drastically improved chassis response.',
    history: 'A heavily re-engineered Testarossa that smoothed out 1980s edges, delivering an incredibly sharp and mature mechanical experience.'
  },
  {
    id: '456-gt',
    name: 'Ferrari 456 GT',
    category: 'GT Cars',
    year: 1992,
    engine: '5.5L V12',
    horsepower: 436,
    images: [
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 150000,
    topSpeedNum: 302,
    zeroToHundredNum: 5.2,
    weightNum: 1690,
    productionNumbers: '3289 Units',
    description: 'A smooth, curvaceous 2+2 grand tourer with retro pop-up headlights and a powerful front-mounted V12.',
    history: 'Brought front-engined V12s back to the forefront of Ferrari’s grand touring division, praised for its timeless executive styling.'
  },
  {
    id: 'f355',
    name: 'Ferrari F355 Berlinetta',
    category: 'Sports Cars',
    year: 1994,
    engine: '3.5L Naturally Aspirated V8',
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 375,
    priceNum: 130000,
    topSpeedNum: 295,
    zeroToHundredNum: 4.7,
    weightNum: 1350,
    productionNumbers: '11,273 Units',
    description: 'A high-revving 5-valve engine creating a high-pitched F1 scream, framed in a clean quad-circle tail.',
    history: 'Designed to vastly improve handling and design quality over the 348, introducing the world\'s first F1 electro-hydraulic paddle shift.'
  },
  {
    id: 'f512-m',
    name: 'Ferrari F512 M',
    category: 'Sports Cars',
    year: 1994,
    engine: '4.9L Flat-12',
    horsepower: 440,
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 380000,
    topSpeedNum: 315,
    zeroToHundredNum: 4.7,
    weightNum: 1455,
    productionNumbers: '501 Units',
    description: 'The final edition of the Testarossa lineage, swapping pop-up lights for fixed exposed headlamps and twin-circle tails.',
    history: 'A highly sought-after collectible representing the absolute end of Ferrari\'s legendary flat-12 production history.'
  },
  {
    id: 'f50',
    name: 'Ferrari F50',
    category: 'Supercars',
    year: 1995,
    engine: '4.7L Naturally Aspirated V12',
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 513,
    priceNum: 4500000,
    topSpeedNum: 325,
    zeroToHundredNum: 3.8,
    weightNum: 1230,
    productionNumbers: '349 Units',
    description: 'An F1 car for the road. Features a carbon chassis, a structural V12 engine block, and deep nose hood nostrils.',
    history: 'Built to celebrate Ferrari\'s 50th anniversary, transferring 1990 Formula 1 architecture directly into a road-going supercar.'
  },
  {
    id: '550-maranello',
    name: 'Ferrari 550 Maranello',
    category: 'GT Cars',
    year: 1996,
    engine: '5.5L Naturally Aspirated V12',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 478,
    priceNum: 250000,
    topSpeedNum: 320,
    zeroToHundredNum: 4.4,
    weightNum: 1690,
    productionNumbers: '3,083 Units',
    description: 'Ferrari\'s return to front-engined V12 performance, featuring an aggressive long hood and muscular rear haunches.',
    history: 'Replacing the mid-engined Testarossa family, the 550 proved that a front-engined grand tourer could dominate performance tracks.'
  },
  {
    id: '360-modena',
    name: 'Ferrari 360 Modena',
    category: 'Sports Cars',
    year: 1999,
    engine: '3.6L Naturally Aspirated V8',
    images: [
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 400,
    priceNum: 110000,
    topSpeedNum: 295,
    zeroToHundredNum: 4.5,
    weightNum: 1390,
    productionNumbers: '8,800 Units',
    description: 'An all-aluminum chassis and a glass rear window displaying the gorgeous intake manifolds of its central V8.',
    history: 'A design revolution that ditched sharp lines for curvaceous fluid shapes, vastly increasing aerodynamic downforce.'
  },
  {
    id: 'enzo',
    name: 'Ferrari Enzo',
    category: 'Hypercars',
    year: 2002,
    engine: '6.0L Naturally Aspirated V12',
    images: [
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 651,
    priceNum: 3500000,
    topSpeedNum: 350,
    zeroToHundredNum: 3.3,
    weightNum: 1255,
    productionNumbers: '400 Units',
    description: 'Named directly after the founder. F1 nose-cone styling, carbon fiber composite body, and active aerodynamic flaps.',
    history: 'Built using state-of-the-art Formula 1 systems like active aero, carbon-ceramic brakes, and sequential paddle shifters.'
  },
  {
    id: '575m-maranello',
    name: 'Ferrari 575M Maranello',
    category: 'GT Cars',
    year: 2002,
    engine: '5.7L V12',
    horsepower: 508,
    images: [
      'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 200000,
    topSpeedNum: 325,
    zeroToHundredNum: 4.2,
    weightNum: 1730,
    productionNumbers: '2056 Units',
    description: 'A revised, muscular grand tourer carrying a central hood scoop to feed its updated 5.7L Colombo V12 engine.',
    history: 'The "M" stands for "Modificata" (Modified), featuring adaptive suspension and the first implementation of an F1 gearbox in a V12 GT.',
  },
  {
    id: '612-scaglietti',
    name: 'Ferrari 612 Scaglietti',
    category: 'GT Cars',
    year: 2004,
    engine: '5.7L V12',
    horsepower: 533,
    images: [
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 250000,
    topSpeedNum: 320,
    zeroToHundredNum: 4.2,
    weightNum: 1850,
    productionNumbers: '3025 Units',
    description: 'An elegant 2+2 grand tourer with scallops running along the side, paying tribute to the classic 375 MM.',
    history: 'Designed to offer supreme interior passenger comfort and high speed touring, named in honor of coachbuilder Sergio Scaglietti.'
  },
  {
    id: 'f430',
    name: 'Ferrari F430',
    category: 'Sports Cars',
    year: 2004,
    engine: '4.3L Naturally Aspirated V8',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 483,
    priceNum: 180000,
    topSpeedNum: 315,
    zeroToHundredNum: 3.6,
    weightNum: 1450,
    productionNumbers: 'Regular Production',
    description: 'Twin front intake nostrils inspired by the 156 "Sharknose", active E-Diff differential, and steering-wheel Manettino.',
    history: 'Evolved from the 360, introducing an entirely new Flat-Plane Crank V8 engine family developed in partnership with Maserati.'
  },
  {
    id: '599-gtb',
    name: 'Ferrari 599 GTB Fiorano',
    category: 'GT Cars',
    year: 2006,
    engine: '6.0L Naturally Aspirated V12',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 612,
    priceNum: 300000,
    topSpeedNum: 330,
    zeroToHundredNum: 3.7,
    weightNum: 1690,
    productionNumbers: 'Regular Production',
    description: 'Aerodynamic flying buttress columns channeling airflow around the rear glass, and an absolute roaring Enzo V12 block.',
    history: 'Styled under Pininfarina, the 599 set new standards in GT car handling with magnetic ride dampers.'
  },
  {
    id: 'california',
    name: 'Ferrari California',
    category: 'Convertible/Spider',
    year: 2008,
    engine: '4.3L Naturally Aspirated V8',
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 453,
    priceNum: 190000,
    topSpeedNum: 310,
    zeroToHundredNum: 3.8,
    weightNum: 1625,
    productionNumbers: 'Regular Production',
    description: 'A retractable folding hardtop, vertical stacked exhaust tips, and Ferrari\'s first front-mid mounted V8 layout.',
    history: 'A highly successful conquest vehicle that introduced many firsts for Ferrari: direct fuel injection, 7-speed DCT, and multi-link rear suspension.'
  },
  {
    id: '458-italia',
    name: 'Ferrari 458 Italia',
    category: 'Sports Cars',
    year: 2009,
    engine: '4.5L Naturally Aspirated V8',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 562,
    priceNum: 240000,
    topSpeedNum: 325,
    zeroToHundredNum: 3.4,
    weightNum: 1380,
    productionNumbers: 'Regular Production',
    description: 'The final naturally aspirated V8 masterwork. Active front winglets, central triple exhausts, and a 9000 RPM redline.',
    history: 'Considered by many to be one of the greatest mid-engined sports cars ever manufactured, fusing mechanical art with absolute sensory feedback.'
  },
  {
    id: 'ff',
    name: 'Ferrari FF',
    category: 'GT Cars',
    year: 2011,
    engine: '6.3L Naturally Aspirated V12',
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 651,
    priceNum: 300000,
    topSpeedNum: 335,
    zeroToHundredNum: 3.7,
    weightNum: 1790,
    productionNumbers: '2,291 Units',
    description: 'A grand shooting-brake hatchback silhouette featuring Ferrari\'s patented lightweight 4RM active four-wheel drive system.',
    history: 'The "FF" stands for "Ferrari Four", representing four seats and four-wheel drive, breaking new utilitarian ground for daily driving.'
  },
  {
    id: 'f12berlinetta',
    name: 'Ferrari F12berlinetta',
    category: 'GT Cars',
    year: 2012,
    engine: '6.3L Naturally Aspirated V12',
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1627454819213-f7724a733732?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 730,
    priceNum: 320000,
    topSpeedNum: 340,
    zeroToHundredNum: 3.1,
    weightNum: 1525,
    productionNumbers: 'Regular Production',
    description: 'Fusing an aero-bridge hood design with a screaming front V12 and central rear F1-inspired foglights.',
    history: 'Voted "Supercar of the Year 2012" by Top Gear, continuing Ferrari\'s absolute dominance in high-output executive V12 road racers.'
  },
  {
    id: 'laferrari',
    name: 'LaFerrari',
    category: 'Hypercars',
    year: 2013,
    engine: '6.3L V12 Hybrid (KERS)',
    images: [
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 950,
    priceNum: 1420000,
    topSpeedNum: 350,
    zeroToHundredNum: 2.4,
    weightNum: 1255,
    productionNumbers: '499 Units',
    description: 'The first hybrid hypercar of Maranello. KERS battery system, low-slung nose profile, and massive active rear diffuser channels.',
    history: 'Representing the "The Ferrari" (LaFerrari) as the definitive synthesis of standard hybrid electric performance and raw racing V12 power.'
  },
  {
    id: '488-gtb',
    name: 'Ferrari 488 GTB',
    category: 'Sports Cars',
    year: 2015,
    engine: '3.9L Twin-Turbo V8',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 661,
    priceNum: 260000,
    topSpeedNum: 330,
    zeroToHundredNum: 3.0,
    weightNum: 1475,
    productionNumbers: 'Regular Production',
    description: 'Features scalloped twin air intake channels running on the side panel, and an advanced blown rear spoiler tail.',
    history: 'Reintroduced turbocharging back into the mid-engined V8 bloodline since the F40, winning multiple engine design awards.'
  },
  {
    id: 'gtc4lusso',
    name: 'Ferrari GTC4Lusso',
    category: 'GT Cars',
    year: 2016,
    engine: '6.3L Naturally Aspirated V12',
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 681,
    priceNum: 300000,
    topSpeedNum: 335,
    zeroToHundredNum: 3.4,
    weightNum: 1920,
    productionNumbers: 'Regular Production',
    description: 'A refined shooting-brake front grille and a quad circular tail light profile, featuring active four-wheel steering.',
    history: 'An evolution of the FF, adding rear-wheel steering and a highly updated dual-cockpit interior display.'
  },
  {
    id: '812-superfast',
    name: 'Ferrari 812 Superfast',
    category: 'GT Cars',
    year: 2017,
    engine: '6.5L Naturally Aspirated V12',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 789,
    priceNum: 340000,
    topSpeedNum: 340,
    zeroToHundredNum: 2.9,
    weightNum: 1525,
    productionNumbers: 'Regular Production',
    description: 'An aggressive front fascia housing a high-output V12 engine, with muscular flared rear arches and aero ducts.',
    history: 'Released as the successor to the F12, setting the record for the most powerful naturally aspirated production engine ever built.'
  },
  {
    id: 'portofino',
    name: 'Ferrari Portofino',
    category: 'Convertible/Spider',
    year: 2017,
    engine: '3.9L Twin-Turbo V8',
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 591,
    priceNum: 215000,
    topSpeedNum: 320,
    zeroToHundredNum: 3.5,
    weightNum: 1664,
    productionNumbers: 'Regular Production',
    description: 'A retractable folding hardtop presenting a clean grand touring fastback silhouette, replacing the California T.',
    history: 'Named after the gorgeous Italian port town, offering elegant everyday touring comfort with an award-winning twin-turbo V8.'
  },
  {
    id: 'monza-sp',
    name: 'Ferrari Monza SP1 / SP2',
    category: 'Icona Series',
    year: 2018,
    engine: '6.5L Naturally Aspirated V12',
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1627454819213-f7724a733732?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 799,
    priceNum: 1800000,
    topSpeedNum: 300,
    zeroToHundredNum: 2.9,
    weightNum: 1500,
    productionNumbers: '499 Units',
    description: 'A roofless, windshield-less modern speedster. Fuses classic Barchetta styling with a full-width LED rear strip.',
    history: 'Inaugurated Ferrari\'s "Icona" series, capturing the racing legacy of classic 1950s 750 Monza and 860 Monza sports racers.'
  },
  {
    id: 'f8-tributo',
    name: 'Ferrari F8 Tributo',
    category: 'Sports Cars',
    year: 2019,
    engine: '3.9L Twin-Turbo V8',
    images: [
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 710,
    priceNum: 280000,
    topSpeedNum: 340,
    zeroToHundredNum: 2.9,
    weightNum: 1435,
    productionNumbers: 'Regular Production',
    description: 'A deep front hood S-Duct intake and a classic louvered Lexan rear engine cover paying tribute to the legendary F40.',
    history: 'A grand celebration (tribute) to Ferrari\'s most powerful V8 engine layout, taking multiple lessons from the 488 Pista track car.'
  },
  {
    id: 'sf90-stradale',
    name: 'Ferrari SF90 Stradale',
    category: 'Supercars',
    year: 2019,
    engine: '4.0L Twin-Turbo V8 PHEV',
    images: [
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 986,
    priceNum: 510000,
    topSpeedNum: 340,
    zeroToHundredNum: 2.5,
    weightNum: 1570,
    productionNumbers: 'Regular Production',
    description: 'Fusing an ultra-compact Matrix LED front face with twin high-exit central exhausts and a 1000-hp plug-in hybrid V8 engine.',
    history: 'Named "SF90" to celebrate 90 years of the Scuderia Ferrari racing division, presenting a monumental leap in production PHEV technology.'
  },
  {
    id: 'roma',
    name: 'Ferrari Roma',
    category: 'GT Cars',
    year: 2019,
    engine: '3.9L Twin-Turbo V8',
    images: [
      'https://images.unsplash.com/photo-1542282088-72c9c27ed0cd?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 612,
    priceNum: 220000,
    topSpeedNum: 320,
    zeroToHundredNum: 3.4,
    weightNum: 1472,
    productionNumbers: 'Regular Production',
    description: 'A minimalist laser tail strip and a perforated front body-colored grille, representing "La Nuova Dolce Vita".',
    history: 'Inspired by Rome\'s mid-century carefree and elegant lifestyle, presenting a modern clean GT styling direction.'
  },
  {
    id: 'daytona-sp3',
    name: 'Ferrari Daytona SP3',
    category: 'Icona Series',
    year: 2021,
    engine: '6.5L Naturally Aspirated V12',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 829,
    priceNum: 2250000,
    topSpeedNum: 340,
    zeroToHundredNum: 2.85,
    weightNum: 1485,
    productionNumbers: '599 Units',
    description: 'An aggressive wraparound racing windshield and a striking rear horizontal blade slat design layout.',
    history: 'The third entry in the "Icona" lineage, celebrating Ferrari\'s historic triple photo-finish at the 1967 24 Hours of Daytona.'
  },
  {
    id: '296-gtb',
    name: 'Ferrari 296 GTB',
    category: 'Sports Cars',
    year: 2022,
    engine: '3.0L Twin-Turbo V6 Hybrid',
    images: [
      'https://images.unsplash.com/photo-1553440569-bcc63803a83d?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 819,
    priceNum: 320000,
    topSpeedNum: 330,
    zeroToHundredNum: 2.9,
    weightNum: 1470,
    productionNumbers: 'Regular Production',
    description: 'A clean visor-style cockpit front profile and a central monopin rear deck, introducing a twin-turbo hybrid V6.',
    history: 'The first proper road-going Ferrari-badged V6, fusing 120-degree turbo layout with plug-in hybrid battery power.'
  },
  {
    id: 'purosangue',
    name: 'Ferrari Purosangue',
    category: 'SUVs',
    year: 2022,
    engine: '6.5L Naturally Aspirated V12',
    images: [
      'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1627454819213-f7724a733732?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 715,
    priceNum: 400000,
    topSpeedNum: 310,
    zeroToHundredNum: 3.3,
    weightNum: 2033,
    productionNumbers: 'Regular Production (Limited Share)',
    description: 'A muscular high-riding four-door stance with rear suicide hinges, carrying an epic front-mounted V12.',
    history: 'Ferrari\'s first four-door, four-seater vehicle, designed to preserve Maranello sports performance under high utility.'
  },
  {
    id: '12cilindri',
    name: 'Ferrari 12Cilindri',
    category: 'GT Cars',
    year: 2024,
    engine: '6.5L Naturally Aspirated V12',
    horsepower: 830,
    images: [
      'https://images.unsplash.com/photo-1525609004556-c46c7d6cf0a3?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200'
    ],
    priceNum: 459000,
    topSpeedNum: 340,
    zeroToHundredNum: 2.9,
    weightNum: 1560,
    productionNumbers: 'Regular Production',
    description: 'A beautiful retro Daytona-inspired front dark mask band and active triangular aero rear flaps.',
    history: 'Succeeding the 812 Superfast in late 2024, paying ultimate homage to Gioacchino Colombo\'s naturally aspirated front-engine V12 lineage.'
  },
  {
    id: 'f80',
    name: 'Ferrari F80',
    category: 'Hypercars',
    year: 2025,
    engine: '3.0L V6 Twin-Turbo Hybrid',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200',
      'https://images.unsplash.com/photo-1617531653332-bd46c24f2068?auto=format&fit=crop&q=80&w=1200'
    ],
    horsepower: 1184,
    priceNum: 3900000,
    topSpeedNum: 350,
    zeroToHundredNum: 2.15,
    weightNum: 1525,
    productionNumbers: '799 Units',
    description: 'An advanced ground effect aero nose with active downforce, carrying an extreme Le Mans hybrid rear deck.',
    history: 'Released in late 2024 as the absolute peak of decade hypercar architecture, succeeding LaFerrari with high-output hybrid F1 racing power.'
  }
];

function buildModel(data: typeof rawFerrariData[0]): FerrariModel {
  const priceNum = data.priceNum || (
    data.category === 'Hypercars' ? 3000000 :
    data.category === 'Supercars' ? 1000000 :
    data.year < 1970 ? 2500000 :
    data.category === 'Icona Series' ? 2000000 :
    400000
  );
  
  const topSpeedNum = data.topSpeedNum || (
    data.horsepower > 1000 ? 350 :
    data.horsepower > 800 ? 340 :
    data.horsepower > 600 ? 325 :
    data.horsepower > 400 ? 300 :
    data.year < 1960 ? 220 : 250
  );

  const zeroToHundredNum = data.zeroToHundredNum || (
    data.horsepower > 1000 ? 2.3 :
    data.horsepower > 800 ? 2.9 :
    data.horsepower > 600 ? 3.4 :
    data.horsepower > 400 ? 4.1 : 5.8
  );

  const weightNum = data.weightNum || (
    data.year < 1960 ? 1100 :
    data.year < 1990 ? 1350 : 1550
  );

  const transmission = (
    data.year < 1990 ? '5-speed Gated Manual' :
    data.year < 2005 ? '6-speed Manual' : '7-speed Dual-Clutch'
  );

  const fuelType = (
    ['sf90-stradale', 'f80', 'laferrari', '296-gtb'].includes(data.id) ? 'Hybrid' : 'Petrol'
  );

  const driveType = (
    ['purosangue', 'sf90-stradale', 'f80', 'ff', 'gtc4lusso'].includes(data.id) ? 'AWD' : 'RWD'
  );

  const torqueNum = Math.round(data.horsepower * (data.year > 2000 ? 0.95 : 0.8));

  const desc = data.description || `The legendary ${data.name} is a pinnacle of Ferrari ${data.category} design. Featuring a powerful ${data.engine} engine producing ${data.horsepower} horsepower, it represents the absolute apex of automotive engineering from ${data.year}.`;
  
  const hist = data.history || `Introduced in ${data.year}, the ${data.name} is a cornerstone of Ferrari's rich history, combining race-bred technology with unparalleled styling.`;

  // Determine production status
  const inProduction = ['roma', '296-gtb', 'purosangue', '12cilindri'].includes(data.id);
  
  let availability: 'Available to Order' | 'Sold Out' | 'Discontinued' | 'Historical Archive' | 'Upcoming' = 'Discontinued';
  if (inProduction) {
    availability = 'Available to Order';
  } else if (data.id === 'f80') {
    availability = 'Upcoming';
  } else if (data.category === 'Classic' || data.year < 2010) {
    availability = 'Historical Archive';
  } else if (data.category === 'Formula 1') {
    availability = 'Historical Archive';
  } else if (['daytona-sp3', 'laferrari', 'sp1', 'sp2', 'enzo', 'f40', 'f50'].includes(data.id) || (data.productionNumbers && data.productionNumbers !== 'Regular Production' && !data.productionNumbers.includes('Regular'))) {
    availability = 'Sold Out';
  } else {
    availability = 'Discontinued';
  }

  return {
    ...data,
    price: `$${priceNum.toLocaleString()}`,
    priceNum,
    torque: `${torqueNum} Nm`,
    torqueNum,
    topSpeed: `${topSpeedNum} km/h`,
    topSpeedNum,
    zeroToHundred: `${zeroToHundredNum}s`,
    zeroToHundredNum,
    weight: `${weightNum} kg`,
    weightNum,
    transmission,
    fuelType,
    driveType,
    dimensions: `${Math.round(4200 + (data.year * 0.3))} mm L x 1900 mm W x 1200 mm H`,
    productionNumbers: data.productionNumbers || 'Limited Production Collection',
    description: desc,
    history: hist,
    inProduction,
    availability,
    interiorFeatures: [
      'Leather-trimmed sports racing seats',
      'Ergonomic driver-focused dashboard control setup',
      'Precision gated manual or paddle shifter transmission',
      'Classic instrument panel with custom telemetry integration',
      'Premium sound-insulated cabin cockpit'
    ],
    exteriorFeatures: [
      'Sculpted carbon-fiber panels or vintage aluminum curves',
      'Active or integrated high-downforce aerodynamic rear styling',
      'Signature Ferrari multi-vent front bumper with intake cooling',
      'Staggered lightweight alloy sport wheels',
      'Custom quad or center exhaust outlet ports'
    ],
    safetyFeatures: [
      'High-performance carbon-ceramic or multi-pot ventilated brakes',
      'Electronic Side Slip Control and F1-Traction Management',
      'Advanced tubular steel or carbon monocoque safety crash cage',
      'Multi-point active occupant safety seatbelt harness system',
      'Predictive dynamic electronic suspension damping control'
    ],
    soundFreq: Math.round(80 + (data.horsepower * 0.08)),
    idleFreq: Math.round(35 + (data.horsepower * 0.02)),
    exhaustFlame: ['Supercars', 'Hypercars', 'Track Cars'].includes(data.category)
  };
}

export const ferrariModels: FerrariModel[] = rawFerrariData.map(buildModel);
