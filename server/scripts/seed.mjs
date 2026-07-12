import 'dotenv/config'
import mysql2 from 'mysql2/promise'

const CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME

const tours = [
  {
    slug: 'paris-getaway',
    title: 'Paris Getaway',
    description: 'Experience the romance of Paris — the Eiffel Tower, the Seine riverbanks, and the narrow streets of Montmartre, all in one unforgettable trip.',
    destination: 'Paris, France',
    price: 450.00,
    duration_days: 7,
    max_guests: 4,
    start_date: '2026-08-01',
    end_date: '2026-08-08',
    category: 'city-break',
  },
  {
    slug: 'norway-getaway',
    title: 'Norway Fjords Adventure',
    description: 'Explore Norway\'s dramatic fjords, mountains, and villages — the perfect trip to get close to nature.',
    destination: 'Norway',
    price: 890.00,
    duration_days: 8,
    max_guests: 6,
    start_date: '2026-09-01',
    end_date: '2026-09-09',
    category: 'adventure',
  },
  {
    slug: 'africa-getaway',
    title: 'African Safari Experience',
    description: 'Discover the African wilderness — safari drives, wildlife encounters, and unforgettable landscapes.',
    destination: 'Africa',
    price: 1250.00,
    duration_days: 10,
    max_guests: 6,
    start_date: '2026-10-05',
    end_date: '2026-10-15',
    category: 'adventure',
  },
  {
    slug: 'armenia-getaway',
    title: 'Armenia Cultural Tour',
    description: 'Ancient monasteries, mountain scenery, and warm Caucasian hospitality await in Armenia.',
    destination: 'Armenia',
    price: 320.00,
    duration_days: 5,
    max_guests: 8,
    start_date: '2026-08-15',
    end_date: '2026-08-20',
    category: 'cultural',
  },
  {
    slug: 'brazil-getaway',
    title: 'Brazil Beach & Culture',
    description: 'Feel the energy of Brazil — vibrant beaches, carnival spirit, and lush tropical scenery.',
    destination: 'Brazil',
    price: 980.00,
    duration_days: 9,
    max_guests: 6,
    start_date: '2026-11-01',
    end_date: '2026-11-10',
    category: 'beach',
  },
  {
    slug: 'china-getaway',
    title: 'China Heritage Tour',
    description: 'Thousands of years of history — the Great Wall, ancient temples, and modern megacities.',
    destination: 'China',
    price: 1100.00,
    duration_days: 10,
    max_guests: 8,
    start_date: '2026-09-20',
    end_date: '2026-09-30',
    category: 'cultural',
  },
  {
    slug: 'cyprus-getaway',
    title: 'Cyprus Island Escape',
    description: 'Cyprus\'s crystal-blue coastline and laid-back Mediterranean charm.',
    destination: 'Cyprus',
    price: 400.00,
    duration_days: 6,
    max_guests: 4,
    start_date: '2026-07-20',
    end_date: '2026-07-26',
    category: 'beach',
  },
  {
    slug: 'georgian-getaway',
    title: 'Georgia Mountain Escape',
    description: 'Georgia\'s mountains, traditional cuisine, and ancient winemaking culture.',
    destination: 'Georgia',
    price: 280.00,
    duration_days: 5,
    max_guests: 8,
    start_date: '2026-08-10',
    end_date: '2026-08-15',
    category: 'mountain',
  },
  {
    slug: 'germany-getaway',
    title: 'Germany City & Castles',
    description: 'Medieval castles and orderly, historic cities across Germany.',
    destination: 'Germany',
    price: 560.00,
    duration_days: 7,
    max_guests: 6,
    start_date: '2026-09-05',
    end_date: '2026-09-12',
    category: 'city-break',
  },
  {
    slug: 'italy-getaway',
    title: 'Italy Classic Tour',
    description: 'Art, architecture, and world-famous cuisine across Italy.',
    destination: 'Italy',
    price: 720.00,
    duration_days: 8,
    max_guests: 6,
    start_date: '2026-08-25',
    end_date: '2026-09-02',
    category: 'cultural',
  },
  {
    slug: 'japan-getaway',
    title: 'Japan Discovery',
    description: 'The contrast of tradition and modernity in Japan — temples, technology, and cuisine.',
    destination: 'Japan',
    price: 1450.00,
    duration_days: 11,
    max_guests: 6,
    start_date: '2026-10-10',
    end_date: '2026-10-21',
    category: 'cultural',
  },
  {
    slug: 'korea-getaway',
    title: 'South Korea City Break',
    description: 'South Korea\'s vibrant cities, culture, and modern design.',
    destination: 'South Korea',
    price: 1050.00,
    duration_days: 9,
    max_guests: 6,
    start_date: '2026-11-15',
    end_date: '2026-11-24',
    category: 'city-break',
  },
  {
    slug: 'london-getaway',
    title: 'London City Escape',
    description: 'London\'s history, museums, and world-famous landmarks.',
    destination: 'London, UK',
    price: 620.00,
    duration_days: 6,
    max_guests: 4,
    start_date: '2026-08-18',
    end_date: '2026-08-24',
    category: 'city-break',
  },
  {
    slug: 'maldive-getaway',
    title: 'Maldives Luxury Escape',
    description: 'Crystal-clear ocean waters and luxury overwater bungalows in the Maldives.',
    destination: 'Maldives',
    price: 1890.00,
    duration_days: 7,
    max_guests: 2,
    start_date: '2026-12-01',
    end_date: '2026-12-08',
    category: 'beach',
  },
  {
    slug: 'portugal-getaway',
    title: 'Portugal Coastal Tour',
    description: 'Coastal towns, history, and Atlantic charm across Portugal.',
    destination: 'Portugal',
    price: 540.00,
    duration_days: 7,
    max_guests: 6,
    start_date: '2026-09-12',
    end_date: '2026-09-19',
    category: 'beach',
  },
  {
    slug: 'spain-getaway',
    title: 'Spain Sun & Culture',
    description: 'Spain\'s art, architecture, and love for life.',
    destination: 'Spain',
    price: 610.00,
    duration_days: 8,
    max_guests: 6,
    start_date: '2026-08-05',
    end_date: '2026-08-13',
    category: 'cultural',
  },
  {
    slug: 'switzerland-getaway',
    title: 'Switzerland Alpine Retreat',
    description: 'The Swiss Alps, lakes, and pristine landscapes — perfect for a mountain escape.',
    destination: 'Switzerland',
    price: 980.00,
    duration_days: 7,
    max_guests: 4,
    start_date: '2026-09-25',
    end_date: '2026-10-02',
    category: 'mountain',
  },
  {
    slug: 'turkey-getaway',
    title: 'Turkey Historical Journey',
    description: 'Turkey\'s history at the crossroads of East and West.',
    destination: 'Turkey',
    price: 480.00,
    duration_days: 7,
    max_guests: 6,
    start_date: '2026-08-22',
    end_date: '2026-08-29',
    category: 'cultural',
  },
  {
    slug: 'santorini-getaway',
    title: 'Santorini Island Romance',
    description: 'Santorini\'s whitewashed houses, blue domes, and breathtaking sunsets.',
    destination: 'Santorini, Greece',
    price: 850.00,
    duration_days: 6,
    max_guests: 2,
    start_date: '2026-08-14',
    end_date: '2026-08-20',
    category: 'beach',
  },
];

