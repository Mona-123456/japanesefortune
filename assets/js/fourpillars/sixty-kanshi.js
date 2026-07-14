/* ==========================================================================
   The 60 kanshi (六十干支) — traditional Japanese kun-yomi readings.
   --------------------------------------------------------------------------
   Source: National Astronomical Observatory of Japan (国立天文台 暦計算室),
   https://eco.mtk.nao.ac.jp/koyomi/faq/60kansi.html

   Each reading is stem-kun + branch-kun; by custom a "no" (の) is inserted
   after the yin ("younger", 弟 / -to) stems — 乙丁己辛癸 — e.g. 乙丑 =
   Kinoto-no-Ushi, while 甲子 = Kinoe-Ne. This table reproduces the NAO list
   exactly (verified all 60). Kept as a literal table, not composed at runtime,
   so the canonical readings are auditable in one place. Keyed by the kanji
   pair (stem.cn + branch.cn).
   ========================================================================== */

export const SIXTY_KANSHI = {
  "甲子": "Kinoe-Ne", "乙丑": "Kinoto-no-Ushi",
  "丙寅": "Hinoe-Tora", "丁卯": "Hinoto-no-U",
  "戊辰": "Tsuchinoe-Tatsu", "己巳": "Tsuchinoto-no-Mi",
  "庚午": "Kanoe-Uma", "辛未": "Kanoto-no-Hitsuji",
  "壬申": "Mizunoe-Saru", "癸酉": "Mizunoto-no-Tori",
  "甲戌": "Kinoe-Inu", "乙亥": "Kinoto-no-I",
  "丙子": "Hinoe-Ne", "丁丑": "Hinoto-no-Ushi",
  "戊寅": "Tsuchinoe-Tora", "己卯": "Tsuchinoto-no-U",
  "庚辰": "Kanoe-Tatsu", "辛巳": "Kanoto-no-Mi",
  "壬午": "Mizunoe-Uma", "癸未": "Mizunoto-no-Hitsuji",
  "甲申": "Kinoe-Saru", "乙酉": "Kinoto-no-Tori",
  "丙戌": "Hinoe-Inu", "丁亥": "Hinoto-no-I",
  "戊子": "Tsuchinoe-Ne", "己丑": "Tsuchinoto-no-Ushi",
  "庚寅": "Kanoe-Tora", "辛卯": "Kanoto-no-U",
  "壬辰": "Mizunoe-Tatsu", "癸巳": "Mizunoto-no-Mi",
  "甲午": "Kinoe-Uma", "乙未": "Kinoto-no-Hitsuji",
  "丙申": "Hinoe-Saru", "丁酉": "Hinoto-no-Tori",
  "戊戌": "Tsuchinoe-Inu", "己亥": "Tsuchinoto-no-I",
  "庚子": "Kanoe-Ne", "辛丑": "Kanoto-no-Ushi",
  "壬寅": "Mizunoe-Tora", "癸卯": "Mizunoto-no-U",
  "甲辰": "Kinoe-Tatsu", "乙巳": "Kinoto-no-Mi",
  "丙午": "Hinoe-Uma", "丁未": "Hinoto-no-Hitsuji",
  "戊申": "Tsuchinoe-Saru", "己酉": "Tsuchinoto-no-Tori",
  "庚戌": "Kanoe-Inu", "辛亥": "Kanoto-no-I",
  "壬子": "Mizunoe-Ne", "癸丑": "Mizunoto-no-Ushi",
  "甲寅": "Kinoe-Tora", "乙卯": "Kinoto-no-U",
  "丙辰": "Hinoe-Tatsu", "丁巳": "Hinoto-no-Mi",
  "戊午": "Tsuchinoe-Uma", "己未": "Tsuchinoto-no-Hitsuji",
  "庚申": "Kanoe-Saru", "辛酉": "Kanoto-no-Tori",
  "壬戌": "Mizunoe-Inu", "癸亥": "Mizunoto-no-I",
};
