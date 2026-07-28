#!/usr/bin/env node
/**
 * Scrapes weapon data from endfieldtools.dev's public JSON endpoints (the same
 * ones the site's own frontend fetches at runtime) and regenerates
 * public/data/weapons.en.json and public/data/weapons.es.json in the exact
 * schema already used by this project (see lib/types.ts + lib/weapons-utils.ts).
 *
 * Usage:
 *   node scripts/scrape-weapons.mjs [--skip-images] [--dry-run]
 */

import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs/promises";
import sharp from "sharp";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const DATA_DIR = path.join(ROOT, "public", "data");
const IMAGES_DIR = path.join(ROOT, "public", "weapons");

const BASE = "https://endfieldtools.dev";
// The site has no dedicated "ES" locale - Latin American Spanish ships under
// the "MX" language code, and that is what this project's "es" files use.
const LANGS = { en: "EN", es: "MX" };

const WEAPON_TYPE_LABELS = {
  1: "Sword",
  2: "Funnel",
  3: "Claymore",
  5: "Lance",
  6: "Pistol",
};

const args = new Set(process.argv.slice(2));
const SKIP_IMAGES = args.has("--skip-images");
const DRY_RUN = args.has("--dry-run");

async function fetchJson(pathname) {
  const url = `${BASE}${pathname}`;
  const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
  if (!res.ok) throw new Error(`GET ${url} -> HTTP ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Description template rendering ({key:0.0%} style placeholders + <@tag>..</> markup)
// ---------------------------------------------------------------------------

function evalExpr(expr, blackboard) {
  const trimmed = expr.trim();
  const substituted = trimmed.replace(/[A-Za-z_][A-Za-z0-9_]*/g, (id) => {
    if (!blackboard.has(id)) throw new Error(`unknown blackboard key "${id}"`);
    return `(${blackboard.get(id)})`;
  });
  // eslint-disable-next-line no-new-func
  return Function(`"use strict"; return (${substituted});`)();
}

function formatValue(value, fmtSpec) {
  if (!fmtSpec) {
    return value > 0 && value < 1 ? value.toFixed(2) : String(Math.round(value));
  }
  const spec = fmtSpec.slice(1); // drop leading ":"
  if (spec.endsWith("%")) {
    const decimalsMatch = spec.match(/^0\.(0+)%$/);
    const decimals = decimalsMatch ? decimalsMatch[1].length : 0;
    return `${(value * 100).toFixed(decimals)}%`;
  }
  const decimals = spec.includes(".") ? spec.split(".")[1].length : 0;
  return value.toFixed(decimals);
}

function renderDescription(template, blackboardEntries) {
  if (!template) return "";
  const blackboard = new Map((blackboardEntries || []).map((b) => [b.key, Number(b.value)]));

  let text = template.replace(/\{([^{}]+?)(:[^{}]+)?\}/g, (match, expr, fmtSpec) => {
    try {
      return formatValue(evalExpr(expr, blackboard), fmtSpec);
    } catch {
      return match;
    }
  });

  text = text.replace(/<[^>]*>/g, ""); // strip <@ba.vup>, </>, <#ba.consume>, etc.
  text = text.replace(/\n+/g, ""); // the live site's own multi-line templates render as one line
  return text.trim();
}

// ---------------------------------------------------------------------------
// Text helpers for stat/skill labels
// ---------------------------------------------------------------------------

// Base-stat names come back as e.g. "Intellect Boost [L]" - the bracket is an
// internal size tier marker the site itself never displays.
function stripBracketSuffix(text) {
  return (text || "").replace(/\s*\[[A-Z]\]$/, "");
}

// Passive skill names come back as e.g. "Fracture: Artzy Exaggeration" -
// only the category before the colon is stored as `skillStats`.
function skillCategory(text) {
  return (text || "").split(":")[0].trim();
}

// ---------------------------------------------------------------------------
// Domains: reverse-engineered from the weapon-essence-solver page. A weapon's
// farmable zones are whichever "perfect match" essences (same primary
// attribute + secondary stat + skill tag) can drop from.
// ---------------------------------------------------------------------------

function buildLocationNameMap(essencesDb, i18nTable) {
  const map = new Map();
  for (const group of essencesDb.dungeonGroups) {
    const raw = i18nTable[group.locationNameI18nId];
    if (!raw) continue;
    const idx = raw.indexOf(": ");
    const name = idx >= 0 ? raw.slice(idx + 2) : raw;
    if (/test area/i.test(name)) continue; // dev-only zone, not real content
    map.set(group.groupId, name);
  }
  return map;
}

function computeDomains(weapon, essencesDb, locationNameMap) {
  const typeToken = weapon.weaponId.match(/^wpn_([a-z]+)_/)?.[1];
  if (!typeToken) return [];

  const wantTags = new Set(
    [weapon.baseStats?.[0]?.tagId, weapon.baseStats?.[1]?.tagId, weapon.passiveSkills?.[0]?.tagId].filter(Boolean)
  );
  if (wantTags.size === 0) return [];

  const matches = essencesDb.essences.filter(
    (e) =>
      e.id.startsWith(`gem_${typeToken}_`) &&
      e.stats.length === wantTags.size &&
      e.stats.every((s) => wantTags.has(s.tagId))
  );

  const domains = new Set();
  for (const essence of matches) {
    for (const groupId of essence.possibleDungeons || []) {
      const name = locationNameMap.get(groupId);
      if (name) domains.add(name);
    }
  }
  return [...domains].sort();
}

// ---------------------------------------------------------------------------
// Image handling
// ---------------------------------------------------------------------------

async function ensureLocalImage(weaponId) {
  const dest = path.join(IMAGES_DIR, `${weaponId}.webp`);
  try {
    await fs.access(dest);
    return { downloaded: false };
  } catch {
    // doesn't exist yet, fall through to download
  }

  // The GitHub mirror serves full-res (~256x256) art; the site's own itemicon
  // endpoint only ever serves a 126x126 thumbnail, so it's the last resort.
  const candidates = [
    `https://raw.githubusercontent.com/catalystzzz/images/refs/heads/main/${weaponId}.png`,
    `${BASE}/assets/images/endfield/itemicon/${weaponId}.png`,
  ];

  for (const url of candidates) {
    try {
      const res = await fetch(url, { headers: { "User-Agent": "Mozilla/5.0" } });
      if (!res.ok) continue;
      const buffer = Buffer.from(await res.arrayBuffer());
      await sharp(buffer).webp().toFile(dest);
      return { downloaded: true, source: url };
    } catch {
      // try next candidate
    }
  }
  return { downloaded: false, failed: true };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log("Fetching weapon list...");
  const weaponsListRaw = await fetchJson("/localdb/optimized/weapons/weapons-list.json");
  const weapons = Object.values(weaponsListRaw).sort((a, b) =>
    a.rarity !== b.rarity ? b.rarity - a.rarity : a.weaponId.localeCompare(b.weaponId)
  );
  console.log(`  ${weapons.length} weapons found on the live site.`);

  console.log("Fetching translation tables (EN, MX)...");
  const i18n = {};
  for (const [lang, code] of Object.entries(LANGS)) {
    i18n[lang] = await fetchJson(`/localdb/optimized/i18n/I18nTextTable_${code}.json`);
  }

  console.log("Fetching essence/domain data...");
  const essencesDb = await fetchJson("/localdb/optimized/essences/essences-database.json");
  const locationNames = {
    en: buildLocationNameMap(essencesDb, i18n.en),
    es: buildLocationNameMap(essencesDb, i18n.es),
  };

  // Preserve existing Spanish names the live site has no official translation
  // for (some weapon names simply aren't localized yet - the MX text table
  // returns the English string verbatim). Falling back to a previously
  // hand/community-translated name beats silently regressing it to English.
  let previousEs = [];
  try {
    previousEs = JSON.parse(await fs.readFile(path.join(DATA_DIR, "weapons.es.json"), "utf8"));
  } catch {
    // no previous file, nothing to preserve
  }
  const previousEsNameByImage = new Map(previousEs.map((w) => [w.image, w.name]));

  const output = { en: [], es: [] };
  const imageReport = { downloaded: [], failed: [] };
  const preservedNames = [];

  for (const weapon of weapons) {
    const image = `/weapons/${weapon.weaponId}.webp`;
    const imageCloud = `https://raw.githubusercontent.com/catalystzzz/images/refs/heads/main/${weapon.weaponId}.png`;
    const weaponType = WEAPON_TYPE_LABELS[weapon.weaponType] || String(weapon.weaponType);
    const rarity = String(weapon.rarity);
    const passive = weapon.passiveSkills?.[0];
    const englishName = i18n.en[weapon.nameI18nId] || weapon.engName?.text || weapon.weaponId;

    for (const lang of ["en", "es"]) {
      const table = i18n[lang];
      let name = table[weapon.nameI18nId] || weapon.engName?.text || weapon.weaponId;
      if (lang === "es" && name === englishName) {
        const previousName = previousEsNameByImage.get(image);
        if (previousName && previousName !== englishName) {
          preservedNames.push({ weaponId: weapon.weaponId, english: englishName, kept: previousName });
          name = previousName;
        }
      }
      const attributeStats = stripBracketSuffix(table[weapon.baseStats?.[0]?.skillNameId]);
      const secondaryStats = stripBracketSuffix(table[weapon.baseStats?.[1]?.skillNameId]);
      const skillStats = skillCategory(table[passive?.skillNameId]);
      const domains = computeDomains(weapon, essencesDb, locationNames[lang]);
      const description = passive ? renderDescription(table[passive.descriptionId], passive.blackboard) : "";

      output[lang].push({
        name,
        rarity,
        image,
        domains,
        attributeStats,
        secondaryStats,
        skillStats,
        description,
        imageCloud,
        weaponType,
      });
    }

    if (!SKIP_IMAGES) {
      const result = await ensureLocalImage(weapon.weaponId);
      if (result.downloaded) imageReport.downloaded.push(weapon.weaponId);
      if (result.failed) imageReport.failed.push(weapon.weaponId);
    }
  }

  console.log(`\nResolved ${output.en.length} weapons for en/es.`);
  if (preservedNames.length) {
    console.log(`Kept ${preservedNames.length} previously-translated ES names not yet localized on the live site:`);
    preservedNames.forEach((p) => console.log(`  ${p.weaponId}: "${p.kept}" (site has no ES string, only "${p.english}")`));
  }
  if (!SKIP_IMAGES) {
    console.log(`Images: ${imageReport.downloaded.length} downloaded, ${imageReport.failed.length} failed.`);
    if (imageReport.failed.length) console.log("  Failed:", imageReport.failed.join(", "));
  }

  if (DRY_RUN) {
    console.log("\n--dry-run set, not writing files.");
    return;
  }

  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(path.join(DATA_DIR, "weapons.en.json"), JSON.stringify(output.en, null, 2));
  await fs.writeFile(path.join(DATA_DIR, "weapons.es.json"), JSON.stringify(output.es, null, 2));
  console.log(`\nWrote ${path.join("public", "data", "weapons.en.json")}`);
  console.log(`Wrote ${path.join("public", "data", "weapons.es.json")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
