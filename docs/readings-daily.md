# readings-daily.md — Daily Fortune (日運) テンプレ原稿 v1.0

<!--
For クロコ:
- これを data/readings-daily.json に変換して合成ロジックに載せる（既存 readings.json と同型）
- 計算: ganzhi.js の todayPillar() で「今日の日柱」を取得
    - general(一般日運): 今日の日柱の五行＋陰陽で選択（10種）。入力なしで全訪問者に出す
    - personal(個人日運): [ユーザーの日主stem] × [今日の日柱の五行] で選択（50種）。生年月日を入れた人だけに追加表示
- 合成順(一般): [general_{element}_{yinyang}] + [daily_cta]
- 合成順(個人): [general_{element}_{yinyang}] + [personal_{stem}_{todayElement}] + [daily_closing]
    ※個人日運を出す人にも一般日運は先に出す（「今日はこういう日」→「あなたにとっては」の順）
- daily_cta: 入力なしの人にのみ表示。生年月日入力への変換導線。個人日運を出す人には出さない
- プレースホルダ: {name} 未入力時 "you" に置換
- 文体規則: readings-templates.md と完全同一。断定禁止 / "is said to" / "traditionally associated with" のみ。医療・投資・法律への言及禁止
- 重要: この60本は【年に依存しない】。2026年運(readings-templates.md §3)と違い、毎年の差し替え不要。恒久運用可
- キー命名: 見出しのsnake_caseをそのまま使用

五行の生剋（クロコ検証用・原稿はこの関係に基づいて書き分けてある）:
  生: 木→火→土→金→水→木  /  剋: 木→土→水→火→金→木
  各日主から見た「今日の五行」の関係は5種:
    比和(同): 勢い・注意は過剰
    印/資源(今日が日主を生む): 前向き・滋養・受け取り
    食傷/出力(日主が今日を生む): 前向き・表現・ただし消費
    財(日主が今日を剋す): 前向き・掌握・行動の日
    官殺/圧(今日が日主を剋す): 消耗に注意・守り・着手を避ける ← Mona方針「剋=消耗に注意」
-->

---

## SECTION 1: General Daily (一般日運) — 10 patterns（今日の日柱の五行×陰陽）

### general_wood_yang
Today runs on **Yang Wood (甲)** — the tall tree, growth pushing straight upward. Days like this are traditionally associated with initiative and nerve: the courage to begin something and take up room while doing it. The old reading favors planting today — a decision, a first step, a thing you intend to still be standing next year. The gentle caution is scope: a tree grows in one direction, and today is said to reward one clear start over five scattered ones.

### general_wood_yin
Today runs on **Yin Wood (乙)** — the vine, the reaching tendril. Traditionally this is a day of flexibility and alliance: progress made sideways, through the right people and the sunlit gap no one else noticed. The old texts favor persuasion over force today, and adaptation over confrontation. A good day to bend toward what you want rather than push at it. What looks effortless today is said to be the day's particular gift.

### general_fire_yang
Today runs on **Yang Fire (丙)** — the sun at its height. Days like this are traditionally associated with visibility, warmth, and momentum: things begun under an open sky are said to travel further than they would in quieter weather. The classical caution is that fire spends itself quickly, so today is read as a day for one bright, deliberate move rather than many sparks. A good day to be seen, to speak first, to warm a room.

### general_fire_yin
Today runs on **Yin Fire (丁)** — the candle, the focused flame. Traditionally a day of insight and precision: the lamp that shows one page clearly rather than flooding the whole room. The old reading favors the careful conversation, the detail others missed, the quiet clarity. A day to illuminate one thing well. Guard your fuel, the texts advise — choose where to burn rather than burning wherever the draft carries you.

### general_earth_yang
Today runs on **Yang Earth (戊)** — the mountain. Days like this are traditionally associated with steadiness and patience: the long view, the immovable center others organize themselves around. The old reading is not a day for sudden moves but for holding ground and being reliable in a way people quietly depend on. What you steady today is said to hold for a long time.

