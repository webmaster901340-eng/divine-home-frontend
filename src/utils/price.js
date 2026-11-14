// Prices are optional: 0 or missing means the dealer price is shared on request, not shown publicly.
export const hasPrice = (v) => Number(v) > 0;
export const priceLabel = (v) => (hasPrice(v) ? `₹${Number(v).toLocaleString('en-IN')}` : 'Price on request');
export const mrpLabel = (v) => (hasPrice(v) ? `₹${Number(v).toLocaleString('en-IN')}` : '');
