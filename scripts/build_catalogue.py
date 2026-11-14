"""Build product data + images from the Divine Home 2026-27 catalogue PDF.

Usage: python scripts/build_catalogue.py <catalogue.pdf>
Writes public/images/catalogue/pNN.jpg (full pages), public/images/catalogue/covers/<slug>.jpg
and scripts/catalogue-products.json (payloads for POST /api/admin/products).
"""
import sys, os, json
import pymupdf

SITE = 'https://www.divinehomeindia.com'
HERE = os.path.dirname(os.path.abspath(__file__))
PUB = os.path.join(HERE, '..', 'public', 'images', 'catalogue')

FULL = ('full', (0.0, 0.07, 1.0, 0.94))     # full-bleed lifestyle photo
INSET = ('inset', (0.26, 0.07, 0.74, 0.52))  # boxed photo at top of page
TILE3 = ('tile', (0.085, 0.13, 0.315, 0.37))  # first tile on a 3-column grid
TILE4 = ('tile', (0.06, 0.18, 0.235, 0.37))   # first tile on a 4-column grid
LTILE = ('tile', (0.09, 0.26, 0.31, 0.50))    # first tile on leather 1100 pages

ELLITE = ('2-piece rectangle (18x12, 16x10 in), oval (18x12, 16x10 in), square (13x13, 11x11 in) and round (13x13, 11x11 in) '
          'tray sets, a round candy box (8x8 in), a 9.5x9.5 in square tray, a 7.5x7.5 in napkin weight tray, a 10x6 in tray, '
          'a round coaster set and a 3-divider holder (8x4 in)')
PREMIUM = ('2-piece rectangle tray sets (18x12, 16x10 in and 14x10, 12x8 in), a 2-piece square set (12x12, 10x10 in), '
           'a 9.5x9.5 in square tray, a 13x5 in tray, a 7.5x7.5 in napkin weight tray and a 2-divider holder (8x4x4 in)')
GF = ('a 3-piece rectangle tray set (16x10, 14x8, 12x6 in), an 18x12 in tray, 2-piece rectangle (14x10, 12x8 in) and square '
      '(12x12, 10x10 in) sets, a napkin weight tray (7.5x7.5 in), a cutlery and napkin holder (10x7.5 in), '
      'a 3-divider (8x4 in) and a coaster set (4x4 in)')
MANGO = ('a 2-piece rectangle tray set (16x11, 14x9 in), a 2-piece square set (13x13, 11x11 in), a 9.5x9.5 in square tray, '
         'a 13x5 in tray, a napkin weight tray (8x8 in), a 3-divider (8x4x4 in) and a coaster set (5x5 in), all with brass handles '
         'where shown')
LEATHER = ('a 2-piece rectangle tray set (18x12, 16x10 in) with metal handles, a 4-divider caddy (6x6x4 in), '
           'a napkin weight tray (7.5x7.5 in) and a 2-divider holder (6x4x4 in)')
LEATHER2 = ('a 2-piece rectangle tray set (16x10, 14x8 in), a napkin weight tray (7.5x7.5 in), a tissue box (10x5.5 in), '
            'a 4-divider caddy (6x6 in), a remote holder (8x4.5 in) and a pen holder (8x4.5 in)')
CROCKERY = ('a 15-piece tea set, a 12-piece cup and saucer set, an 18-piece soup bowl set, an 8-piece snack set, '
            'a 4-piece coffee mug set and a 2-tier cake stand')

P = []
def add(sku, title, category, series, design, design_no, cover, pages, desc, finish='', material='', badge='', best=False, new=False):
    P.append(dict(sku=sku, title=title, category=category, series=series, designName=design, designNo=design_no,
                  cover=cover, pages=pages, description=desc, finish=finish, material=material,
                  badge=badge, isBestseller=best, isNewArrival=new))

T, A, TD, CR, OH = 'Trays & Serving Platters', 'Artisan Trays & Platters', 'Tableware & Dining', 'Crockery', 'Organizers & Holders'

ell = [('5001', 'Elegant Vector', (17, FULL), [17, 3, 4, 18], 'geometric star line-work in gold on a white base', True),
       ('5002', 'Lotus Glow', (5, FULL), [5, 19, 6, 20], 'Mughal-style lotus florals in red and green', True),
       ('5003', 'Peachy Bloom', (7, FULL), [7, 21, 8, 22], 'peach and blush roses with copper detailing', False),
       ('5004', 'Peacock Grace', (9, FULL), [9, 23, 10, 24], 'a gold peacock on a white base with a grey scalloped border', True),
       ('5005', 'Bless Heart', (12, FULL), [12, 15, 13, 16], 'gold heart lattice on a cream base', False),
       ('5006', 'Ikket', (11, INSET), [11, 27], 'ikat diamond weave patterns in grey and white', False),
       ('5007', 'Marble Fow', (25, FULL), [25, 26], 'swirling white, grey and gold marble', False),
       ('5008', 'Elegance Elephant', (14, INSET), [14], 'a royal elephant and palace arch in soft greens', False)]