### general_earth_yin
Today runs on **Yin Earth (己)** — the cultivated field. Traditionally a day of nurture and quiet productivity: tending what is already planted and turning patient effort into harvest. The old texts favor the practical, unglamorous work today — the watering, the weeding, the thing that looks like nothing until you notice everything alive is standing in it. A day that rewards care over flourish.

### general_metal_yang
Today runs on **Yang Metal (庚)** — the axe, the clean edge. Days like this are traditionally associated with decisiveness and clarity: cutting through a mess that has paralyzed everyone else. The old reading favors ending an ambiguity today — making the call you've been circling, closing what should be closed. A day for a straight line. The caution is only that the edge that solves problems can nick whoever stands too near.

### general_metal_yin
Today runs on **Yin Metal (辛)** — the jewel, the fine needle. Traditionally a day of refinement and discernment: the small elegant intervention, the flaw no one else could see, the quality that quietly holds everything together. The old texts favor taste over volume today — detail, craft, and the pride of doing one thing beautifully. A day when precision is worth more than force.

### general_water_yang
Today runs on **Yang Water (壬)** — the great river in motion. Days like this are traditionally associated with wide horizons and momentum: ideas arriving in floods, plans rerouting overnight, the pull to be going somewhere. The old reading favors thinking big today and letting the current carry — with the classical reminder to keep some banks, so all that force reaches the sea instead of scattering.

### general_water_yin
Today runs on **Yin Water (癸)** — rain and quiet mist. Traditionally a day of intuition and perception: reading the room, following the hunch, understanding things sideways through feeling and pattern. The old texts favor the gentle and the unforced today. A day to gather yourself around one clear intention — mist that drifts everywhere is not the same as mist that arrives.

### daily_cta
*(入力なしの人にのみ表示。個人日運を出す人には出さない)*
This is today's weather for everyone. **Enter your date of birth** to see how today reads for *you* — your Day Master meeting today's element, in the traditional five-element way. It takes about thirty seconds, calculated privately in your browser.

---

## SECTION 2: Personal Daily (個人日運) — 50 patterns（日主stem × 今日の五行）

### 甲 Yang Wood (jia) — the tall tree

#### personal_jia_wood
*(比和/同 — 勢い)*
Today's Wood meets your own, {name} — Yang Wood on a Wood day, the forest thickening around the tall tree. Tradition reads days like this as ones of surplus momentum: plans multiply, ambition runs high, and starting feels easy. The old caution is exactly that ease — Wood in excess is said to crowd its own canopy. A strong day to push forward on the one thing that matters, and to resist beginning three more.

#### personal_jia_fire
*(食傷/出力 — 前向き・ただし消費)*
Today's Fire draws on your Wood, {name} — the tall tree feeding the flame. Tradition reads this as an expressive, visible day: what you've quietly grown becomes fuel for something bright, and your work is seen. It's traditionally favorable for performing, launching, stepping forward. The gentle caution is that feeding fire depletes wood — so shine deliberately today, and rest deliberately after. Give, but keep a little unburned.

#### personal_jia_earth
*(財 — 前向き・掌握)*
Today's Earth is yours to work, {name} — the tree's roots turning the soil. Tradition reads days like this as productive and grounding for Yang Wood: the earth yields to you, and effort converts cleanly into something solid. It's traditionally read as a day to build, to manage, to take hold of tangible things. You are in a position of quiet command today — a good day to make the material world answer to your plan.

#### personal_jia_metal
*(官殺/圧 — 消耗に注意)*
Today's Metal presses against your Wood, {name} — the axe meeting the tree. In the five-element cycle, metal cuts wood, and days like this are traditionally read as demanding: pressure arrives, and the same standards that sharpen you can also wear you down. The old texts counsel holding your ground today rather than launching — endure, don't overextend, and guard your reserves. It is read as a day to bend a little so you don't break, and to keep something back for tomorrow.

#### personal_jia_water
*(印/資源 — 前向き・滋養)*
Today's Water feeds your Wood, {name} — rain to the tall tree. Tradition reads this as a nourishing day for Yang Wood: support arrives, ideas take root, and what you receive today is said to strengthen what you're growing. It's traditionally favorable for learning, accepting help, and quiet replenishment. A good day to let yourself be watered rather than to strain — the tree that drinks deeply today stands taller through the dry seasons.

