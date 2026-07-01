/**
 * Recipe Audit Script
 * Fetches all recipes from Google Drive and checks for inconsistencies/inaccuracies.
 * Run: node --env-file=.env.local scripts/recipe-audit.mjs
 * Output: docs/recipe-audit-2026-07-02.md
 */

import { google } from 'googleapis';
import mammoth from 'mammoth';
import { writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_DIR = join(__dirname, '../docs');
const OUTPUT_FILE = join(OUTPUT_DIR, 'recipe-audit-2026-07-02.md');
const BATCH_SIZE = 8; // concurrent Drive API calls per batch

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || '1b7BvqwjGY_1ty2LnGRbvxXxewa3grWl1';

const KNOWN_CUISINES = new Set([
  'american', 'british', 'caribbean', 'chinese', 'ethiopian', 'french', 'german',
  'greek', 'indian', 'italian', 'japanese', 'korean', 'lebanese', 'mexican',
  'middle eastern', 'moroccan', 'peruvian', 'portuguese', 'spanish', 'thai',
  'turkish', 'vietnamese', 'world', 'brazilian', 'indonesian', 'argentinian',
  'cuban', 'polish', 'filipino', 'israeli', 'irish', 'russian', 'swedish',
  'austrian', 'hungarian', 'romanian', 'georgian', 'persian', 'iranian',
  'pakistani', 'sri lankan', 'malaysian', 'singaporean', 'taiwanese', 'cambodian',
  'burmese', 'nepali', 'tibetan', 'afghan', 'uzbek', 'azerbaijani', 'armenian',
  'egyptian', 'tunisian', 'libyan', 'algerian', 'nigerian', 'ghanaian',
  'senegalese', 'south african', 'kenyan', 'ugandan', 'tanzanian',
  'haitian', 'jamaican', 'trinidadian', 'colombian', 'venezuelan',
  'chilean', 'bolivian', 'ecuadorian', 'paraguayan', 'uruguayan',
  'guatemalan', 'salvadoran', 'honduran', 'nicaraguan', 'costa rican', 'panamanian',
  'dominican', 'puerto rican', 'dutch', 'belgian', 'swiss', 'czech', 'slovak',
  'croatian', 'serbian', 'bulgarian', 'romanian', 'ukrainian',
]);

// Suspicious total_time patterns: too short for dish type, or too long
const QUICK_KEYWORDS = ['roast', 'braise', 'slow', 'stew', 'confit', 'brine', 'ferment', 'cure', 'marinate'];
const MIN_REASONABLE_STEPS = 2;
const MIN_REASONABLE_INGREDIENTS = 3;

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
    keyFile: join(__dirname, '../service-account.json'),
    scopes: ['https://www.googleapis.com/auth/drive.readonly'],
  });
}

async function getAllRecipeFiles() {
  const auth = getAuth();
  const drive = google.drive({ version: 'v3', auth });
  let files = [], pageToken = null;
  do {
    const res = await drive.files.list({
      q: `'${FOLDER_ID}' in parents and trashed=false`,
      fields: 'nextPageToken, files(id, name)',
      pageSize: 200,
      pageToken: pageToken ?? undefined,
    });
    files = files.concat(res.data.files || []);
    pageToken = res.data.nextPageToken;
  } while (pageToken);
  return files.filter(f => f.name.endsWith('.docx') || f.name.endsWith('.DOCX'));
}