for no, name, cover, pages, look, best in ell:
    disp = 'Marble Flow' if name == 'Marble Fow' else name
    add(f'DHI-{no}', f'{disp} Tray Collection (Ellite Series {no})', T, 'Ellite Series', name, no, cover, pages,
        f'Our Ellite Series {disp} design (No. {no}) features {look}, edged with a hammered metal rim. '
        f'The collection includes {ELLITE}. Pieces vary slightly by design; ask us for the current list. '
        f'Sold as matching sets so shops can display one complete look.',
        finish='Rose gold or gold rim', badge='BESTSELLER' if best else 'EXCLUSIVE', best=best)

prem = [('3009', 'Blue Vector', 28), ('3008', 'Deco Vintage', 29), ('3007', 'Green & Gold', 30), ('3004', 'Gold Vector', 31),
        ('3001', 'Rani', 32), ('3011', 'Feather', 33), ('3017', 'Golden Grace', 34), ('3016', 'Flower Pot', 35),
        ('3015', 'Palm Tree', 36), ('3014', 'Royal Mess', 37), ('3012', 'Golden Lady', 38)]
for no, name, pg in prem:
    add(f'DHI-{no}', f'{name} Premium Tray Set (Design {no})', T, 'Premium Series', name, no, (pg, TILE3), [pg],
        f'Premium Series printed trays in the {name} design (No. {no}), with pearl-effect borders and cut-out handles. '
        f'Available as {PREMIUM}. A strong mid-range line for gift shops and home decor stores.', finish='Gloss print')

gf = [('4001', 'Vintage Map', 39, [39]), ('4002', 'Elephant Gray', 40, [40]), ('4004', 'Gold Mandala', 41, [41]),
      ('2405', 'Red Mandala', 42, [42]), ('2404', 'Royal Blue', 43, [43]), ('2403', '3D Flower', 44, [44, 46]),
      ('4005', 'Mughal Garden', 45, [45])]
for no, name, pg, pages in gf:
    add(f'DHI-{no}', f'{name} Glass Foil Tray Set (Design {no})', T, 'Glass Foil Series', name, no, (pg, TILE3), pages,
        f'Glass Foil (GF) trays in the {name} design (No. {no}), with a printed glass-effect base and a carved-look border. '
        f'The range covers {GF}.', finish='Glass foil')

mango = [('2603', 'Peacock', 61), ('2604', 'Egypt', 62), ('2602', 'Kalamkari', 63), ('2605', 'Elephant', 64),
         ('2601', 'Chain Pattern', 65), ('2606', 'Butterfly', 66)]
for no, name, pg in mango:
    add(f'DHI-{no}', f'{name} Mango Wood Tray Set (Design {no})', A, 'Mangowood Series', name, no, (pg, TILE3), [pg],
        f'Handcrafted mango wood trays with a printed {name} base (No. {no}). Natural grain means every piece is slightly '
        f'different. The range includes {MANGO}.', material='Mango wood', finish='Natural wood, brass handles')

leather = [('Black', 47, 'BESTSELLER'), ('Maroon', 48, ''), ('White', 49, ''), ('Peachy', 50, ''),
           ('Mandala Green', 54, ''), ('Mandala White', 55, '')]
for name, pg, badge in leather:
    add(f'DHI-LC-{name.upper().replace(" ", "")}', f'Leather Classic Tray & Organiser Set ({name})', OH, 'Leather Classic',
        f'Leather {name}', '', (pg, INSET), [pg],
        f'Leather Classic collection in {name.lower()}: stitched leatherette pieces with metal trims for homes, offices and '
        f'hotel rooms. Includes {LEATHER}. Wipe-clean and easy to keep looking new.', material='Leatherette',
        badge=badge or 'EXCLUSIVE', best=bool(badge))
for name, pg in [('Peacock', 51), ('Bea', 52), ('Butterfly', 53)]:
    add(f'DHI-LF-{name.upper()}', f'Leather + Foil Tray Set ({name})', OH, 'Leather Classic', f'Leather Foil {name}', '',
        (pg, INSET), [pg],
        f'Leatherette trays and organisers with a printed foil centre in the {name} design. Includes {LEATHER}.',
        material='Leatherette with foil print', new=True, badge='NEW ARRIVAL')