### 乙 Yin Wood (yi) — the vine

#### personal_yi_wood
*(比和/同 — 勢い)*
Today's Wood meets your own, {name} — Yin Wood on a Wood day, vines twining thicker. Tradition reads this as a day of easy growth and reach: alliances form, opportunities branch, and progress feels natural. The old caution is over-extension — a vine can wind around so many trellises it forgets its own direction. A strong day to advance, provided you remember which way you meant to climb.

#### personal_yi_fire
*(食傷/出力 — 前向き・ただし消費)*
Today's Fire draws on your Wood, {name} — the vine offering itself to the flame. Tradition reads this as a warm, expressive day: your charm and adaptability find an audience, and what you say lands. It's traditionally favorable for social moves, performance, being felt. The caution is that giving light costs the giver — so today, shine where it counts and let yourself recover after. Grace is real work, even when it looks like none.

#### personal_yi_earth
*(財 — 前向き・掌握)*
Today's Earth is yours to work, {name} — the vine drawing richness from the soil. Tradition reads this as a resourceful, productive day for Yin Wood: the ground supports you, and small, clever moves turn into real gains. It's read as a day to gather, to arrange, to make the tangible world cooperate through finesse rather than force. A good day to quietly acquire what you'll need.

#### personal_yi_metal
*(官殺/圧 — 消耗に注意)*
Today's Metal presses against your Wood, {name} — the blade near the vine. In the five-element cycle metal cuts wood, and days like this are traditionally read as taxing: demands press in, and the flexibility that usually protects you can be stretched too thin. The old texts counsel yielding rather than resisting today — bend low, hold your position, and don't take on the new. It is read as a day to conserve your suppleness and wait out the pressure. Rest deliberately.

#### personal_yi_water
*(印/資源 — 前向き・滋養)*
Today's Water feeds your Wood, {name} — soft rain over the vine. Tradition reads this as a nourishing, restorative day for Yin Wood: help arrives gently, and you absorb what you need without strain. It's traditionally favorable for receiving, learning, and being cared for. A good day to lean on your alliances rather than work them — the vine well-watered today climbs easily tomorrow.

### 丙 Yang Fire (bing) — the sun

#### personal_bing_wood
*(印/資源 — 前向き・滋養)*
Today's Wood feeds your Fire, {name} — timber laid on the sun. Tradition reads this as a nourishing, high-energy day for Yang Fire: fresh fuel arrives, inspiration is abundant, and you are traditionally said to burn brighter without effort. It's favorable for starting warmly, gathering support, being generous. The old reading simply asks that you accept the fuel — a good day to let others' ideas and goodwill feed your fire rather than going it alone.

#### personal_bing_fire
*(比和/同 — 勢い)*
Today's Fire meets your own, {name} — the sun doubled, blazing. Tradition reads this as a peak-visibility day for Yang Fire: momentum comes easily, attention finds you, and bold moves land better than careful ones. The classical caution is excess — every flame invited to become a bonfire. Choose your one great blaze for the day rather than scattering sparks, and keep a little fuel unburned for what follows.

#### personal_bing_earth
*(食傷/出力 — 前向き・ただし消費)*
Today's Earth draws on your Fire, {name} — the sun warming the ground into something that grows. Tradition reads this as a productive, generous day: your warmth turns into visible results others can stand on. It's traditionally favorable for teaching, giving, building for the long term. The caution is that steady giving depletes even the sun — so warm what matters today, and remember that fire does its best work in cycles, not one endless noon.

#### personal_bing_metal
*(財 — 前向き・掌握)*
Today's Metal is yours to shape, {name} — the sun's heat working the ore. Tradition reads this as a day of command for Yang Fire: what is hard and stubborn yields to your warmth, and you are traditionally in a position to refine, to lead, to get real things done. It's read as a day to act on the material world with confidence. A good day to forge — to turn raw circumstance into something with an edge.

#### personal_bing_water
*(官殺/圧 — 消耗に注意)*
Today's Water presses against your Fire, {name} — rain meeting the sun. In the five-element cycle water controls fire, and days like this are traditionally read as draining for Yang Fire: everything seems to ask for your light at once, and demands can dim you. The old texts counsel boundaries drawn early today and replenishment scheduled like an appointment. It is read as a day to shine less and rest more — to hold your warmth close rather than spending it on every cold thing.

