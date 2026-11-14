// Single source of SEO data: used by <Seo /> in the app and by scripts/seo-pages.mjs at build time.
export const SITE = 'https://www.divinehomeindia.com';

export const BUSINESS = {
  name: 'Divine Home India',
  phoneDisplay: '+91 84594 95594',
  phoneIntl: '+91-84594-95594',
  email: 'wholesale@divinehomeindia.com',
  street: '1st Floor, 15A/47, near Hotel Kyron, Block 15A, WEA, Karol Bagh',
  city: 'New Delhi',
  region: 'Delhi',
  postcode: '110005',
  hours: 'Monday to Saturday, 10:30 am to 8:00 pm',
};

export const FAQ = [
  ['Who is Divine Home India?', 'Divine Home India is a wholesaler and manufacturer of decorative trays, home decor and corporate gifts, based in Karol Bagh, New Delhi. We have supplied shops, distributors and gifting companies across India since 2015.'],
  ['Where is your showroom?', 'Our showroom is at 1st Floor, 15A/47, near Hotel Kyron, WEA, Karol Bagh, New Delhi 110005. It is open Monday to Saturday from 10:30 am to 8:00 pm, a short walk from Karol Bagh metro station.'],
  ['What do you make?', 'Our main product is printed decorative trays in rectangle, square, round, oval and capsule sets, with gold or copper finishes. We also supply mango wood trays, ceramic bowl and candy sets, mugs, leatherette organisers, kitchen accessories and corporate gift sets.'],
  ['Do you deliver outside Delhi?', 'Yes. We deliver across India by transport or courier. Freight depends on the city and carton weight.'],
  ['How do I get your price list?', 'Fill in the form on our Wholesale page or send your shop name and city on WhatsApp to +91 84594 95594. We send the catalogue with trade prices.'],
  ['Can I see samples before ordering?', 'Yes. Every design is on display at our Karol Bagh showroom, and you can compare finishes side by side before you order.'],
  ['Can you put our logo on trays or gift boxes?', 'Yes. We make custom-branded trays and gift packaging for corporate orders, hotels and brands. Allow 5 to 6 weeks for custom pieces.'],
  ['How early should we order corporate Diwali gifts?', 'Order 3 to 4 weeks ahead for standard gift sets and 5 to 6 weeks ahead for branded ones. For Diwali, late August to mid-September is the safest time.'],
];