for no, name, pg in [('1110', 'Gray', 56), ('1111', 'Sage Green', 57), ('1112', 'Black', 58), ('1113', 'Classic Gray', 59), ('1109', 'Gray Tone', 60)]:
    add(f'DHI-{no}', f'Leather Desk & Tissue Organiser Set ({name}, Design {no})', OH, 'Leather Classic', f'Leather {name}', no,
        (pg, LTILE), [pg],
        f'Leatherette organisers in {name.lower()} (No. {no}) for desks, living rooms and hotel rooms. The range covers {LEATHER2}.',
        material='Leatherette')

add('DHI-ECO-3PC', 'Economic Rectangle 3-Piece Tray Set (Assorted Designs)', T, 'Economic Series', '', '', (67, TILE3), [67, 71],
    'Nesting 3-piece rectangle tray sets with cut-out handles in assorted printed designs, including elephant, floral, palace '
    'and peacock prints. A value line for fast-moving counters and return gifts.', badge='BESTSELLER', best=True)
add('DHI-ECO-2PC', 'Rectangle 2-Piece Tray Set (Assorted Designs)', T, 'Economic Series', '', '', (68, TILE3), [68],
    'Two nesting rectangle trays in assorted designs. Easy to stock in mixed designs for gift counters.')
add('DHI-ECO-NAPKIN', 'Napkin Weight Tray (Assorted Designs)', OH, 'Economic Series', '', '', (69, TILE4), [69, 72],
    'Square napkin trays with a weighted arm that keeps napkins in place, in assorted printed designs. A small add-on that lifts '
    'the bill value at the counter.')
add('DHI-ECO-3DIV', '3-Divider Cutlery Holder (Assorted Designs)', OH, 'Economic Series', '', '', (70, TILE3), [70],
    'Three-compartment holders for cutlery, napkins or stationery, in assorted printed designs.')

add('DHI-SNACK-BOWL', 'Ceramic Snack Bowl Set with Gold Stand (3 or 4 Bowls)', TD, 'Ceramic Snack Bowl Set Series', '', '',
    (73, TILE3), [73],
    'Ribbed ceramic bowls with glass lids on a gold metal stand, in sets of 3 or 4. Available in sage green, blush pink, white '
    'and butter yellow. Used for dry fruits, namkeen and sweets.', material='Ceramic, glass, metal', best=True, badge='BESTSELLER')
add('DHI-SNACK-REV', 'Revolving Snack Set, 10 Pieces', TD, 'Ceramic Snack Bowl Set Series', '', '', (74, FULL), [74, 75],
    'A 10-piece snack set: four lidded jars with spoons and a holder on a revolving gold tray. Designs: Bee Bliss, Bless Heart, '
    'Lion King, Black Floral and Green Tree. A premium Diwali and wedding gift.', new=True, badge='NEW ARRIVAL')
add('DHI-CANDY-SET', 'Ceramic Candy Set with Tray in Gift Box', TD, 'Ceramic Candy Set Series', '', '', (76, FULL), [76, 77],
    'A square printed tray with four lidded ceramic candy jars, packed in a satin-lined gift box. Designs: Bless Heart, Palm Tree, '
    'Lotus Glow, Elegant Vector, Peacock Grace and Peachy Bloom. Ready to gift for festivals and corporate occasions.',
    best=True, badge='BESTSELLER', material='Ceramic')

crock = [('9001', 'Elegant Vector', 78, [78, 79]), ('9002', 'Lotus Glow', 80, [80, 81]), ('9003', 'Peachy Bloom', 82, [82, 83]),
         ('9004', 'Peacock Grace', 84, [84, 85]), ('9005', 'Elegant Vector Gold', 86, [86, 87])]
for no, name, pg, pages in crock:
    add(f'DHI-{no}', f'{name} Crockery Collection (Design {no})', CR, 'Crockery', name, no, (pg, FULL), pages,
        f'Fine ceramic tableware in the {name} design (No. {no}), matching our trays. The collection includes {CROCKERY}.',
        material='Ceramic')