### 丁 Yin Fire (ding) — the candle

#### personal_ding_wood
*(印/資源 — 前向き・滋養)*
Today's Wood feeds your Fire, {name} — kindling for the candle. Tradition reads this as a nourishing day for Yin Fire: gentle fuel arrives, and your insight burns steadier and clearer. It's traditionally favorable for study, close conversation, and quiet inspiration. The old reading favors receiving today — a good day to let a book, a mentor, or a single good idea feed your flame, so the light holds longer.

#### personal_ding_fire
*(比和/同 — 勢い)*
Today's Fire meets your own, {name} — candle finding candle, the light strengthening. Tradition reads this as a bright, focused day for Yin Fire: your perceptiveness sharpens and your warmth draws people in. The classical caution is a small flame's sensitivity to draft — momentum today can flicker if scattered. A strong day to illuminate one thing intensely rather than many things faintly.

#### personal_ding_earth
*(食傷/出力 — 前向き・ただし消費)*
Today's Earth draws on your Fire, {name} — the candle's warmth settling into the ground. Tradition reads this as a quietly productive, expressive day: your insight turns into something others can use and keep. It's favorable for mentoring, refining, giving shape to a vague idea. The caution is that even a small flame spends its fuel when it gives steadily — so illuminate what deserves it today, and guard the rest.

#### personal_ding_metal
*(財 — 前向き・掌握)*
Today's Metal is yours to refine, {name} — the candle's flame working the jewel. Tradition reads this as a day of precise command for Yin Fire: fine, stubborn things yield to your patient warmth, and detail work goes well. It's read as a day to perfect, to polish, to bring something small and valuable to completion. A good day for the exacting task — your focused light is exactly the tool it needs.

#### personal_ding_water
*(官殺/圧 — 消耗に注意)*
Today's Water presses against your Fire, {name} — a draft, a drop of rain on the candle. In the five-element cycle water controls fire, and days like this are traditionally read as fragile for Yin Fire: the small flame is easily unsettled, and demands or moods can gutter your light. The old texts counsel shelter today — guard your flame, decline what would scatter it, and don't burn where the wind is strong. A day to protect your energy, not prove it.

### 戊 Yang Earth (wu) — the mountain

#### personal_wu_wood
*(官殺/圧 — 消耗に注意)*
Today's Wood presses against your Earth, {name} — roots working into the mountain. In the five-element cycle wood controls earth, and days like this are traditionally read as demanding for Yang Earth: others' plans and pressures push at your stability, testing your patience. The old texts counsel the mountain's own wisdom today — endure, don't be moved by every push, and let the weathering pass. It is read as a day to hold, not to expand, and to protect the ground you already stand on.

#### personal_wu_fire
*(印/資源 — 前向き・滋養)*
Today's Fire feeds your Earth, {name} — the sun warming the mountain. Tradition reads this as a nourishing, settling day for Yang Earth: warmth and support arrive, and the day's energy tends to consolidate, in the end, as new solid ground beneath you. It's favorable for receiving recognition, accepting help, letting things firm up. The old reading favors saying yes to warmth today and letting the good settle in.

#### personal_wu_earth
*(比和/同 — 勢い)*
Today's Earth meets your own, {name} — mountain rising against mountain, the ground deepening. Tradition reads this as a day of unusual steadiness for Yang Earth: reliability doubled, patience abundant, the kind of solidity whole groups build on. The classical caution is heaviness — too much earth is said to bury its own seeds. A strong day to be the foundation, provided you don't mistake stillness for progress.

#### personal_wu_metal
*(食傷/出力 — 前向き・ただし消費)*
Today's Metal draws on your Earth, {name} — the mountain yielding ore. Tradition reads this as a productive, generative day for Yang Earth: what you've patiently accumulated turns into something sharp and useful others can take up. It's favorable for producing, delivering, giving of your depth. The caution is that steady output empties even a mountain over time — so give from your surplus today, and let the ground lie fallow after.

