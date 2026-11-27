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
  ['Who is Divine Home India?', 'Divine Home India is a quality-focused manufacturer, importer and wholesaler of premium decorative trays, luxury home decor and corporate gifts, based in Karol Bagh, New Delhi. We have supplied shops, distributors and gifting companies across India since 2015.'],
  ['Where is your showroom?', 'Our showroom is at 1st Floor, 15A/47, near Hotel Kyron, WEA, Karol Bagh, New Delhi 110005. It is open Monday to Saturday from 10:30 am to 8:00 pm, a short walk from Karol Bagh metro station.'],
  ['What do you make?', 'Our main product is printed decorative trays in rectangle, square, round, oval and capsule sets, with gold or copper finishes. We also supply mango wood trays, ceramic bowl and candy sets, mugs, leatherette organisers, kitchen accessories and corporate gift sets.'],
  ['Do you deliver outside Delhi?', 'Yes. We deliver across India by transport or courier. Freight depends on the city and carton weight.'],
  ['How do I get your price list?', 'Fill in the form on our Wholesale page or send your shop name and city on WhatsApp to +91 84594 95594. We send the catalogue with trade prices.'],
  ['Can I see samples before ordering?', 'Yes. Every design is on display at our Karol Bagh showroom, and you can compare finishes side by side before you order.'],
  ['Can you put our logo on trays or gift boxes?', 'Yes. We make custom-branded trays and gift packaging for corporate orders, hotels and brands. Allow 5 to 6 weeks for custom pieces.'],
  ['How early should we order corporate Diwali gifts?', 'Order 3 to 4 weeks ahead for standard gift sets and 5 to 6 weeks ahead for branded ones. For Diwali, late August to mid-September is the safest time.'],
  ['Are you a serving tray manufacturer or a wholesaler?', 'Both. We design our own tray prints in Delhi, have them made to our standard and sell them wholesale as complete collections to shops, distributors and corporate buyers across India.'],
  ['Do you import products?', 'Yes. Alongside our own designs and handcrafted Indian lines, we import premium ceramics, tableware, trays and gifting products from specialist factories in China. Every range is approved from a sample, shown in our Karol Bagh showroom and billed with GST.'],
  ['What makes your trays premium?', 'A sharp print to the edges, hammered metal rims and handles that sit flush, a flat base, an even finish, consistent colour from batch to batch and courier-safe packing. We design for accessible luxury, not the cheapest price.'],
  ['Do you supply trays in Gurgaon, Noida, Ghaziabad and Faridabad?', 'Yes. We supply dealers and corporate buyers across Delhi NCR and the rest of India. Buyers in NCR can also visit our Karol Bagh showroom to see every design.'],
];

// path -> page SEO. `body` is plain HTML shown to crawlers that do not run JavaScript; React replaces it on load.
export const PAGES = {
  '/': {
    title: 'Serving Tray Manufacturer & Wholesaler in Delhi NCR | Divine Home India',
    description: 'Premium serving tray manufacturer, importer and wholesaler in Karol Bagh, Delhi. Luxury tray sets, ceramics and corporate gifts for 250+ dealers across India.',
    body: `<h1>Premium serving tray manufacturer and wholesaler in Delhi, supplying all of India</h1>
<p>Divine Home India designs, imports and supplies premium printed serving trays, decorative tray sets, mango wood, ceramics and gift sets to shops, distributors and corporate buyers across India, from our showroom in Karol Bagh, New Delhi, since 2015.</p>
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
<p>Categories: decorative tray sets, mango wood trays, leatherette trays and organisers, ceramic snack and candy sets, and crockery. Series: Ellite (Elegant Vector, Lotus Glow, Peachy Bloom, Peacock Grace, Bless Heart, Ikket, Marble Flow, Elegance Elephant), Premium, Glass Foil, Mangowood and Leather Classic.</p>`,
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
  '/blog': {
    title: 'Tray Buying Guides for Retailers & Gifting | Divine Home India Blog',
    description: 'Guides for shops and corporate buyers: choosing a serving tray manufacturer in Delhi NCR, buying trays wholesale, the best tray designs, sizes and gifting.',
    body: `<h1>Guides for tray buyers, retailers and gifting teams</h1>
<p>Practical advice from Divine Home India, a serving tray manufacturer and wholesaler in Karol Bagh, New Delhi: how to choose a supplier, what sells, sizes, materials and festive buying.</p>`,
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
  areaServed: [
    { '@type': 'City', name: 'New Delhi' }, { '@type': 'City', name: 'Gurugram' }, { '@type': 'City', name: 'Noida' },
    { '@type': 'City', name: 'Ghaziabad' }, { '@type': 'City', name: 'Faridabad' }, { '@type': 'Country', name: 'India' },
  ],
  knowsAbout: ['premium serving trays', 'luxury home decor', 'decorative trays', 'tray sets', 'imported ceramics and tableware', 'home decor import from China', 'mango wood trays', 'glass foil trays', 'corporate gifting', 'custom branded trays', 'home decor wholesale'],
  slogan: 'Premium home decor, designed in Delhi, supplied across India',
  sameAs: ['https://www.instagram.com/divinehomeindia/'],
});

// ---- Blog ----
export const blogPostSchema = (post, path) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BlogPosting',
      headline: post.title,
      description: post.description,
      image: absUrl(post.cover),
      datePublished: post.date,
      dateModified: post.updated || post.date,
      author: { '@type': 'Organization', name: BUSINESS.name, url: `${SITE}/` },
      publisher: { '@type': 'Organization', name: BUSINESS.name, logo: { '@type': 'ImageObject', url: `${SITE}/logo-header.png` } },
      mainEntityOfPage: `${SITE}${path}`,
      keywords: (post.keywords || []).join(', '),
    },
    post.faq?.length ? {
      '@type': 'FAQPage',
      mainEntity: post.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    } : null,
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
        { '@type': 'ListItem', position: 3, name: post.title, item: `${SITE}${path}` },
      ],
    },
  ].filter(Boolean),
});

// ---- Product pages (used by ProductDetails at runtime and scripts/seo-pages.mjs at build) ----
const absUrl = (src = '') => (src.startsWith('http') ? src : `${SITE}${src.startsWith('/') ? '' : '/'}${src}`);
const clip = (text, max) => (text.length <= max ? text : `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`);

export const productHead = (p, path) => {
  const name = p.title.replace(/\s*\([^)]*\)\s*$/, ''); // drop "(Ellite Series 5001)" from the <title>
  const design = p.designNo && !name.includes(p.designNo) ? ` ${p.designNo}` : '';
  return {
    path,
    title: clip(`${name}${design} | Wholesale | Divine Home India`, 70),
    description: clip(`${name}${design}: wholesale ${p.category.toLowerCase()} for gift shops and corporate gifting. Trade price on request. Karol Bagh, Delhi; ships across India.`, 160),
    image: p.images?.[0] ? absUrl(p.images[0]) : undefined,
  };
};

export const productSchema = (p, path) => ({
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Product',
      name: p.title,
      sku: p.sku,
      mpn: p.designNo || p.sku,
      brand: { '@type': 'Brand', name: BUSINESS.name },
      category: p.category,
      description: p.description || p.title,
      image: (p.images || []).map(absUrl),
      url: `${SITE}${path}`,
      // Trade prices are shared on request, so no Offer/price is published.
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Catalogue', item: `${SITE}/collections` },
        { '@type': 'ListItem', position: 3, name: p.title, item: `${SITE}${path}` },
      ],
    },
  ],
});

export const faqSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
});
