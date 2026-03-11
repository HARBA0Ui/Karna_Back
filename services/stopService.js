import https from 'https';
import * as stopRepository from '../repositories/stopRepository.js';

const normalizeName = (value) => {
  if (!value) return '';
  const normalized = value
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, ' ')
    .trim();
  return normalized || value.toLowerCase().trim();
};

const coordsEqual = (a, b, eps = 1e-6) => {
  if (a === undefined || b === undefined) return false;
  return Math.abs(a - b) <= eps;
};

const geocodeOne = async (query) => {
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&countrycodes=tn&q=${encodeURIComponent(query)}`;
  return new Promise((resolve) => {
    const req = https.get(
      url,
      {
        headers: {
          'User-Agent': 'bus_community_app/1.0 (contact: support@bus-community.tn)',
          'Accept-Language': 'ar,fr,en',
        },
      },
      (res) => {
        let data = '';
        res.on('data', (chunk) => (data += chunk));
        res.on('end', () => {
          try {
            const json = JSON.parse(data);
            if (Array.isArray(json) && json.length > 0) {
              const item = json[0];
              const lat = parseFloat(item.lat);
              const long = parseFloat(item.lon);
              if (!Number.isNaN(lat) && !Number.isNaN(long)) {
                return resolve({ lat, long });
              }
            }
          } catch (_) {
            // ignore
          }
          resolve(null);
        });
      }
    );
    req.on('error', () => resolve(null));
    req.end();
  });
};

const geocodeStop = async (name, description = '') => {
  const base = `${name} ${description}`.trim();
  const hasArabic = /[\u0600-\u06FF]/.test(base);
  const queries = hasArabic
    ? [base, `${base} تونس`.trim(), `${base} Tunisia`.trim()]
    : [base, `${base} Tunisia`.trim(), `${base} تونس`.trim()];

  for (const query of queries) {
    if (!query) continue;
    const hit = await geocodeOne(query);
    if (hit) return hit;
  }

  return null;
};

export const getAllStops = async () => {
  return await stopRepository.findAllStops();
};

export const createStop = async ({ name, description, lat, long }) => {
  if (!name || typeof name !== 'string' || name.trim() === '') {
    throw new Error('Stop name is required');
  }

  let resolvedLat = lat;
  let resolvedLong = long;
  if (resolvedLat === undefined || resolvedLong === undefined) {
    const geo = await geocodeStop(name, description || '');
    if (geo) {
      resolvedLat = geo.lat;
      resolvedLong = geo.long;
    }
  }

  const normalizedNew = normalizeName(name);
  const existingStops = await stopRepository.findAllStops();

  const duplicateName = existingStops.some(
    (s) => normalizeName(s.name) === normalizedNew
  );
  if (duplicateName) {
    throw new Error('Stop already exists');
  }

  if (resolvedLat !== undefined && resolvedLong !== undefined) {
    const duplicateCoords = existingStops.some(
      (s) => coordsEqual(s.lat, resolvedLat) && coordsEqual(s.long, resolvedLong)
    );
    if (duplicateCoords) {
      throw new Error('Stop already exists');
    }
  }

  return await stopRepository.createStop({
    name: name.trim(),
    description: description?.trim() || '',
    lat: resolvedLat,
    long: resolvedLong,
  });
};