#### personal_wu_water
*(財 — 前向き・掌握)*
Today's Water is yours to hold, {name} — the mountain shaping the river's path. Tradition reads this as a day of command for Yang Earth: fluid, restless things settle into the channels you provide, and you are traditionally in a position to direct and contain. It's read as a day to manage resources, to give shape to what was scattered. A good day to be the banks that turn a flood into a river.

### 己 Yin Earth (ji) — the field

#### personal_ji_wood
*(官殺/圧 — 消耗に注意)*
Today's Wood presses against your Earth, {name} — roots drawing hard on the field. In the five-element cycle wood controls earth, and days like this are traditionally read as depleting for Yin Earth: demands multiply, and the giving soil can be asked for more than it holds. The old texts counsel a fallow day — give less, replenish, and resist being planted in by everyone's needs. It is read as a day to protect your richness rather than spend it, so tomorrow's harvest survives.

#### personal_ji_fire
*(印/資源 — 前向き・滋養)*
Today's Fire feeds your Earth, {name} — the sun over the field. Tradition reads this as a warm, fertile day for Yin Earth: nourishment and encouragement arrive, and the day's warmth is said to enrich the ground you tend. It's favorable for receiving, growing, letting good conditions do their work. The old reading favors accepting the season today — a good day to let warmth and support ripen what you've planted.

#### personal_ji_earth
*(比和/同 — 勢い)*
Today's Earth meets your own, {name} — field beside field, the ground rich and wide. Tradition reads this as a day of quiet abundance for Yin Earth: resourcefulness doubled, patience deep, everything alive quietly standing in your soil. The classical caution is a field that never lies fallow loses its richness. A strong day to produce and provide, provided you schedule your own off-season into it.

#### personal_ji_metal
*(食傷/出力 — 前向き・ただし消費)*
Today's Metal draws on your Earth, {name} — the field yielding its ore. Tradition reads this as a productive, expressive day for Yin Earth: what you've nurtured turns into something refined and useful, and your quiet work becomes visible. It's favorable for delivering, sharing, making your care count. The caution is that giving steadily thins even rich soil — so harvest deliberately today, and let the ground rest after.

#### personal_ji_water
*(財 — 前向き・掌握)*
Today's Water is yours to hold, {name} — the field cupping the rain, the garden pond kept. Tradition reads this as a day of gentle command for Yin Earth: fluid, scattered resources settle where you place them, and you are traditionally able to gather and keep. It's read as a day to manage, to save, to make abundance stay. A good day to hold water where growing things can reach it.

### 庚 Yang Metal (geng) — the axe

#### personal_geng_wood
*(財 — 前向き・掌握)*
Today's Wood is yours to shape, {name} — the axe meeting the timber. Tradition reads this as a day of command for Yang Metal: sprawling, unruly things yield to your clarity, and you are traditionally in a position to cut, sort, and make usable. It's read as a day to bring order to a mess, to prune what's overgrown, to decide. A good day to turn raw material into something with form.

#### personal_geng_fire
*(官殺/圧 — 消耗に注意)*
Today's Fire presses against your Metal, {name} — the forge's heat on the blade. In the five-element cycle fire controls metal, and days like this are traditionally read as intense for Yang Metal: pressure and heat bear down, and the day can feel like being tested in the fire. The old texts frame this as tempering rather than harm — but counsel flexibility today, not resistance. It is read as a day to endure the heat, protect yourself from the worst of it, and trust that you come out sharper. Don't launch; withstand.

#### personal_geng_earth
*(印/資源 — 前向き・滋養)*
Today's Earth feeds your Metal, {name} — ore rising from the mountain to meet the blade. Tradition reads this as a nourishing, strengthening day for Yang Metal: resources and support arrive, and your clarity is said to be well-supplied. It's favorable for receiving backing, consolidating, sharpening with good material. The old reading favors accepting the ground's gifts today — a good day to be resourced rather than to strain.

#### personal_geng_metal
*(比和/同 — 勢い)*
Today's Metal meets your own, {name} — edge against edge, the blade ringing. Tradition reads this as a day of unusual decisiveness for Yang Metal: clarity doubled, resolve firm, ambiguity cut clean. The classical caution is sharpness without a sheath — the same edge that solves problems can nick whoever stands too near. A strong day to make the hard call, provided you keep your edge aimed at the problem and not the people.

