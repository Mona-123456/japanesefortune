/* ==========================================================================
   Zodiac content — the twelve Earthly-Branch manuscripts, structured for the
   generator. Source of truth for tools/build-zodiac-pages.mjs (HTML only, no
   parallel markdown). Prose is the delivered copy.

   Escaping contract (see the generator): `body` prose is trusted inline HTML
   (<em>/<strong>) and is emitted verbatim — write literal & as &amp; there.
   Every other field (h1, metaDesc, heroLine, section headings, FAQ q/a, the
   calendar-meta values) is plain text and is escaped by the generator.
   ========================================================================== */

export const BRANCHES = [
  {
    key: "rat", cn: "子", kun: "ne", animal: "Rat", order: 1,
    h1: "The Rat (子): First of the Twelve — Your Zodiac Animal",
    heroLine: "You arrived first. Nobody remembers you running.",
    metaDesc: "The Rat (子), first of the twelve Earthly Branches in the Japanese zodiac — Water, the midnight hour, north, deep winter. Quick, resourceful, the sign of new beginnings.",
    element: "Water", hours: "11pm–1am", direction: "North", season: "Deep winter",
    trinity: "Water trinity with Dragon and Monkey (申子辰)", clash: "Horse (午)",
    body: [
      { h: "Who the Rat is", b: [
        "In the Four Pillars tradition, the Rat is the first of the twelve Earthly Branches (子, <em>ne</em>) — the sign that opens the cycle. It belongs to the deepest part of the night, the turn of the year, and the element of Water at its source.",
        "Not the water of rivers. The water of the well in winter: still, dark, and holding everything that will later grow.",
        "The tradition reads Rat people as quick, resourceful, and quietly strategic — the ones who see the opening before anyone else and take it without announcing they have. Charm that reads as friendliness and works as intelligence. The Rat is rarely the loudest in the room and often the one who understood the room first.",
      ] },
      { h: "How the Rat came first", b: [
        "There is a story every Japanese child knows.",
        "The gods announced a race: the first twelve animals to arrive at the palace on New Year's morning would each rule a year. The Ox, knowing he was slow, set out in the dark before everyone else. The Rat, knowing he was small, did something better — he rode.",
        "He climbed onto the Ox's back and travelled the whole way in silence. At the gate, in the last instant, he leapt down in front and crossed the line first. Twelve animals arrived. The Rat had run almost none of it.",
        "The tradition doesn't read this as cheating. It reads it as the Rat's whole nature in one gesture: conserve your strength, choose your vehicle, and understand that arriving first matters more than being seen to try. In Japan the Rat is also the messenger of Daikokuten, the god of wealth and the harvest — the small creature that lives where the rice is stored, and therefore where the fortune is.",
      ] },
      { h: "The Rat's nature", b: [
        "Adaptable to the point of being hard to pin down. Rat people are traditionally associated with sharp instincts, an eye for opportunity, and a talent for thriving in exactly the conditions that defeat other people — scarcity, change, the unfamiliar city.",
        "The shadow the old texts name is accumulation without rest: the Rat gathers — resources, contacts, contingencies, small advantages — and can mistake gathering for living. The well that only fills and never pours grows stagnant. The counsel is to spend some of what you store.",
      ] },
      { h: "Time, direction, and season", b: [
        "Every Earthly Branch is also an hour, a direction, and a season. This is what the West, knowing only \"the year of the Rat,\" tends to miss.",
        "The Rat is the hour of 11pm to 1am — the <em>ne no koku</em>, the pivot of the night, when one day becomes the next. Its direction is due north. Its season is the heart of winter, around the solstice. The Rat sits exactly where the old year dies and the new one has not yet been named — which is why the cycle begins here, in the dark, at the source of Water.",
      ] },
      { h: "Who the Rat moves with", b: [
        "In Four Pillars, the branches form alliances and collisions.",
        "The Rat's great harmony is the Water trinity — Rat, Dragon, and Monkey (申子辰), three signs that together form a \"water frame,\" traditionally read as a natural understanding between them. Its direct opposition is the Horse (午): midnight against noon, Water against Fire, north against south. The tradition reads the Rat–Horse clash not as doom but as maximum contrast — two signs that want opposite things at opposite hours.",
      ] },
      { h: "The Year of the Rat", b: [
        "A Rat year is traditionally read as a year of beginnings — the first turn of a new twelve-year cycle, a year to plant rather than harvest, to start quietly what will be visible much later. Fitting, for the sign that opens everything.",
        "Whatever your own animal, the Rat's hour comes for everyone once a day, and its year once in twelve. The tradition would say: notice what you begin in the dark.",
      ] },
    ],
    faqs: [
      { q: "What does the Rat mean in the Japanese zodiac?", a: "The Rat (子, ne) is the first of the twelve Earthly Branches, associated with the Water element, the hour around midnight, the direction north, and the depth of winter. It traditionally signifies quick intelligence, resourcefulness, and new beginnings." },
      { q: "Why is the Rat first in the zodiac?", a: "A well-known folk tale says the Rat rode on the Ox's back during the animals' New Year race and leapt ahead at the finish to arrive first. The story is read as an expression of the Rat's cleverness rather than dishonesty." },
      { q: "What is the Rat most compatible with?", a: "Four Pillars reads compatibility from whole charts, not one animal alone. But the branch trinities offer a shape: the Rat forms a \"water frame\" with the Dragon and Monkey, and stands in direct opposition to the Horse." },
    ],
  },
  {
    key: "ox", cn: "丑", kun: "ushi", animal: "Ox", order: 2,
    h1: "The Ox (丑): The Patient One — Your Zodiac Animal",
    heroLine: "You were moving before sunrise. You will still be moving after everyone stops.",
    metaDesc: "The Ox (丑, ushi) is the second Earthly Branch in Four Pillars — Earth, the hours before dawn, north-northeast, deep winter. Its meaning, its shrine, and what it moves with.",
    element: "Earth", hours: "1am–3am", direction: "North-northeast", season: "Deep winter",
    trinity: "Metal trinity with Snake and Rooster (巳酉丑)", clash: "Goat (未)",
    body: [
      { h: "Who the Ox is", b: [
        "The second Earthly Branch (丑, <em>ushi</em>) — the sign of patient, unglamorous, unstoppable work. It belongs to the cold hours before dawn, the direction north-northeast, and an <strong>Earth</strong> that holds Water: frozen ground, waiting.",
        "The Ox is read as steady, honest, and immovably reliable. Not fast. Not loud. The one who finishes."
      ]},
      { h: "The Ox and the god of learning", b: [
        "In the race, the Ox set out first, knowing his slowness — and would have won, had the Rat not ridden his back. The tradition reads this without bitterness: the Ox does the work; whether he gets the credit is a separate question he doesn't waste time on.",
        "In Japan the Ox belongs to <strong>Tenjin</strong> — the deified scholar Sugawara no Michizane. At his shrines sits the <em>nade-ushi</em>, the reclining bronze ox: rub its head, and it is said to carry your prayers for learning and healing. Students touch it before exams. The Ox is the animal of those who get there by grinding, not by flash."
      ]},
      { h: "The Ox's nature", b: [
        "Endurance as a personality. Ox people are associated with diligence, loyalty, and a deep resistance to being hurried. The shadow the texts name is <em>stubbornness</em> — the same steadiness that finishes the work refuses to change the plan when the plan is wrong."
      ]},
      { h: "Time, direction, and season", b: [
        "The hour of <strong>1am to 3am</strong> — including <em>ushi-mitsu-doki</em>, the \"dead of night\" of Japanese ghost stories, the hour said to belong to spirits. Direction north-northeast. Deep winter, the cold that comes just before the turn."
      ]},
      { h: "Who the Ox moves with", b: [
        "Its harmony is the <strong>Metal trinity</strong> with Snake and Rooster (巳酉丑). Its opposition is the <strong>Goat</strong> (未) — a clash the tradition reads as the collision of two kinds of patience."
      ]},
      { h: "The Year of the Ox", b: [
        "Read as a year for steady, foundational work — the year you build what will hold. Not the year of the leap. The year of the load-bearing wall."
      ]}
    ],
    faqs: [
      { q: "What does the Ox mean in the Japanese zodiac?", a: "The Ox (丑, ushi) is the second Earthly Branch — Earth element, the hours before dawn, direction north-northeast, deep winter. It signifies diligence, patience, and reliability." },
      { q: "Why did the Ox not come first?", a: "He set out earliest, but the Rat rode on his back and jumped ahead at the finish. Tradition reads the Ox as untroubled by this — his nature is the work, not the applause." },
      { q: "What is the Ox most compatible with?", a: "Compatibility comes from whole charts. The branch trinities place the Ox in a \"metal frame\" with the Snake and Rooster, and opposite the Goat." }
    ]
  },
  {
    key: "tiger", cn: "寅", kun: "tora", animal: "Tiger", order: 3,
    h1: "The Tiger (寅): Courage and Presence — Your Zodiac Animal",
    heroLine: "You enter a room and the temperature changes. You did not choose this.",
    metaDesc: "The Tiger (寅, tora) is the third Earthly Branch in Four Pillars — Wood, the hour before dawn, east-northeast, early spring. Its meaning, its place in Japanese art, and what it moves with.",
    element: "Wood", hours: "3am–5am", direction: "East-northeast", season: "Early spring",
    trinity: "Fire trinity with Horse and Dog (寅午戌)", clash: "Monkey (申)",
    body: [
      { h: "Who the Tiger is", b: [
        "The third branch (寅, <em>tora</em>) — courage, momentum, and a presence that cannot be dimmed. It belongs to the hour just before dawn, the direction east-northeast, and <strong>Wood</strong> in its first, forceful growth: the sapling that splits the rock.",
        "The Tiger is read as brave, passionate, and natural at leading — and constitutionally unable to be small about anything."
      ]},
      { h: "The tiger Japan never had", b: [
        "Here is the strange thing: <strong>there are no wild tigers in Japan, and there never were.</strong> Yet the tiger runs through Japanese art, temples, and proverbs — <em>\"the tiger travels a thousand leagues and returns a thousand leagues\"</em> — an animal known entirely through imported paintings and Buddhist teaching. The Tiger is the guardian beast of <strong>Bishamonten</strong>, god of warriors. Japan built a whole reverence for a creature it had only ever seen drawn. Fitting for a sign whose power is partly about how it is <em>perceived</em>."
      ]},
      { h: "The Tiger's nature", b: [
        "Force of personality. Tiger people are associated with boldness, generosity, and an instinct to protect — and with a temper the old texts don't hide. The shadow is <em>recklessness</em>: the leap taken because standing still felt worse."
      ]},
      { h: "Time, direction, and season", b: [
        "The hour of <strong>3am to 5am</strong> — the dark edge of dawn, when the day's Wood energy first stirs. Direction east-northeast. Early spring — and the branch that opens the traditional new year at <strong>Risshun</strong>."
      ]},
      { h: "Who the Tiger moves with", b: [
        "Harmony in the <strong>Fire trinity</strong> with Horse and Dog (寅午戌). Opposition to the <strong>Monkey</strong> (申) — the ancient enmity of tiger and monkey, force against cleverness."
      ]},
      { h: "The Year of the Tiger", b: [
        "Read as a year of bold moves and sudden change — expansive, a little dangerous, rewarding courage over caution."
      ]}
    ],
    faqs: [
      { q: "What does the Tiger mean in the Japanese zodiac?", a: "The Tiger (寅, tora) is the third Earthly Branch — Wood element, the hour before dawn, east-northeast, early spring. It signifies courage, leadership, and force of presence." },
      { q: "Why is the tiger important in Japan if there are no tigers there?", a: "Japan knew the tiger only through Chinese art and Buddhism, yet made it a guardian figure — the beast of Bishamonten. Its cultural power came entirely from image and story." },
      { q: "What is the Tiger most compatible with?", a: "From whole charts, not one sign. The trinities place the Tiger in a \"fire frame\" with Horse and Dog, opposite the Monkey." }
    ]
  },
  {
    key: "rabbit", cn: "卯", kun: "u", animal: "Rabbit", order: 4,
    h1: "The Rabbit (卯): Grace and Quiet Luck — Your Zodiac Animal",
    heroLine: "The softest sign. Ask what softness survived to become soft.",
    metaDesc: "The Rabbit (卯, u) is the fourth Earthly Branch in Four Pillars — Wood, sunrise, due east, mid-spring. Its meaning, the rabbit in the moon, and what it moves with.",
    element: "Wood", hours: "5am–7am", direction: "Due east", season: "Mid-spring (the equinox)",
    trinity: "Wood trinity with Goat and Boar (亥卯未)", clash: "Rooster (酉)",
    body: [
      { h: "Who the Rabbit is", b: [
        "The fourth branch (卯, <em>u</em>) — gentleness, grace, and a quiet, durable luck. It belongs to sunrise, due east, and <strong>Wood</strong> in its open, growing form: not the sapling that splits rock, but the field of grass that covers everything.",
        "The Rabbit is read as kind, diplomatic, and quietly fortunate — the sign that avoids the fight and somehow ends up fine."
      ]},
      { h: "The rabbit in the moon", b: [
        "In the West, the moon has a face. In Japan, it has a <strong>rabbit</strong> — the <em>tsuki no usagi</em>, pounding rice into mochi on the full moon. Look up at the harvest moon in Japan and you are meant to see the Rabbit at its mortar. There is also <strong>Inaba no Shirousagi</strong>, the white rabbit of Japanese myth who tricks his way across the sea, is punished, and is healed by a kind god. The Rabbit is the sign of softness that endures — gentle, yes, but a survivor."
      ]},
      { h: "The Rabbit's nature", b: [
        "Grace under pressure. Rabbit people are associated with tact, sensitivity, and a gift for keeping the peace. The shadow the texts name is <em>avoidance</em> — the conflict never had, the true thing never said, harmony bought at the cost of honesty."
      ]},
      { h: "Time, direction, and season", b: [
        "The hour of <strong>5am to 7am</strong> — sunrise itself. Direction due east, where the sun clears the horizon. Mid-spring, the equinox: the moment day and night are equal and light begins to win."
      ]},
      { h: "Who the Rabbit moves with", b: [
        "Harmony in the <strong>Wood trinity</strong> with Goat and Boar (亥卯未). Opposition to the <strong>Rooster</strong> (酉) — sunrise against sunset, east against west."
      ]},
      { h: "The Year of the Rabbit", b: [
        "Read as a year of peace, recovery, and quiet growth — a gentler year after the Tiger's storm, favouring diplomacy over force."
      ]}
    ],
    faqs: [
      { q: "What does the Rabbit mean in the Japanese zodiac?", a: "The Rabbit (卯, u) is the fourth Earthly Branch — Wood element, sunrise, due east, mid-spring. It signifies gentleness, diplomacy, and quiet good fortune." },
      { q: "Why is there a rabbit in the moon in Japan?", a: "Japanese tradition sees a rabbit pounding mochi in the markings of the full moon, rather than a face — a reading shared across much of East Asia." },
      { q: "What is the Rabbit most compatible with?", a: "From whole charts. The trinities place the Rabbit in a \"wood frame\" with the Goat and Boar, opposite the Rooster." }
    ]
  },
  {
    key: "dragon", cn: "辰", kun: "tatsu", animal: "Dragon", order: 5,
    h1: "The Dragon (辰): The Only Myth — Your Zodiac Animal",
    heroLine: "The only one of the twelve that never existed. Notice it outranks the ones that do.",
    metaDesc: "The Dragon (辰, tatsu) is the fifth Earthly Branch and the only mythical one — Earth, mid-morning, east-southeast, late spring. Its meaning, the water-dragon of Japan, and what it moves with.",
    element: "Earth", hours: "7am–9am", direction: "East-southeast", season: "Late spring",
    trinity: "Water trinity with Rat and Monkey (申子辰)", clash: "Dog (戌)",
    body: [
      { h: "Who the Dragon is", b: [
        "The fifth branch (辰, <em>tatsu</em>) — power, vision, and a largeness that other signs orbit. The single mythical animal in the twelve, and somehow the least questioned. It belongs to mid-morning, the direction east-southeast, and <strong>Earth</strong> that holds Wood and Water both: the storm-bringing ground.",
        "The Dragon is read as charismatic, ambitious, and lucky in a way that looks unfair — the sign that expects the extraordinary and often gets it."
      ]},
      { h: "The water-dragon of Japan", b: [
        "The Western dragon hoards gold and burns villages. The <strong>Japanese dragon (<em>ryū</em>) is a water god</strong> — it lives in rivers, lakes, and the sea, brings rain, and is prayed to in drought. Shrines across Japan honour dragon deities of water; the dragon coils on temple ceilings and water basins. It is not a monster to be slain but a force to be asked. The Dragon is the sign of those who move weather — who change the conditions other people are merely subject to."
      ]},
      { h: "The Dragon's nature", b: [
        "Scale. Dragon people are associated with confidence, generosity, and a visionary streak that pulls others along. The shadow is <em>disdain for the ordinary</em> — the impatience with small tasks, small people, small days, that leaves the grand plan with no foundation under it."
      ]},
      { h: "Time, direction, and season", b: [
        "The hour of <strong>7am to 9am</strong> — mid-morning, the day gathering force. Direction east-southeast. Late spring, when the rains come."
      ]},
      { h: "Who the Dragon moves with", b: [
        "Harmony in the <strong>Water trinity</strong> with Rat and Monkey (申子辰). Opposition to the <strong>Dog</strong> (戌) — a clash the tradition reads as the visionary against the loyalist."
      ]},
      { h: "The Year of the Dragon", b: [
        "The most auspicious year in the cycle — traditionally read as a year of ambition, luck, and big undertakings. Birth rates across East Asia measurably rise in Dragon years. People <em>choose</em> to have Dragon children."
      ]}
    ],
    faqs: [
      { q: "What does the Dragon mean in the Japanese zodiac?", a: "The Dragon (辰, tatsu) is the fifth Earthly Branch and the only mythical one — Earth element, mid-morning, east-southeast, late spring. It signifies power, vision, and exceptional fortune." },
      { q: "How is the Japanese dragon different from the Western one?", a: "The Japanese dragon is a water deity that brings rain and is prayed to, not a treasure-hoarding monster to be killed. It is benevolent and closely tied to water." },
      { q: "What is the Dragon most compatible with?", a: "From whole charts. The trinities place the Dragon in a \"water frame\" with the Rat and Monkey, opposite the Dog." }
    ]
  },
  {
    key: "snake", cn: "巳", kun: "mi", animal: "Snake", order: 6,
    h1: "The Snake (巳): Wisdom and Depth — Your Zodiac Animal",
    heroLine: "People underestimate you once.",
    metaDesc: "The Snake (巳, mi) is the sixth Earthly Branch in Four Pillars — Fire, late morning, south-southeast, early summer. Its meaning, the white snake of fortune, and what it moves with.",
    element: "Fire", hours: "9am–11am", direction: "South-southeast", season: "Early summer",
    trinity: "Metal trinity with Ox and Rooster (巳酉丑)", clash: "Boar (亥)",
    body: [
      { h: "Who the Snake is", b: [
        "The sixth branch (巳, <em>mi</em>) — wisdom, depth, and a stillness that reads everything. It belongs to late morning, the direction south-southeast, and <strong>Fire</strong> in its hidden, inward form: heat under the surface, not yet flame.",
        "The Snake is read as intelligent, intuitive, and quietly formidable — the sign that says little and knows much."
      ]},
      { h: "The white snake of fortune", b: [
        "In Japan the snake is the messenger and companion of <strong>Benzaiten</strong>, goddess of water, music, and — crucially — <strong>wealth</strong>. A white snake (<em>hakuja</em>) is one of the luckiest omens in Japanese folk belief, a sign of money and divine favour; people keep shed snakeskin in their wallets for fortune. The snake also <em>sheds</em> — dies to its old form and emerges renewed. The Snake is the sign of transformation and quiet money, the fortune that accumulates where no one is watching."
      ]},
      { h: "The Snake's nature", b: [
        "Depth and control. Snake people are associated with wisdom, patience, and a hypnotic calm. The shadow the texts name is <em>possessiveness</em> — the cool exterior wrapped tightly around what, or whom, it has decided is its own."
      ]},
      { h: "Time, direction, and season", b: [
        "The hour of <strong>9am to 11am</strong> — late morning, heat building. Direction south-southeast. Early summer, the year warming toward its peak."
      ]},
      { h: "Who the Snake moves with", b: [
        "Harmony in the <strong>Metal trinity</strong> with Ox and Rooster (巳酉丑). Opposition to the <strong>Boar</strong> (亥) — a clash of the subtle and the direct."
      ]},
      { h: "The Year of the Snake", b: [
        "Read as a year of reflection, strategy, and quiet transformation — a year to shed rather than to charge, to plan what the following years will spend."
      ]}
    ],
    faqs: [
      { q: "What does the Snake mean in the Japanese zodiac?", a: "The Snake (巳, mi) is the sixth Earthly Branch — Fire element, late morning, south-southeast, early summer. It signifies wisdom, intuition, and transformation." },
      { q: "Why is the snake considered lucky in Japan?", a: "The snake is tied to Benzaiten, goddess of wealth, and a white snake is a strong omen of money and fortune. Shed snakeskin is kept as a charm." },
      { q: "What is the Snake most compatible with?", a: "From whole charts. The trinities place the Snake in a \"metal frame\" with the Ox and Rooster, opposite the Boar." }
    ]
  },
  {
    key: "horse", cn: "午", kun: "uma", animal: "Horse", order: 7,
    h1: "The Horse (午): Freedom and Fire — Your Zodiac Animal",
    heroLine: "You run because stopping feels like dying. Learn the difference.",
    metaDesc: "The Horse (午, uma) is the seventh Earthly Branch in Four Pillars — Fire, noon, due south, midsummer. Its meaning, the sacred horse behind the ema plaque, and the Fire Horse of 2026.",
    element: "Fire", hours: "11am–1pm", direction: "Due south", season: "Midsummer",
    trinity: "Fire trinity with Tiger and Dog (寅午戌)", clash: "Rat (子)",
    body: [
      { h: "Who the Horse is", b: [
        "The seventh branch (午, <em>uma</em>) — freedom, energy, and forward motion that resists every rein. It sits at the exact opposite of the Rat: <strong>noon</strong>, due south, the peak of <strong>Fire</strong>. Where the Rat opens the cycle in darkness, the Horse stands at its brightest hour.",
        "The Horse is read as cheerful, independent, and quick — the sign that needs to move, and wilts when penned."
      ]},
      { h: "The horse that carries prayers", b: [
        "Japan's connection here is concrete. The <strong>ema</strong> — the small wooden plaques you write wishes on at every shrine — began as <em>offerings of real horses</em> to the gods. Live horses were dedicated at shrines to carry prayers to heaven; over centuries, the living animal became a picture of a horse on a wooden board, and then any wish at all. Every wish-plaque in Japan is a descendant of the sacred horse. There is also <strong>Batō Kannon</strong>, the horse-headed Kannon, protector of animals and travellers. The Horse is the sign of movement made sacred."
      ]},
      { h: "The Horse's nature", b: [
        "Motion as identity. Horse people are associated with energy, optimism, and a love of freedom. The shadow the texts name is <em>restlessness</em> — the inability to stay, to finish, to sit with the thing that requires stillness."
      ]},
      { h: "Time, direction, and season", b: [
        "The hour of <strong>11am to 1pm</strong> — noon, the sun at its height. Direction due south. Midsummer, the year at full Fire. This is the hour and the sign of <em>hinoeuma</em>, the \"Fire Horse\" year — of which more below."
      ]},
      { h: "Who the Horse moves with", b: [
        "Harmony in the <strong>Fire trinity</strong> with Tiger and Dog (寅午戌). Direct opposition to the <strong>Rat</strong> (子) — noon against midnight, Fire against Water."
      ]},
      { h: "The Year of the Horse — and the Fire Horse", b: [
        "A Horse year is read as fast, bright, and eventful. But one Horse year in sixty is different: <strong>hinoeuma (丙午), the Fire Horse</strong>, when the Fire branch meets the Fire stem and doubles. A superstition held that women born in a Fire Horse year were dangerously strong-willed — and in 1966, Japan's last Fire Horse, the country's birth rate fell by roughly a quarter as couples avoided or delayed having children. The next Fire Horse is <strong>2026</strong> — this year. It is the clearest case of the zodiac shaping real life ever recorded."
      ]}
    ],
    faqs: [
      { q: "What does the Horse mean in the Japanese zodiac?", a: "The Horse (午, uma) is the seventh Earthly Branch — Fire element, noon, due south, midsummer. It signifies freedom, energy, and forward motion." },
      { q: "What is the Fire Horse (hinoeuma)?", a: "A Fire Horse year occurs once every sixty years when the Fire stem meets the Horse branch. A superstition about strong-willed women born in these years measurably lowered Japan's birth rate in 1966; 2026 is the next one." },
      { q: "What is the Horse most compatible with?", a: "From whole charts. The trinities place the Horse in a \"fire frame\" with the Tiger and Dog, opposite the Rat." }
    ]
  },
  {
    key: "goat", cn: "未", kun: "hitsuji", animal: "Goat", order: 8,
    h1: "The Goat (未): The Gentle One — Your Zodiac Animal",
    heroLine: "The gentlest sign. It is also the one that finished the race by refusing to hurry.",
    metaDesc: "The Goat (未, hitsuji) is the eighth Earthly Branch in Four Pillars — Earth, early afternoon, south-southwest, late summer. Its meaning of ripeness, and why it is the one sign Japan received rather than reinvented.",
    element: "Earth", hours: "1pm–3pm", direction: "South-southwest", season: "Late summer (the ripening)",
    trinity: "Wood trinity with Rabbit and Boar (亥卯未)", clash: "Ox (丑)",
    body: [
      { h: "Who the Goat is", b: [
        "The eighth branch (未, <em>hitsuji</em>) — gentleness, artistry, and a peace that other signs find restful. It belongs to early afternoon, the direction south-southwest, and the <strong>Earth</strong> of late summer: the season the old texts call <em>the ripening</em>, when growth stops and flavour sets in.",
        "The Goat is read as kind, creative, and calm — the sign least interested in winning."
      ]},
      { h: "The one Japan received rather than reinvented", b: [
        "Here is an honesty this site prefers to a flattering myth: <strong>the Goat is the one animal of the twelve that never took deep root in Japan.</strong> Japan had almost no sheep or goats until modern times. Where the Ox has its shrines and the Snake its goddess, the Goat arrived as a character in an imported calendar and, almost alone among the twelve, kept the meaning it came with — the ripeness, the mellow afternoon, the fruit about to turn. In a lineup where most animals were reshaped by local myth, the Goat is the one that kept its original face.",
        "In the race, the tale says the Goat ambled, got lost, and never panicked — arriving eighth by simply refusing to stop, and the gods honoured the persistence. In another telling, the Goat, Monkey, and Rooster crossed the final river together on one raft, which is why the three sit side by side."
      ]},
      { h: "The Goat's nature", b: [
        "Softness with a spine. Goat people are associated with gentleness, artistic feeling, and a deep dislike of conflict. The shadow the texts name is <em>dependence</em> — the peace-lover who leans, avoids, and lets others decide."
      ]},
      { h: "Time, direction, and season", b: [
        "The hour of <strong>1pm to 3pm</strong> — the drowsy early afternoon. Direction south-southwest. Late summer, the ripening, the Earth-phase between summer's Fire and autumn's Metal."
      ]},
      { h: "Who the Goat moves with", b: [
        "Harmony in the <strong>Wood trinity</strong> with Rabbit and Boar (亥卯未). Opposition to the <strong>Ox</strong> (丑) — two kinds of patience that grate against each other."
      ]},
      { h: "The Year of the Goat", b: [
        "Read as a gentle, artistic year — a time for rest, repair, family, and quiet creativity rather than bold advance."
      ]}
    ],
    faqs: [
      { q: "What does the Goat mean in the Japanese zodiac?", a: "The Goat (未, hitsuji) is the eighth Earthly Branch — Earth element, early afternoon, south-southwest, late summer. It signifies gentleness, artistry, and peace. It is sometimes translated Sheep or Ram." },
      { q: "Why is the Goat less prominent in Japanese folklore?", a: "Japan had almost no sheep or goats until modern times, so the Goat is the rare zodiac animal that arrived as an idea rather than a familiar creature — its meaning carried over from the mainland almost untouched. In a lineup where most animals were reshaped by local myth, the Goat is the one that kept its original face." },
      { q: "What is the Goat most compatible with?", a: "From whole charts. The trinities place the Goat in a \"wood frame\" with the Rabbit and Boar, opposite the Ox." }
    ]
  },
  {
    key: "monkey", cn: "申", kun: "saru", animal: "Monkey", order: 9,
    h1: "The Monkey (申): Wit and Invention — Your Zodiac Animal",
    heroLine: "Too clever to be still. Try being clever about that.",
    metaDesc: "The Monkey (申, saru) is the ninth Earthly Branch in Four Pillars — Metal, late afternoon, west-southwest, early autumn. Its meaning, the three monkeys of Nikkō, and what it moves with.",
    element: "Metal", hours: "3pm–5pm", direction: "West-southwest", season: "Early autumn",
    trinity: "Water trinity with Rat and Dragon (申子辰)", clash: "Tiger (寅)",
    body: [
      { h: "Who the Monkey is", b: [
        "The ninth branch (申, <em>saru</em>) — intelligence, invention, and restless play. It belongs to late afternoon, the direction west-southwest, and <strong>Metal</strong> in its bright, active form: the clever edge.",
        "The Monkey is read as quick, inventive, and irrepressible — the sign that solves the problem while everyone else is still describing it."
      ]},
      { h: "The three monkeys of Nikkō", b: [
        "Japan's most famous carving is a Monkey. At the <strong>Tōshō-gū shrine in Nikkō</strong> sit the three monkeys — <em>mizaru, kikazaru, iwazaru</em>: see no evil, hear no evil, speak no evil. They come from the folk faith of <strong>Kōshin</strong>, whose night-vigils and monkey imagery run deep in Japanese religious history. The monkey is also the sacred servant of the mountain god at Sannō shrines — the clever messenger between the human and the divine. The Monkey is the sign of intelligence that mediates, translates, and occasionally tricks."
      ]},
      { h: "The Monkey's nature", b: [
        "Wit. Monkey people are associated with cleverness, curiosity, and social ease. The shadow the texts name is <em>trickery</em> — the intelligence that outsmarts itself, cuts corners, and can't resist the clever move over the honest one."
      ]},
      { h: "Time, direction, and season", b: [
        "The hour of <strong>3pm to 5pm</strong> — the productive late afternoon. Direction west-southwest. Early autumn, the year turning to Metal."
      ]},
      { h: "Who the Monkey moves with", b: [
        "Harmony in the <strong>Water trinity</strong> with Rat and Dragon (申子辰). Opposition to the <strong>Tiger</strong> (寅) — the ancient clash of cleverness and force."
      ]},
      { h: "The Year of the Monkey", b: [
        "Read as a year of ingenuity, change, and clever opportunity — fast-moving, favouring wit and flexibility over brute effort."
      ]}
    ],
    faqs: [
      { q: "What does the Monkey mean in the Japanese zodiac?", a: "The Monkey (申, saru) is the ninth Earthly Branch — Metal element, late afternoon, west-southwest, early autumn. It signifies intelligence, invention, and adaptability." },
      { q: "What are the three monkeys of Nikkō?", a: "The carving at Tōshō-gū shrine showing \"see no evil, hear no evil, speak no evil,\" rooted in the Kōshin folk faith. It is one of Japan's most recognised images." },
      { q: "What is the Monkey most compatible with?", a: "From whole charts. The trinities place the Monkey in a \"water frame\" with the Rat and Dragon, opposite the Tiger." }
    ]
  },
  {
    key: "rooster", cn: "酉", kun: "tori", animal: "Rooster", order: 10,
    h1: "The Rooster (酉): The Bird that Called the Sun — Your Zodiac Animal",
    heroLine: "You saw the sun before anyone. You have been announcing it ever since.",
    metaDesc: "The Rooster (酉, tori) is the tenth Earthly Branch in Four Pillars — Metal, sunset, due west, mid-autumn. Its meaning, the bird that called Amaterasu from her cave, and what it moves with.",
    element: "Metal", hours: "5pm–7pm", direction: "Due west", season: "Mid-autumn (the equinox)",
    trinity: "Metal trinity with Ox and Snake (巳酉丑)", clash: "Rabbit (卯)",
    body: [
      { h: "Who the Rooster is", b: [
        "The tenth branch (酉, <em>tori</em>) — precision, confidence, and unmissable presence. It belongs to sunset, due west, and <strong>Metal</strong> in its refined, finished form: the polished blade.",
        "The Rooster is read as sharp, capable, and proud — the sign that is exactly as competent as it appears, and knows it."
      ]},
      { h: "The bird that called the sun", b: [
        "The Rooster sits at the heart of Japan's oldest myth. When <strong>Amaterasu</strong>, the sun goddess, hid in a cave and plunged the world into darkness, the gods gathered the <em>tokoyo no nagatori</em> — the \"long-crowing birds,\" roosters — to call the dawn and coax her out. The rooster is the bird that summons the sun; you still see them kept at Shinto shrines. And the <strong>Tori-no-ichi</strong>, the November \"Rooster Fairs,\" are where Japan buys ornate <em>kumade</em> rakes to \"rake in\" fortune for the year. The Rooster is the sign of the confident announcer, the one whose voice brings the light."
      ]},
      { h: "The Rooster's nature", b: [
        "Precision and pride. Rooster people are associated with diligence, honesty, and an eye for detail. The shadow the texts name is <em>criticism</em> — the sharp eye that improves everything, turned on people who did not ask to be improved."
      ]},
      { h: "Time, direction, and season", b: [
        "The hour of <strong>5pm to 7pm</strong> — sunset, the mirror of the Rabbit's dawn. Direction due west. Mid-autumn, the equinox, the harvest gathered."
      ]},
      { h: "Who the Rooster moves with", b: [
        "Harmony in the <strong>Metal trinity</strong> with Ox and Snake (巳酉丑). Opposition to the <strong>Rabbit</strong> (卯) — sunset against sunrise, west against east."
      ]},
      { h: "The Year of the Rooster", b: [
        "Read as a year of hard work, precision, and reckoning — a time to finish, account, and put things in order."
      ]}
    ],
    faqs: [
      { q: "What does the Rooster mean in the Japanese zodiac?", a: "The Rooster (酉, tori) is the tenth Earthly Branch — Metal element, sunset, due west, mid-autumn. It signifies precision, confidence, and diligence." },
      { q: "How is the Rooster connected to Japanese myth?", a: "Roosters are the \"long-crowing birds\" that called the sun goddess Amaterasu from her cave in Japan's foundational myth, and are honoured at the Tori-no-ichi fairs for raking in fortune." },
      { q: "What is the Rooster most compatible with?", a: "From whole charts. The trinities place the Rooster in a \"metal frame\" with the Ox and Snake, opposite the Rabbit." }
    ]
  },
  {
    key: "dog", cn: "戌", kun: "inu", animal: "Dog", order: 11,
    h1: "The Dog (戌): The Loyal Guardian — Your Zodiac Animal",
    heroLine: "You would take the hit for people who never noticed you were standing in front of them.",
    metaDesc: "The Dog (戌, inu) is the eleventh Earthly Branch in Four Pillars — Earth, early evening, west-northwest, late autumn. Its meaning, the guardian komainu, and what it moves with.",
    element: "Earth", hours: "7pm–9pm", direction: "West-northwest", season: "Late autumn",
    trinity: "Fire trinity with Tiger and Horse (寅午戌)", clash: "Dragon (辰)",
    body: [
      { h: "Who the Dog is", b: [
        "The eleventh branch (戌, <em>inu</em>) — loyalty, honesty, and a protector's instinct. It belongs to early evening, the direction west-northwest, and the <strong>Earth</strong> of late autumn: the ground closing down for winter.",
        "The Dog is read as faithful, just, and dependable — the sign that keeps its word and expects you to keep yours."
      ]},
      { h: "The guardian at the gate", b: [
        "The stone dogs guarding every Japanese shrine — the <strong><em>komainu</em></strong> — are the Dog's cultural echo: the loyal beast that stands at the threshold and keeps evil out. And the Dog is woven into Japanese life at its most tender point: the <strong><em>inu no hi</em></strong>, the \"Day of the Dog,\" when pregnant women visit shrines for the <em>obi-iwai</em> blessing, because dogs were believed to give birth easily. The Dog is the sign of the guardian — of the gate, of the vulnerable, of the ones who cannot guard themselves."
      ]},
      { h: "The Dog's nature", b: [
        "Fidelity. Dog people are associated with loyalty, fairness, and a strong moral compass. The shadow the texts name is <em>anxiety</em> — the guardian who cannot stop scanning for threats, the cynic who has been let down and now expects to be."
      ]},
      { h: "Time, direction, and season", b: [
        "The hour of <strong>7pm to 9pm</strong> — early evening, the day winding down. Direction west-northwest. Late autumn, Earth again, the pause before winter."
      ]},
      { h: "Who the Dog moves with", b: [
        "Harmony in the <strong>Fire trinity</strong> with Tiger and Horse (寅午戌). Opposition to the <strong>Dragon</strong> (辰) — the loyalist against the visionary."
      ]},
      { h: "The Year of the Dog", b: [
        "Read as a year of loyalty, fairness, and community — a grounded year favouring honesty, duty, and looking after each other."
      ]}
    ],
    faqs: [
      { q: "What does the Dog mean in the Japanese zodiac?", a: "The Dog (戌, inu) is the eleventh Earthly Branch — Earth element, early evening, west-northwest, late autumn. It signifies loyalty, honesty, and protection." },
      { q: "How is the Dog connected to Japanese custom?", a: "The guardian komainu at shrines echo the Dog, and pregnant women visit shrines on the \"Day of the Dog\" for a safe-birth blessing, as dogs were thought to birth easily." },
      { q: "What is the Dog most compatible with?", a: "From whole charts. The trinities place the Dog in a \"fire frame\" with the Tiger and Horse, opposite the Dragon." }
    ]
  },
  {
    key: "boar", cn: "亥", kun: "i", animal: "Boar", order: 12,
    h1: "The Boar (亥): The Headlong Charge — Your Zodiac Animal",
    heroLine: "You go straight through. It is your best and worst quality, and they are the same quality.",
    metaDesc: "The Boar (亥, i) is the twelfth and final Earthly Branch in Four Pillars — Water, late evening, north-northwest, early winter. Why it is a Boar in Japan and a Pig elsewhere, and what it moves with.",
    element: "Water", hours: "9pm–11pm", direction: "North-northwest", season: "Early winter",
    trinity: "Wood trinity with Rabbit and Goat (亥卯未)", clash: "Snake (巳)",
    body: [
      { h: "Who the Boar is", b: [
        "The twelfth and final branch (亥, <em>i</em>) — courage, honesty, and unstoppable forward force. And here Japan and the West part ways completely: <strong>in the Western and Chinese zodiac this sign is the Pig. In Japan it is the wild Boar</strong> — <em>inoshishi</em>, the tusked, charging beast of the mountains. Not the farmyard pig: the animal that runs in one direction and does not swerve.",
        "It belongs to late evening, the direction north-northwest, and <strong>Water</strong> in its final, deep form — the branch that closes the cycle before the Rat opens it again."
      ]},
      { h: "The boar that charges straight", b: [
        "The Boar's Japanese meaning is built on one image: <em>chototsu-mōshin</em> — \"reckless headlong rush,\" a common expression that comes straight from the boar's nature. To go at something like a boar is to go with total commitment and zero course-correction. It is honoured, not mocked: at <strong>Goō Shrine</strong> in Kyoto, guardian <em>koma-inoshishi</em> — stone boars instead of stone dogs — protect the gate, tied to a legend where wild boars saved a nobleman's life. The Boar is also the mount of <strong>Marishiten</strong>, a warrior deity. The Boar is the sign of the honest, courageous charge — the one who commits completely and asks questions never."
      ]},
      { h: "The Boar's nature", b: [
        "Directness. Boar people are associated with honesty, courage, and wholehearted effort. The shadow the texts name is <em>inflexibility</em> — the charge that cannot turn, the commitment that becomes a trap because stopping was never an option."
      ]},
      { h: "Time, direction, and season", b: [
        "The hour of <strong>9pm to 11pm</strong> — late evening, the day almost done. Direction north-northwest. Early winter, the year's Water closing the circle just before the Rat's midnight begins it again."
      ]},
      { h: "Who the Boar moves with", b: [
        "Harmony in the <strong>Wood trinity</strong> with Rabbit and Goat (亥卯未). Opposition to the <strong>Snake</strong> (巳) — the headlong charge against the patient coil."
      ]},
      { h: "The Year of the Boar", b: [
        "Read as a year of honest effort and completion — the end of the cycle, a year to finish wholeheartedly what the twelve years began, before it all starts again."
      ]}
    ],
    faqs: [
      { q: "What does the Boar mean in the Japanese zodiac?", a: "The Boar (亥, i) is the twelfth and final Earthly Branch — Water element, late evening, north-northwest, early winter. It signifies courage, honesty, and wholehearted effort." },
      { q: "Why is it a Boar in Japan and a Pig elsewhere?", a: "The Chinese and Western zodiac use the domestic Pig for this sign; Japan uses the wild Boar (inoshishi), giving it a meaning of courage and headlong force rather than the Pig's associations with comfort and fortune." },
      { q: "What is the Boar most compatible with?", a: "From whole charts. The trinities place the Boar in a \"wood frame\" with the Rabbit and Goat, opposite the Snake." }
    ]
  },
];