// path -> page SEO. `body` is plain HTML shown to crawlers that do not run JavaScript; React replaces it on load.
export const PAGES = {
  '/': {
    title: 'Decorative Trays & Home Decor Wholesaler in Delhi | Divine Home India',
    description: 'Wholesale decorative trays, mango wood, ceramics and corporate gifts from Karol Bagh, New Delhi. Supplying dealers and distributors across India since 2015.',
    body: `<h1>Decorative trays and home decor, wholesale from Karol Bagh</h1>
<p>Divine Home India designs and supplies printed trays, mango wood, ceramics and gift sets to shops, distributors and corporate buyers across India, from our showroom in Karol Bagh, New Delhi, since 2015.</p>
<h2>What dealers buy from us</h2>
<ul><li>Decorative printed trays in gold and copper, plain or hammered: rectangle, square, round, oval and capsule sets</li>
<li>Mango wood trays, handcrafted with natural grain</li><li>Serving and dry-fruit sets for the festive season</li>
<li>Leatherette desk and vanity organisers</li><li>Ceramic bowl sets, candy sets, mugs and crockery</li>
<li>Corporate gift sets with your logo on the box or the tray</li></ul>
<h2>Why shop owners reorder from us</h2>
<p>We develop our own prints, so your shelf doesn't look like every other gift shop. Each design comes as a full set of trays, coasters and candy boxes, and you can mix designs in one order to test what sells in your area.</p>`,
  },
  '/collections': {
    title: 'Wholesale Catalogue 2026-27: Trays, Ceramics & Decor | Divine Home India',
    description: 'Browse the Divine Home India wholesale catalogue: printed tray sets, mango wood, ceramic bowl and candy sets, organisers and crockery. Delhi, pan-India supply.',
    body: `<h1>Wholesale catalogue 2026-27</h1>
<p>Every design in our current range, for shops, distributors, hotels and gifting companies. Filter by category or series, then send us the product names you want and we will reply with trade prices and stock.</p>
<p>Categories: trays and serving platters, tableware and dining, crockery, organisers and holders. Series include Elegant Vector, Lotus Glow, Peachy Bloom, Peacock Grace, Ikkat, Marble Flow, Mangowood and Leather Classic.</p>`,
  },
  '/wholesale': {
    title: 'Wholesale Price List & Dealership | Home Decor Supplier Delhi | Divine Home India',
    description: 'Become a Divine Home India dealer. Get our trade price list for decorative trays, ceramics and gift sets. Showroom in Karol Bagh, delivery across India.',
    faq: true,
    body: `<h1>Get our wholesale price list</h1>
<p>Tell us about your business and we will send the 2026-27 catalogue with trade prices. Prefer to talk? WhatsApp us on +91 84594 95594 or visit the Karol Bagh showroom.</p>
<h2>Why dealers work with us</h2>
<ul><li>Designs made in-house, so your shelf won't look like the shop next door</li>
<li>Mix designs in one order and test what sells before buying deep</li>
<li>Matching sets of trays, coasters and candy boxes raise the bill value per customer</li></ul>
<h2>Corporate gifting and festive hampers</h2>
<p>A box of sweets is gone in a week. A tray set stays on a client's table for years. We put together corporate gift sets from our own range, with your logo on the gift box, a sleeve or a printed card.</p>`,
  },
  '/about': {
    title: 'About Divine Home India | Home Decor Wholesaler, Karol Bagh, Delhi',
    description: 'Divine Home India has designed and supplied decorative trays and home decor from Karol Bagh, New Delhi since 2015. Showroom open to dealers and buyers.',
    body: `<h1>About Divine Home India</h1>
<p>Divine Home India started in 2015 in Karol Bagh, New Delhi, supplying home and kitchen products to local shops. Trays became the product our dealers asked for most, so we began developing our own designs instead of reselling what everyone else had.</p>
<p>Today we supply gift shops, home decor stores, hotels, cafes and corporate gifting companies across India with printed trays, handcrafted mango wood, ceramics, leatherette organisers and kitchen accessories.</p>`,
  },
  '/contact': {
    title: 'Contact Divine Home India | Wholesale Showroom, Karol Bagh, New Delhi',
    description: 'Visit or call Divine Home India at 1st Floor, 15A/47, WEA, Karol Bagh, New Delhi. Open Mon to Sat, 10:30 am to 8 pm. Wholesale and corporate enquiries.',
    body: `<h1>Contact Divine Home India</h1>
<p>Showroom: 1st Floor, 15A/47, near Hotel Kyron, Block 15A, WEA, Karol Bagh, New Delhi 110005.</p>
<p>Phone and WhatsApp: +91 84594 95594. Email: wholesale@divinehomeindia.com.</p>
<p>Hours: Monday to Saturday, 10:30 am to 8:00 pm.</p>`,
  },
};

export const businessSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WholesaleStore',
  name: BUSINESS.name,
  url: `${SITE}/`,
  logo: `${SITE}/logo-header.png`,
  image: `${SITE}/logo-header.png`,
  description: 'Wholesaler and manufacturer of decorative trays, home decor and corporate gifts in Karol Bagh, New Delhi, supplying businesses across India since 2015.',
  foundingDate: '2015',
  telephone: BUSINESS.phoneIntl,
  email: BUSINESS.email,
  address: {
    '@type': 'PostalAddress',
    streetAddress: BUSINESS.street,
    addressLocality: BUSINESS.city,
    addressRegion: BUSINESS.region,
    postalCode: BUSINESS.postcode,
    addressCountry: 'IN',
  },
  openingHoursSpecification: [{
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    opens: '10:30',
    closes: '20:00',
  }],
  areaServed: 'IN',
  sameAs: ['https://www.instagram.com/divinehomeindia/'],
});

export const faqSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});