#### personal_geng_water
*(食傷/出力 — 前向き・ただし消費)*
Today's Water draws on your Metal, {name} — the blade giving its brightness to the stream. Tradition reads this as an expressive, releasing day for Yang Metal: your clarity flows outward and becomes something others can carry. It's favorable for communicating, teaching, letting your judgment move into the world. The caution is that output spends the self — so give your clarity where it counts today, and let yourself refill after.

### 辛 Yin Metal (xin) — the jewel

#### personal_xin_wood
*(財 — 前向き・掌握)*
Today's Wood is yours to shape, {name} — the fine blade trimming the branch. Tradition reads this as a day of precise command for Yin Metal: overgrown, unrefined things yield to your exacting eye, and you are traditionally able to improve what you touch. It's read as a day to edit, to perfect, to make elegant. A good day for the small decisive cut that makes the whole thing better.

#### personal_xin_fire
*(官殺/圧 — 消耗に注意)*
Today's Fire presses against your Metal, {name} — flame close to the jewel. In the five-element cycle fire controls metal, and days like this are traditionally read as trying for Yin Metal: heat, scrutiny, and pressure bear on your fine surface, and the flaw-detecting eye can turn painfully inward. The old texts counsel gentleness with yourself today — withstand the heat, decline what would scratch you, and remember a gem is not diminished by an imperfect day. A day to protect your shine, not perform it.

#### personal_xin_earth
*(印/資源 — 前向き・滋養)*
Today's Earth feeds your Metal, {name} — the jewel rising refined from the ground. Tradition reads this as a nourishing day for Yin Metal: support and good material arrive, and your quality is said to be well-set. It's favorable for receiving recognition, being properly resourced, resting in good surroundings. The old reading favors accepting the setting today — a gem shows best when it is held well.

#### personal_xin_metal
*(比和/同 — 勢い)*
Today's Metal meets your own, {name} — jewel beside jewel, precision compounding. Tradition reads this as a day of heightened discernment for Yin Metal: your eye for quality sharpens and your influence turns elegant. The classical caution is the flaw-finding gift turned inward — today's sharpness can cut at yourself. A strong day for exacting work, provided you spend the standard on the task and not on your own reflection.

#### personal_xin_water
*(食傷/出力 — 前向き・ただし消費)*
Today's Water draws on your Metal, {name} — the jewel's shine dissolving into the stream. Tradition reads this as an expressive, refining day for Yin Metal: your taste and clarity flow outward and elevate what they touch. It's favorable for sharing your discernment, styling, communicating with polish. The caution is that giving of your fineness costs you — so lend your eye where it matters today, and withdraw to restore it after.

### 壬 Yang Water (ren) — the ocean

#### personal_ren_wood
*(食傷/出力 — 前向き・ただし消費)*
Today's Wood draws on your Water, {name} — the river feeding the forest. Tradition reads this as a generative, expressive day for Yang Water: your ideas and momentum nourish something that grows, and what you set in motion takes root elsewhere. It's favorable for creating, launching, letting your current drive real growth. The caution is that feeding others draws down the river — so pour into what matters today, and let yourself be replenished after.

#### personal_ren_fire
*(財 — 前向き・掌握)*
Today's Fire is yours to command, {name} — the great water meeting the heat and governing it. Tradition reads this as a day of quiet power for Yang Water: energetic, flaring things yield to your depth and direction, and you are traditionally able to steer what runs hot. It's read as a day to lead, to manage intensity, to turn other people's fire into useful work. A good day to move like water — cool, unhurried, and impossible to argue with.

#### personal_ren_earth
*(官殺/圧 — 消耗に注意)*
Today's Earth presses against your Water, {name} — banks and dams narrowing the river. In the five-element cycle earth controls water, and days like this are traditionally read as constraining for Yang Water: obstacles and obligations hem in your natural flow, and pushing against them tires you. The old texts counsel patience over force today — find the low path, don't batter the walls, and conserve your momentum. It is read as a day to wait for the channel to open rather than to flood. Don't force it; hold.

