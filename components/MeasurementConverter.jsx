'use client';
import { useState } from 'react';

const DENSITY = {
  'flour':          { cup: 120,  tbsp: 7.5,   tsp: 2.5  },
  'sugar':          { cup: 200,  tbsp: 12.5,  tsp: 4.2  },
  'brown sugar':    { cup: 220,  tbsp: 13.75, tsp: 4.6  },
  'powdered sugar': { cup: 120,  tbsp: 7.5,   tsp: 2.5  },
  'butter':         { cup: 227,  tbsp: 14.2,  tsp: 4.7  },
  'rice':           { cup: 185,  tbsp: 11.6,  tsp: 3.9  },
  'oats':           { cup: 90,   tbsp: 5.6,   tsp: 1.9  },
  'cocoa':          { cup: 85,   tbsp: 5.3,   tsp: 1.8  },
  'cornstarch':     { cup: 128,  tbsp: 8,     tsp: 2.7  },
  'breadcrumbs':    { cup: 108,  tbsp: 6.75,  tsp: 2.25 },
  'almond flour':   { cup: 96,   tbsp: 6,     tsp: 2    },
  'salt':           { cup: 273,  tbsp: 17,    tsp: 5.7  },
  'baking powder':  { cup: 230,  tbsp: 14.4,  tsp: 4.8  },
  'baking soda':    { cup: 230,  tbsp: 14.4,  tsp: 4.8  },
};

const VOL_TO_ML = {
  'cup': 240, 'cups': 240,
  'tbsp': 15, 'tablespoon': 15, 'tablespoons': 15,
  'tsp': 5,   'teaspoon': 5,   'teaspoons': 5,
  'fl oz': 30, 'fluid ounce': 30, 'fluid ounces': 30,
  'pint': 473, 'pints': 473,
  'quart': 946, 'quarts': 946,
  'gallon': 3785, 'gallons': 3785,
  'ml': 1, 'milliliter': 1, 'milliliters': 1,
  'l': 1000, 'liter': 1000, 'liters': 1000,
};

const WEIGHT_TO_G = {
  'oz': 28.35, 'ounce': 28.35, 'ounces': 28.35,
  'lb': 453.6, 'pound': 453.6, 'pounds': 453.6,
  'g': 1, 'gram': 1, 'grams': 1,
  'kg': 1000, 'kilogram': 1000, 'kilograms': 1000,
};

const FRACTIONS = {
  '¼': 0.25, '½': 0.5, '¾': 0.75,
  '⅓': 0.333, '⅔': 0.667,
  '⅛': 0.125, '⅜': 0.375, '⅝': 0.625, '⅞': 0.875,
};

function parseFraction(str) {
  str = str.trim();
  for (const [frac, val] of Object.entries(FRACTIONS)) {
    str = str.replace(frac, ' ' + val + ' ');
  }
  str = str.replace(/(\d+)\s+(\d+)\/(\d+)/, (_, w, n, d) =>
    String(parseFloat(w) + parseFloat(n) / parseFloat(d)));
  str = str.replace(/(\d+)\/(\d+)/, (_, n, d) =>
    String(parseFloat(n) / parseFloat(d)));
  return parseFloat(str) || null;
}

function getDensityKey(name) {
  const lower = name.toLowerCase();
  for (const key of Object.keys(DENSITY)) {
    if (lower.includes(key)) return key;
  }
  return null;
}

function formatNumber(n) {
  if (n === null || isNaN(n)) return null;
  if (Number.isInteger(n)) return String(n);
  const fracs = [[0.25,'¼'],[0.5,'½'],[0.75,'¾'],[0.333,'⅓'],[0.667,'⅔'],[0.125,'⅛']];
  const whole = Math.floor(n);
  const frac = n - whole;
  for (const [val, sym] of fracs) {
    if (Math.abs(frac - val) < 0.02) return (whole > 0 ? whole + ' ' : '') + sym;
  }
  return n < 10 ? n.toFixed(1).replace(/\.0$/, '') : String(Math.round(n));
}