const imageOverrides = {
  'germany-getaway': (base) => [
    { url: `${base}/germany-destination1.jpg`, type: 'destination', isCover: true },
    { url: `${base}/germany-destination2.jpg`, type: 'destination', isCover: false },
    { url: `${base}/germany-hotel.jpg`, type: 'hotel', isCover: false },
  ],
};

function buildImages(slug) {
  const countryPart = slug.replace('-getaway', '');
  const base = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/travel-agency/tours/${slug}`;

  if (imageOverrides[slug]) {
    return imageOverrides[slug](base);
  }

  return [
    { url: `${base}/${countryPart}-destination1.jpg`, type: 'destination', isCover: true },
    { url: `${base}/${countryPart}-destination2.jpg`, type: 'destination', isCover: false },
    { url: `${base}/${countryPart}-destination3.jpg`, type: 'destination', isCover: false },
    { url: `${base}/${countryPart}-hotel.jpg`, type: 'hotel', isCover: false },
  ];
}

async function seed() {
  if (!CLOUD_NAME) {
    console.error('CLOUDINARY_CLOUD_NAME is not set in .env');
    process.exit(1);
  }

  const pool = await mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: {
      minVersion: 'TLSv1.2',
      rejectUnauthorized: true,
    },
  });

  console.log(`🚀 Seeding ${tours.length} tours...\n`);

  for (const tour of tours) {
    try {
      const [result] = await pool.query(
        `INSERT INTO tours 
          (title, slug, description, destination, price, duration_days, max_guests, start_date, end_date, category)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          tour.title,
          tour.slug,
          tour.description,
          tour.destination,
          tour.price,
          tour.duration_days,
          tour.max_guests,
          tour.start_date,
          tour.end_date,
          tour.category,
        ]
      );

      const tourId = result.insertId;
      const images = buildImages(tour.slug);

      for (const img of images) {
        const publicIdWithExt = img.url.split('/upload/')[1];
        const publicId = publicIdWithExt.split('.')[0];

        await pool.query(
          `INSERT INTO tour_images (tour_id, url, public_id, image_type, is_cover)
           VALUES (?, ?, ?, ?, ?)`,
          [tourId, img.url, publicId, img.type, img.isCover]
        );
      }

      console.log(`${tour.title} — added (${images.length} images)`);
    } catch (err) {
      console.error(`${tour.title} — error:`, err.message);
    }
  }

  await pool.end();
  console.log('\n🎉 Seed complete!');
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});