#### personal_ren_metal
*(印/資源 — 前向き・滋養)*
Today's Metal feeds your Water, {name} — the spring welling clear from the rock. Tradition reads this as a nourishing, clarifying day for Yang Water: support arrives and your thinking runs clean and deep. It's favorable for learning, planning, drawing on good sources. The old reading favors receiving today — a good day to let clarity and backing refill the river, so all that current has somewhere true to go.

#### personal_ren_water
*(比和/同 — 勢い)*
Today's Water meets your own, {name} — river joining river, the current vast. Tradition reads this as a day of surging momentum for Yang Water: ideas arrive in floods, plans reroute overnight, and standing still feels unnatural. The classical caution is force without banks — power that scatters when it has no channel. A strong day to move boldly, provided you accept some limits, so the flood becomes a river that reaches the sea.

### 癸 Yin Water (gui) — the rain

#### personal_gui_wood
*(食傷/出力 — 前向き・ただし消費)*
Today's Wood draws on your Water, {name} — soft rain drawn up into the growing thing. Tradition reads this as a quietly generative day for Yin Water: your intuition and care feed something that grows, often without anyone quite noticing the source. It's favorable for nurturing ideas, healing, giving of your perception. The caution is that mist gives itself away as it rises — so pour into what matters today, and let yourself gather again after.

#### personal_gui_fire
*(財 — 前向き・掌握)*
Today's Fire is yours to temper, {name} — fine rain settling the heat. Tradition reads this as a day of gentle command for Yin Water: flaring, restless energy calms in your presence, and you are traditionally able to soften and direct what runs hot. It's read as a day when your calm becomes a resource others reach for. A good day to cool a situation quietly — rain, after all, is what settles the fire without ever raising its voice.

#### personal_gui_earth
*(官殺/圧 — 消耗に注意)*
Today's Earth presses against your Water, {name} — soil soaking up the rain, the mist hemmed by the hills. In the five-element cycle earth controls water, and days like this are traditionally read as depleting for Yin Water: demands absorb you, and your subtle energy can be drawn off in a dozen directions until little remains. The old texts counsel a vessel today — one clear intention to gather yourself into, and firm limits on the rest. It is read as a day to conserve and contain, not to disperse. Rest deliberately.

#### personal_gui_metal
*(印/資源 — 前向き・滋養)*
Today's Metal feeds your Water, {name} — the spring rising cool and clear from the stone. Tradition reads this as a nourishing, clarifying day for Yin Water: support and clean sources arrive, and your intuition runs deep and steady. It's favorable for learning, reflection, drawing on good counsel. The old reading favors receiving today — a good day to let clarity and care replenish you, so your perception has something clear to gather around.

#### personal_gui_water
*(比和/同 — 勢い)*
Today's Water meets your own, {name} — rain joining mist, the whole valley quietly filling. Tradition reads this as a day of deep intuition for Yin Water: perception heightens, and you understand things sideways before anyone explains them. The classical caution is dissipation — mist that drifts everywhere is not the same as mist that arrives. A strong day to follow your feeling, provided you gather it toward one clear intention.

---

## SECTION 3: Daily Closing (日運共通末尾)

### daily_closing
*(個人日運を出した人の末尾に。一般日運のみの人には daily_cta が末尾になる)*
A daily reading describes the weather of a single day in the old tradition — never its verdict, and never a reason to postpone your life. Take what serves you today, and let the rest run past.

*This reading is for entertainment and cultural interest. It is not medical, legal, or financial advice.*

<!--
組み合わせ数: 一般10 + 個人50 + CTA/closing = 恒久運用60本
文字数目安: 一般 ≈ 65-80 words / 個人 ≈ 90-120 words
クロコへ: JSON化の際キー名は上記見出しのsnake_caseをそのまま使用
  (general_wood_yang... / personal_jia_wood... / daily_cta / daily_closing)
五行関係の検証: 各個人日運の見出し下に (比和/印/食傷/財/官殺) を明記済み。実装時に
  「今日の五行と日主の関係」判定ロジックと突き合わせて、キー選択が関係と一致するか確認可能
-->