function titleToSlug(title) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function parseMetadata(text) {
  try {
    const match = text.match(/---\s*METADATA[^{]*(\{[\s\S]*\})/);
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

async function fetchAndParse(file, auth) {
  try {
    const drive = google.drive({ version: 'v3', auth });
    const res = await drive.files.get(
      { fileId: file.id, alt: 'media' },
      { responseType: 'arraybuffer' }
    );
    const buffer = Buffer.from(res.data);
    const { value: text } = await mammoth.extractRawText({ buffer });
    const metadata = parseMetadata(text);
    const fileTitle = file.name.replace(/\.docx$/i, '');
    return {
      id: file.id,
      filename: file.name,
      slug: titleToSlug(fileTitle),
      title: metadata?.title || fileTitle,
      cuisine: metadata?.cuisine || 'World',
      course: metadata?.course || '',
      dietary_tags: metadata?.dietary_tags || [],
      prep_time: metadata?.prep_time || '',
      cook_time: metadata?.cook_time || '',
      total_time: metadata?.total_time || '',
      servings: metadata?.servings || '',
      photo_url: metadata?.photo_url || '',
      ingredients: parseIngredients(text),
      instructions: parseInstructions(text),
      hasMetadataBlock: !!text.match(/---\s*METADATA/),
      rawText: text.substring(0, 500),
    };
  } catch (err) {
    return { filename: file.name, error: err.message };
  }
}

async function batchProcess(files, auth) {
  const results = [];
  for (let i = 0; i < files.length; i += BATCH_SIZE) {
    const batch = files.slice(i, i + BATCH_SIZE);
    const batchResults = await Promise.all(batch.map(f => fetchAndParse(f, auth)));
    results.push(...batchResults);
    const pct = Math.round(((i + batch.length) / files.length) * 100);
    process.stdout.write(`\r  Fetched ${Math.min(i + BATCH_SIZE, files.length)}/${files.length} recipes (${pct}%)...`);
  }
  process.stdout.write('\n');
  return results;
}

function parseTotalMinutes(timeStr) {
  if (!timeStr) return null;
  const hours = (timeStr.match(/(\d+)\s*h/i) || [])[1];
  const mins = (timeStr.match(/(\d+)\s*m/i) || [])[1];
  if (!hours && !mins) {
    const num = parseInt(timeStr, 10);
    return isNaN(num) ? null : num;
  }
  return (parseInt(hours || 0, 10) * 60) + parseInt(mins || 0, 10);
}

function ingredientLooksLikeInstruction(line) {
  return /^(add|mix|stir|cook|heat|bake|fry|boil|combine|whisk|preheat|pour|place|remove|let|allow|serve)\b/i.test(line);
}

function instructionLooksLikeIngredient(line) {
  return /^\d+[\s\/]*(cup|tbsp|tsp|oz|lb|g|kg|ml|l)\b/i.test(line);
}

function hasSuspiciousTime(recipe) {
  const minutes = parseTotalMinutes(recipe.total_time);
  if (!minutes) return false;
  const titleLower = recipe.title.toLowerCase();
  const hasSlowKeyword = QUICK_KEYWORDS.some(k => titleLower.includes(k));
  if (hasSlowKeyword && minutes < 30) return true;
  if (minutes > 480) return true; // over 8 hours is notable
  if (minutes < 5 && recipe.ingredients.length > 5) return true;
  return false;
}

function auditRecipe(recipe) {
  const issues = [];

  if (recipe.error) {
    return [{ level: 'critical', code: 'FETCH_ERROR', msg: recipe.error }];
  }

  // Critical: structural failures
  if (!recipe.hasMetadataBlock) {
    issues.push({ level: 'critical', code: 'NO_METADATA', msg: 'No --- METADATA block found — recipe will show as cuisine "World" with missing fields' });
  }
  if (recipe.ingredients.length === 0) {
    issues.push({ level: 'critical', code: 'NO_INGREDIENTS', msg: 'No ingredients parsed — "Ingredients" section header may be missing or misspelled' });
  }
  if (recipe.instructions.length === 0) {
    issues.push({ level: 'critical', code: 'NO_INSTRUCTIONS', msg: 'No instructions parsed — "Instructions" section header may be missing or misspelled' });
  }

  // Warnings: quality issues
  if (!recipe.photo_url) {
    issues.push({ level: 'warning', code: 'NO_PHOTO', msg: 'No photo_url in metadata' });
  }
  if (recipe.hasMetadataBlock && recipe.cuisine === 'World') {
    issues.push({ level: 'warning', code: 'CUISINE_WORLD', msg: 'Cuisine is "World" — likely a metadata parsing failure or genuinely untagged' });
  }
  if (recipe.hasMetadataBlock && !KNOWN_CUISINES.has(recipe.cuisine.toLowerCase())) {
    issues.push({ level: 'warning', code: 'UNKNOWN_CUISINE', msg: `Cuisine "${recipe.cuisine}" is not in the known cuisine list — check for typo` });
  }
  if (recipe.ingredients.length > 0 && recipe.ingredients.length < MIN_REASONABLE_INGREDIENTS) {
    issues.push({ level: 'warning', code: 'FEW_INGREDIENTS', msg: `Only ${recipe.ingredients.length} ingredient(s) — may be a parsing issue` });
  }
  if (recipe.instructions.length > 0 && recipe.instructions.length < MIN_REASONABLE_STEPS) {
    issues.push({ level: 'warning', code: 'FEW_STEPS', msg: `Only ${recipe.instructions.length} instruction step(s) — may be truncated` });
  }
  if (!recipe.total_time) {
    issues.push({ level: 'warning', code: 'NO_TIME', msg: 'Missing total_time in metadata' });
  }
  if (!recipe.course) {
    issues.push({ level: 'warning', code: 'NO_COURSE', msg: 'Missing course (e.g. "Main", "Side", "Dessert") in metadata' });
  }
  if (hasSuspiciousTime(recipe)) {
    issues.push({ level: 'warning', code: 'SUSPICIOUS_TIME', msg: `total_time "${recipe.total_time}" looks suspicious for this recipe` });
  }

  // Info: cross-checks
  const ingredientsLookingLikeInstructions = recipe.ingredients.filter(ingredientLooksLikeInstruction);
  if (ingredientsLookingLikeInstructions.length > 0) {
    issues.push({ level: 'info', code: 'INGREDIENT_FORMAT', msg: `${ingredientsLookingLikeInstructions.length} ingredient line(s) look like instructions: "${ingredientsLookingLikeInstructions[0]}"` });
  }
  const instructionsLookingLikeIngredients = recipe.instructions.filter(instructionLooksLikeIngredient);
  if (instructionsLookingLikeIngredients.length > 0) {
    issues.push({ level: 'info', code: 'INSTRUCTION_FORMAT', msg: `${instructionsLookingLikeIngredients.length} instruction step(s) look like ingredient lines: "${instructionsLookingLikeIngredients[0]}"` });
  }
  if (recipe.title.length > 80) {
    issues.push({ level: 'info', code: 'LONG_TITLE', msg: `Title is ${recipe.title.length} chars — consider shortening: "${recipe.title.substring(0, 60)}..."` });
  }

  return issues;
}

function findDuplicates(recipes) {
  const seen = new Map();
  const dupes = [];
  for (const r of recipes) {
    if (r.error) continue;
    const key = r.slug;
    if (seen.has(key)) {
      dupes.push({ slug: key, files: [seen.get(key).filename, r.filename] });
    } else {
      seen.set(key, r);
    }
  }
  return dupes;
}

function generateReport(recipes, dupes) {
  const date = new Date().toISOString().split('T')[0];
  const total = recipes.filter(r => !r.error).length;
  const errors = recipes.filter(r => r.error);

  const withIssues = recipes
    .filter(r => !r.error)
    .map(r => ({ recipe: r, issues: auditRecipe(r) }))
    .filter(({ issues }) => issues.length > 0);

  const criticals = withIssues.filter(({ issues }) => issues.some(i => i.level === 'critical'));
  const warnings  = withIssues.filter(({ issues }) => issues.some(i => i.level === 'warning') && !issues.some(i => i.level === 'critical'));
  const infoOnly  = withIssues.filter(({ issues }) => issues.every(i => i.level === 'info'));

  // Tally by issue code
  const codeTally = {};
  withIssues.forEach(({ issues }) => {
    issues.forEach(issue => {
      codeTally[issue.code] = (codeTally[issue.code] || 0) + 1;
    });
  });

  // Cuisine distribution
  const cuisineCounts = {};
  recipes.filter(r => !r.error).forEach(r => {
    const c = r.cuisine || 'Unknown';
    cuisineCounts[c] = (cuisineCounts[c] || 0) + 1;
  });

  // No photo list
  const noPhoto = recipes.filter(r => !r.error && !r.photo_url);

  // No metadata block
  const noMetadata = recipes.filter(r => !r.error && !r.hasMetadataBlock);

  let md = `# Recipe Audit Report — ${date}
Generated by \`scripts/recipe-audit.mjs\`

## Summary

| Metric | Count |
|--------|-------|
| Total recipes fetched | ${recipes.length} |
| Fetch errors | ${errors.length} |
| Parsed successfully | ${total} |
| With any issue | ${withIssues.length} |
| Critical issues | ${criticals.length} |
| Warnings | ${warnings.length + criticals.length} |
| No metadata block | ${noMetadata.length} |
| No photo | ${noPhoto.length} |
| Duplicate slugs | ${dupes.length} |

## Issue breakdown

| Code | Count | Meaning |
|------|-------|---------|
`;

  const codeDescriptions = {
    FETCH_ERROR: 'Could not download or parse the .docx file',
    NO_METADATA: 'No --- METADATA block in document',
    NO_INGREDIENTS: 'No ingredients section found',
    NO_INSTRUCTIONS: 'No instructions section found',
    NO_PHOTO: 'Missing photo_url in metadata',
    CUISINE_WORLD: 'Cuisine defaults to "World" (untagged or parse failed)',
    UNKNOWN_CUISINE: 'Cuisine value not in known list',
    FEW_INGREDIENTS: 'Fewer than 3 ingredients parsed',
    FEW_STEPS: 'Fewer than 2 instruction steps parsed',
    NO_TIME: 'Missing total_time',
    NO_COURSE: 'Missing course field',
    SUSPICIOUS_TIME: 'total_time seems wrong for the dish',
    INGREDIENT_FORMAT: 'Ingredient lines that read like instructions',
    INSTRUCTION_FORMAT: 'Instruction lines that read like ingredient lists',
    LONG_TITLE: 'Title over 80 characters',
  };

  Object.entries(codeTally).sort((a, b) => b[1] - a[1]).forEach(([code, count]) => {
    md += `| \`${code}\` | ${count} | ${codeDescriptions[code] || ''} |\n`;
  });

  if (dupes.length > 0) {
    md += `\n## Duplicate slugs (${dupes.length})\n\nThese filenames produce identical URL slugs — one will shadow the other:\n\n`;
    dupes.forEach(d => {
      md += `- **\`${d.slug}\`**: \`${d.files[0]}\` vs \`${d.files[1]}\`\n`;
    });
  }

  if (criticals.length > 0) {
    md += `\n## Critical issues (${criticals.length})\n\nThese recipes will display incorrectly on the site.\n\n`;
    criticals.forEach(({ recipe, issues }) => {
      const critIssues = issues.filter(i => i.level === 'critical');
      md += `### ${recipe.title}\n`;
      md += `- **File:** \`${recipe.filename}\`\n`;
      md += `- **Cuisine:** ${recipe.cuisine} | **Course:** ${recipe.course || '—'}\n`;
      critIssues.forEach(i => md += `- 🔴 \`${i.code}\`: ${i.msg}\n`);
      const otherIssues = issues.filter(i => i.level !== 'critical');
      otherIssues.forEach(i => md += `- ${i.level === 'warning' ? '🟡' : '🔵'} \`${i.code}\`: ${i.msg}\n`);
      md += '\n';
    });
  }

  md += `\n## Warnings (${criticals.length + warnings.length} recipes)\n\n`;
  md += `Recipes that work but have quality issues.\n\n`;

  if (warnings.length > 0) {
    warnings.forEach(({ recipe, issues }) => {
      md += `### ${recipe.title}\n`;
      md += `- **File:** \`${recipe.filename}\` | **Cuisine:** ${recipe.cuisine}\n`;
      issues.forEach(i => {
        const icon = i.level === 'warning' ? '🟡' : '🔵';
        md += `- ${icon} \`${i.code}\`: ${i.msg}\n`;
      });
      md += '\n';
    });
  }

  if (noPhoto.length > 0) {
    md += `\n## Recipes without photos (${noPhoto.length})\n\n`;
    md += `These need a photo_url added to their METADATA block.\n`;
    md += `Suggested action: use the Unsplash API or an AI image generator to source food photos.\n`;
    md += `For AI generation, use this prompt style:\n`;
    md += `> "Professional food photography, overhead or 45-degree angle, natural window light, `;
    md += `warm earth tones, linen napkin, clean light background, [DISH NAME], appetizing, high resolution"\n\n`;

    // Group by cuisine
    const byCuisine = {};
    noPhoto.forEach(r => {
      const c = r.cuisine;
      if (!byCuisine[c]) byCuisine[c] = [];
      byCuisine[c].push(r);
    });

    Object.entries(byCuisine).sort((a, b) => a[0].localeCompare(b[0])).forEach(([cuisine, rs]) => {
      md += `\n### ${cuisine} (${rs.length})\n`;
      rs.forEach(r => {
        md += `- [ ] **${r.title}** — \`${r.filename}\` — Unsplash search: \`${r.title.toLowerCase().replace(/[^a-z0-9 ]/g, '')} food\`\n`;
      });
    });
  }

  md += `\n## Cuisine distribution\n\n`;
  md += `| Cuisine | Count |\n|---------|-------|\n`;
  Object.entries(cuisineCounts)
    .sort((a, b) => b[1] - a[1])
    .forEach(([c, n]) => md += `| ${c} | ${n} |\n`);

  if (errors.length > 0) {
    md += `\n## Fetch errors (${errors.length})\n\n`;
    errors.forEach(e => {
      md += `- \`${e.filename}\`: ${e.error}\n`;
    });
  }

  if (infoOnly.length > 0) {
    md += `\n## Info-only notes (${infoOnly.length})\n\n`;
    infoOnly.slice(0, 50).forEach(({ recipe, issues }) => {
      md += `- **${recipe.title}**: ${issues.map(i => i.msg).join('; ')}\n`;
    });
    if (infoOnly.length > 50) {
      md += `\n*(${infoOnly.length - 50} more omitted — run script for full output)*\n`;
    }
  }

  return md;
}

// ── Main ──────────────────────────────────────────────────────────────────────

console.log('Recipe Audit — Easy Recipe Journey');
console.log('====================================');
console.log('Connecting to Google Drive...');

const auth = getAuth();

console.log('Listing recipe files...');
const files = await getAllRecipeFiles();
console.log(`Found ${files.length} .docx files. Fetching and parsing (batch size: ${BATCH_SIZE})...`);

const startTime = Date.now();
const recipes = await batchProcess(files, auth);
const elapsed = Math.round((Date.now() - startTime) / 1000);

console.log(`Done in ${elapsed}s. Running audit checks...`);

const dupes = findDuplicates(recipes);
const report = generateReport(recipes, dupes);

mkdirSync(OUTPUT_DIR, { recursive: true });
writeFileSync(OUTPUT_FILE, report, 'utf8');

const total = recipes.filter(r => !r.error).length;
const noPhoto = recipes.filter(r => !r.error && !r.photo_url).length;
const critical = recipes.filter(r => !r.error).filter(r => auditRecipe(r).some(i => i.level === 'critical')).length;

console.log('');
console.log(`✅ Audit complete`);
console.log(`   ${total} recipes parsed`);
console.log(`   ${critical} with critical issues`);
console.log(`   ${noPhoto} without photos`);
console.log(`   ${dupes.length} duplicate slugs`);
console.log(`   Report: ${OUTPUT_FILE}`);
