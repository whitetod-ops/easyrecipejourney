const { google } = require('googleapis');
const mammoth = require('mammoth');
const path = require('path');

const FOLDER_ID = '1b7BvqwjGY_1ty2LnGRbvxXxewa3grWl1';
const KEY_FILE = process.env.GOOGLE_KEY_FILE || 'service-account.json';

function getAuth() {
  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    return new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    });
  }
  return new google.auth.GoogleAuth({
    keyFile: path.resolve(KEY_FILE),
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
}
export function titleToSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export async function getAllRecipeFiles() {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });
  let files = [], pageToken = null;
  do {
    const res = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and trashed=false`,
      fields: 'nextPageToken, files(id, name)',
      pageSize: 200,
      pageToken: pageToken || undefined,
    });
    files = files.concat(res.data.files || []);
    pageToken = res.data.nextPageToken;
  } while (pageToken);
  return files.filter(f => f.name.endsWith('.docx') || f.name.endsWith('.DOCX'));
}

export async function getRecipeBySlug(slug) {
  const files = await getAllRecipeFiles();
  const file = files.find(f => titleToSlug(f.name.replace(/\.docx$/i, '')) === slug);
  if (!file) return null;
  return readRecipeFile(file);
}

async function readRecipeFile(file) {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });
  const res = await drive.files.get(
    { fileId: file.id, alt: 'media' },
    { responseType: 'arraybuffer' }
  );
  const buffer = Buffer.from(res.data);
  const { value: text } = await mammoth.extractRawText({ buffer });
  const metadata = parseMetadata(text);
  const title = file.name.replace(/\.docx$/i, '');
  return {
    id: file.id,
    slug: titleToSlug(title),
    title: metadata?.title || title,
    cuisine: metadata?.cuisine || 'World',
    course: metadata?.course || '',
    dietary_tags: metadata?.dietary_tags || [],
    prep_time: metadata?.prep_time || '',
    cook_time: metadata?.cook_time || '',
    total_time: metadata?.total_time || '',
    servings: metadata?.servings || '4',
    photo_url: metadata?.photo_url || null,
    ingredients: parseIngredients(text),
    instructions: parseInstructions(text),
  };
}

function parseMetadata(text) {
  try {
    const match = text.match(/---\s*METADATA[^{]*(\{[\s\S]*?\})\s*$/);
    if (!match) return null;
    return JSON.parse(match[1]);
  } catch { return null; }
}

function parseIngredients(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const start = lines.findIndex(l => /^ingredients?$/i.test(l));
  if (start === -1) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^(instructions?|directions?|method|notes?)/i.test(lines[i])) break;
    if (lines[i].length > 3) out.push(lines[i].replace(/^[-•]\s*/, ''));
  }
  return out;
}

function parseInstructions(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const start = lines.findIndex(l => /^instructions?$/i.test(l));
  if (start === -1) return [];
  const out = [];
  for (let i = start + 1; i < lines.length; i++) {
    if (/^(notes?|tips?|photo|metadata)/i.test(lines[i])) break;
    const clean = lines[i].replace(/^\d+[\.\)]\s+/, '').trim();
    if (clean.length > 20) out.push(clean);
  }
  return out;
}