def first_tile(page):
    """Find the top-left white product tile on a grid page; return its photo area (fractions), skipping price + label."""
    W = 320
    z = W / page.rect.width
    pix = page.get_pixmap(matrix=pymupdf.Matrix(z, z), colorspace=pymupdf.csRGB, alpha=False)
    w, h, s = pix.width, pix.height, pix.samples
    white = bytearray(w * h)
    for i in range(w * h):
        r, g, b = s[3 * i], s[3 * i + 1], s[3 * i + 2]
        white[i] = 1 if r > 238 and g > 238 and b > 238 else 0
    seen = bytearray(w * h)
    best = None
    for start in range(w * h):
        if not white[start] or seen[start]:
            continue
        stack, seen[start] = [start], 1
        x0 = y0 = 10 ** 9; x1 = y1 = -1; n = 0
        while stack:
            i = stack.pop(); n += 1
            x, y = i % w, i // w
            x0, x1, y0, y1 = min(x0, x), max(x1, x), min(y0, y), max(y1, y)
            for j in (i - 1 if x else -1, i + 1 if x < w - 1 else -1, i - w, i + w):
                if 0 <= j < w * h and white[j] and not seen[j]:
                    seen[j] = 1; stack.append(j)
        bw, bh = x1 - x0, y1 - y0
        if n > 0.012 * w * h and 0.12 * w < bw < 0.45 * w and 0.12 * h < bh < 0.5 * h:
            key = (round(y0 / (0.08 * h)), x0)
            if best is None or key < best[0]:
                best = (key, (x0, y0, x1, y1))
    if not best:
        return None
    x0, y0, x1, y1 = best[1]
    bh = y1 - y0
    return (x0 / w + 0.005, (y0 + 0.13 * bh) / h, x1 / w - 0.005, (y0 + 0.80 * bh) / h)


def detail(page, box):
    """Grayscale standard deviation of a crop: higher means more product, less empty background."""
    r = page.rect
    clip = pymupdf.Rect(r.width * box[0], r.height * box[1], r.width * box[2], r.height * box[3])
    pix = page.get_pixmap(matrix=pymupdf.Matrix(0.5, 0.5), clip=clip, colorspace=pymupdf.csGRAY, alpha=False)
    s = pix.samples
    if not s:
        return 0
    m = sum(s) / len(s)
    return (sum((v - m) ** 2 for v in s) / len(s)) ** 0.5


def render(src):
    os.makedirs(os.path.join(PUB, 'covers'), exist_ok=True)
    d = pymupdf.open(src)
    used = sorted({p for it in P for p in it['pages']} | {it['cover'][0] for it in P})
    for n in used:
        page = d[n - 1]
        z = 1400 / page.rect.width
        page.get_pixmap(matrix=pymupdf.Matrix(z, z)).save(os.path.join(PUB, f'p{n:02d}.jpg'), jpg_quality=80)
    for it in P:
        n, (mode, (x0, y0, x1, y1)) = it['cover']
        page = d[n - 1]
        if mode == 'tile' and it['sku'] not in ('DHI-SNACK-BOWL', 'DHI-3001', 'DHI-3004', 'DHI-3011', 'DHI-4004'):
            # try several crops, keep the one with the most visual detail (empty background scores low)
            cands = [(x0, y0, x1, y1), (x0, y0 + 0.17, x1, y1 + 0.17), (0.085, 0.24, 0.315, 0.48), (0.09, 0.26, 0.31, 0.50)]
            found = first_tile(page)
            if found:
                cands.insert(0, found)
            x0, y0, x1, y1 = max(cands, key=lambda c: detail(page, c))
        r = page.rect
        clip = pymupdf.Rect(r.width * x0, r.height * y0, r.width * x1, r.height * y1)
        z = 1000 / clip.width
        it['_cover'] = f'covers/{it["sku"].lower()}.jpg'
        page.get_pixmap(matrix=pymupdf.Matrix(z, z), clip=clip).save(os.path.join(PUB, it['_cover']), jpg_quality=82)
    print('rendered', len(used), 'pages and', len(P), 'covers')


def payloads():
    out = []
    for it in P:
        out.append(dict(
            title=it['title'], sku=it['sku'], category=it['category'], series=it['series'],
            designName=it['designName'], designNo=it['designNo'], wholesalePrice=0, mrp=0, moq='On request',
            rating=0, reviewsCount=0, description=it['description'],
            images=[f'{SITE}/images/catalogue/{it["_cover"]}'] + [f'{SITE}/images/catalogue/p{n:02d}.jpg' for n in it['pages']],
            badge=it['badge'] or ('NEW ARRIVAL' if it['isNewArrival'] else 'EXCLUSIVE'),
            specs=dict(material=it['material'], finish=it['finish'], dimensions='See catalogue page', weight='',
                       packaging='Retail or gift box', moqUnit='On request'),
            isBestseller=it['isBestseller'], isNewArrival=it['isNewArrival']))
    return out


if __name__ == '__main__':
    render(sys.argv[1])
    data = payloads()
    json.dump(data, open(os.path.join(HERE, 'catalogue-products.json'), 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
    print(len(data), 'products written')
