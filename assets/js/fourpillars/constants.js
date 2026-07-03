/* ==========================================================================
   Four Pillars of Destiny (四柱推命 / BaZi) — shared constants
   --------------------------------------------------------------------------
   Public, traditional systems only. NO 六星占術 (Rokusei Senjutsu) data or
   logic anywhere in this codebase (registered trademark — see spec §0/§6).
   ========================================================================== */

/** 10 Heavenly Stems 天干. Index 0 = 甲. */
export const STEMS = [
  { cn: "甲", romaji: "Kō",   pinyin: "Jiǎ",  element: "wood",  yin: false },
  { cn: "乙", romaji: "Otsu", pinyin: "Yǐ",   element: "wood",  yin: true  },
  { cn: "丙", romaji: "Hei",  pinyin: "Bǐng", element: "fire",  yin: false },
  { cn: "丁", romaji: "Tei",  pinyin: "Dīng", element: "fire",  yin: true  },
  { cn: "戊", romaji: "Bo",   pinyin: "Wù",   element: "earth", yin: false },
  { cn: "己", romaji: "Ki",   pinyin: "Jǐ",   element: "earth", yin: true  },
  { cn: "庚", romaji: "Kō",   pinyin: "Gēng", element: "metal", yin: false },
  { cn: "辛", romaji: "Shin", pinyin: "Xīn",  element: "metal", yin: true  },
  { cn: "壬", romaji: "Jin",  pinyin: "Rén",  element: "water", yin: false },
  { cn: "癸", romaji: "Ki",   pinyin: "Guǐ",  element: "water", yin: true  },
];

/**
 * 12 Earthly Branches 地支. Index 0 = 子.
 * `element` is the branch's principal (本気) five-element, used for the
 * five-element balance count in the MVP.
 */
export const BRANCHES = [
  { cn: "子", romaji: "Ne",   zodiac: "Rat",     element: "water" },
  { cn: "丑", romaji: "Ushi", zodiac: "Ox",      element: "earth" },
  { cn: "寅", romaji: "Tora", zodiac: "Tiger",   element: "wood"  },
  { cn: "卯", romaji: "U",    zodiac: "Rabbit",  element: "wood"  },
  { cn: "辰", romaji: "Tatsu",zodiac: "Dragon",  element: "earth" },
  { cn: "巳", romaji: "Mi",   zodiac: "Snake",   element: "fire"  },
  { cn: "午", romaji: "Uma",  zodiac: "Horse",   element: "fire"  },
  { cn: "未", romaji: "Hitsuji", zodiac: "Goat", element: "earth" },
  { cn: "申", romaji: "Saru", zodiac: "Monkey",  element: "metal" },
  { cn: "酉", romaji: "Tori", zodiac: "Rooster", element: "metal" },
  { cn: "戌", romaji: "Inu",  zodiac: "Dog",     element: "earth" },
  { cn: "亥", romaji: "I",    zodiac: "Pig",     element: "water" },
];

/** Five elements 五行, canonical order 木火土金水. */
export const ELEMENTS = ["wood", "fire", "earth", "metal", "water"];

export const ELEMENT_LABELS = {
  wood:  { cn: "木", en: "Wood" },
  fire:  { cn: "火", en: "Fire" },
  earth: { cn: "土", en: "Earth" },
  metal: { cn: "金", en: "Metal" },
  water: { cn: "水", en: "Water" },
};

/**
 * The 12 major solar terms (節 / jié) that open the solar months, in order
 * starting from 立春. Each entry: the term, its target solar longitude, and
 * the Earthly-Branch index of the month it opens.
 *   立春(315°) opens the 寅 month (branch index 2), and each subsequent term
 *   advances the branch by one.
 * These are the ONLY boundaries used for the month pillar — never a fixed date.
 */
export const MONTH_TERMS = [
  { term: "立春", en: "Risshun",   longitude: 315, branch: 2  }, // 寅
  { term: "啓蟄", en: "Keichitsu", longitude: 345, branch: 3  }, // 卯
  { term: "清明", en: "Seimei",    longitude: 15,  branch: 4  }, // 辰
  { term: "立夏", en: "Rikka",     longitude: 45,  branch: 5  }, // 巳
  { term: "芒種", en: "Bōshu",     longitude: 75,  branch: 6  }, // 午
  { term: "小暑", en: "Shōsho",    longitude: 105, branch: 7  }, // 未
  { term: "立秋", en: "Risshū",    longitude: 135, branch: 8  }, // 申
  { term: "白露", en: "Hakuro",    longitude: 165, branch: 9  }, // 酉
  { term: "寒露", en: "Kanro",     longitude: 195, branch: 10 }, // 戌
  { term: "立冬", en: "Rittō",     longitude: 225, branch: 11 }, // 亥
  { term: "大雪", en: "Taisetsu",  longitude: 255, branch: 0  }, // 子
  { term: "小寒", en: "Shōkan",    longitude: 285, branch: 1  }, // 丑
];

/** IANA offset for the birth-time interpretation. Phase 1 assumes Japan (JST). */
export const TZ_OFFSET_HOURS = 9;
