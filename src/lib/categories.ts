export interface Category {
  key: string;
  label: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  { key: "playing-cues", label: "Playing Cues", description: "Premium playing cues for every level" },
  { key: "break-cues", label: "Break Cues", description: "Powerful break cues built for impact" },
  { key: "jump-cues", label: "Jump Cues", description: "Precision jump cues for advanced shots" },
  { key: "shafts", label: "Shafts", description: "High-performance replacement shafts" },
  { key: "gloves", label: "Gloves", description: "Billiard gloves for a smooth stroke" },
  { key: "cue-cases", label: "Cue Cases", description: "Protective cases to keep your cues safe" },
  { key: "extensions", label: "Extensions", description: "Cue extensions for extra reach" },
  { key: "balls", label: "Balls", description: "Professional billiard ball sets" },
  { key: "cloths", label: "Cloths", description: "Table cloths for optimal play" },
  { key: "chalks", label: "Chalks", description: "Premium cue chalks for better grip" },
  { key: "cleaning", label: "Cleaning Accessories", description: "Keep your equipment in top condition" },
  { key: "tips", label: "Tips", description: "Cue tips for precision and control" },
  { key: "pool-tables", label: "Pool Tables", description: "Professional-grade pool tables" },
];

const CATEGORY_MAP = new Map(CATEGORIES.map((c) => [c.key, c]));

export function categoryLabel(key: string): string {
  return CATEGORY_MAP.get(key)?.label ?? key;
}

export function getCategory(key: string): Category | undefined {
  return CATEGORY_MAP.get(key);
}

export function isValidCategoryKey(key: string): boolean {
  return CATEGORY_MAP.has(key);
}