function convertIngredient(text, name, toMetric) {
  const unitPattern = Object.keys({ ...VOL_TO_ML, ...WEIGHT_TO_G }).join('|');
  const regex = new RegExp(`([\\d\\s\\/¼½¾⅓⅔⅛⅜⅝⅞]+)\\s*(${unitPattern})\\.?\\b`, 'i');
  const match = text.match(regex);
  if (!match) return text;

  const unit = match[2].toLowerCase().replace(/\.$/, '');
  const amount = parseFraction(match[1]);
  if (!amount) return text;

  if (toMetric) {
    if (VOL_TO_ML[unit]) {
      const ml = amount * VOL_TO_ML[unit];
      const densityKey = getDensityKey(name || text);
      const normUnit = unit.replace(/s$/, '');
      if (densityKey && DENSITY[densityKey][normUnit]) {
        return text.replace(match[0], Math.round(amount * DENSITY[densityKey][normUnit]) + ' g');
      }
      if (ml >= 1000) return text.replace(match[0], formatNumber(ml / 1000) + ' L');
      return text.replace(match[0], Math.round(ml) + ' ml');
    }
    if (WEIGHT_TO_G[unit]) {
      const g = Math.round(amount * WEIGHT_TO_G[unit]);
      if (g >= 1000) return text.replace(match[0], formatNumber(g / 1000) + ' kg');
      return text.replace(match[0], g + ' g');
    }
  } else {
    if (unit === 'g' || unit === 'gram' || unit === 'grams') {
      const densityKey = getDensityKey(name || text);
      if (densityKey) {
        const cups = amount / DENSITY[densityKey]['cup'];
        return text.replace(match[0], formatNumber(cups) + ' cup' + (cups !== 1 ? 's' : ''));
      }
      const oz = amount / 28.35;
      if (oz < 1) return text;
      return text.replace(match[0], formatNumber(oz) + ' oz');
    }
    if (unit === 'kg' || unit === 'kilogram' || unit === 'kilograms') {
      return text.replace(match[0], formatNumber(amount * 2.205) + ' lb');
    }
    if (unit === 'ml' || unit === 'milliliter' || unit === 'milliliters') {
      const cups = amount / 240;
      if (cups >= 0.25) return text.replace(match[0], formatNumber(cups) + ' cup' + (cups !== 1 ? 's' : ''));
      const tbsp = amount / 15;
      if (tbsp >= 1) return text.replace(match[0], formatNumber(tbsp) + ' tbsp');
      return text.replace(match[0], formatNumber(amount / 5) + ' tsp');
    }
    if (unit === 'l' || unit === 'liter' || unit === 'liters') {
      return text.replace(match[0], formatNumber((amount * 1000) / 240) + ' cups');
    }
  }
  return text;
}

export default function MeasurementConverter({ ingredients = [] }) {
  const [isMetric, setIsMetric] = useState(false);

  const converted = ingredients.map(ing => {
    if (!ing || typeof ing !== 'string') return ing;
    return convertIngredient(ing, ing, isMetric);
  });

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, paddingBottom: 10, borderBottom: '2px solid #E8D5C0' }}>
        <h2 style={{ fontFamily: 'Fraunces, Georgia, serif', fontSize: 22,
          fontWeight: 600, color: '#2C2018', margin: 0 }}>
          Ingredients
        </h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif',
            fontSize: 12, color: '#9A8070' }}>Units</span>
          <div className="unit-toggle">
            <button className={'unit-btn ' + (!isMetric ? 'active' : 'inactive')}
              onClick={() => setIsMetric(false)}>US</button>
            <button className={'unit-btn ' + (isMetric ? 'active' : 'inactive')}
              onClick={() => setIsMetric(true)}>Metric</button>
          </div>
        </div>
      </div>

      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {converted.map((ing, i) => (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start',
            gap: 12, padding: '8px 0', borderBottom: '0.5px solid #F0EBE4' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%',
              background: '#8B5E3C', marginTop: 7, flexShrink: 0 }} />
            <span style={{ fontFamily: '"Plus Jakarta Sans", sans-serif',
              fontSize: 15, color: '#2C2018', lineHeight: 1.6 }}>{ing}</span>
          </li>
        ))}
      </ul>

      {isMetric && (
        <div style={{ marginTop: 12, padding: '8px 12px', background: '#F5EDE6',
          borderRadius: 8, border: '0.5px solid #E0D0C0' }}>
          <p style={{ fontFamily: '"Plus Jakarta Sans", sans-serif', fontSize: 12,
            color: '#9A8070', margin: 0 }}>
            Conversions are approximate and vary by ingredient density.
          </p>
        </div>
      )}
    </div>
  );
}
