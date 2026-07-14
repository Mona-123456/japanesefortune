/* ==========================================================================
   Day-Master content — the ten manuscripts, structured for the generator.
   Source of truth for tools/build-daymaster-pages.mjs. Prose is the delivered
   copy (confirmed, not to be reworded). The hero line is the two-sentence
   identity; the reading CTA and the hub back-link are appended by the template.
   ========================================================================== */

export const STEMS = [
  {
    key: "jia", slug: "yang-wood", pe: "Yang Wood", cn: "甲", name: "The Tall Tree",
    h1: "Yang Wood (甲): The Tall Tree — Your Day Master",
    heroLine: "You are the tree others plan their lives around. They rarely say so.",
    desc: "Yang Wood (甲), the Tall Tree, is one of the ten Day Masters in Four Pillars — upright, principled, a builder of long-term things. What it means, its shadow, and what supports it.",
    body: [
      { h: "Who Yang Wood is", b: [
        "In the Four Pillars tradition, your Day Master is the character that sits at the centre of your chart — the elemental self that everything else in the chart either supports, drains, challenges, or crowns. Yours is **Yang Wood** (甲, *kinoe*): the tall tree.",
        "Not a shrub. Not a vine. The tree that grows in one direction only — up — and does not apologise for taking up sky.",
        "The classical texts describe Yang Wood people as upright, principled, and quietly ambitious. You are a builder of long-term things: careers, reputations, families, forests of small daily habits compounding into something that casts shade. Shortcuts strike you as vaguely offensive, not because you're above them, but because you can already see where they end.",
        "Growth, for you, tends to be slow, visible, and difficult to reverse. Which is exactly why people learn to lean on it.",
      ] },
      { h: "Yang Wood at work", b: [
        "You are the person who is still there in year five.",
        "The tradition associates this Day Master with structural roles — the ones that hold weight. Founders who stay past the exciting part. Managers whose teams don't churn. The colleague who becomes load-bearing without ever asking to be. You tend to accumulate responsibility not by seeking it but by being the thing that didn't break.",
        "Where this becomes difficult: environments that reward speed over depth, or that reorganise faster than a tree can grow. Yang Wood in a chaotic system is a tree in a wind tunnel. The classical advice is to choose your soil deliberately — you are not built to be transplanted often.",
      ] },
      { h: "Yang Wood in love", b: [
        "Slow to open, and then permanent.",
        "Tradition reads Yang Wood as loyal to the point of being immovable, which is a gift and occasionally a problem. You do not perform affection; you *demonstrate* it, structurally, over years. People who need constant verbal reassurance can find you baffling. People who need a foundation find you and never leave.",
        "The shadow here is that a tree cannot easily reposition itself. If a relationship needs you to change shape, the tradition says you will try to endure it instead — and endurance is not always the same as love.",
      ] },
      { h: "The shadow side", b: [
        "Stubbornness. The old texts are direct about it: a tree does not bend easily, and when the storm comes, that is either heroic or expensive.",
        "Yang Wood's characteristic failure is mistaking rigidity for integrity. You know the difference between a principle and a habit — but under pressure, the habit will present itself as a principle, and you will defend it with the full weight of the trunk.",
        "The tradition's counsel is not \"be flexible.\" It's *notice which storms are worth standing in*. A tree that survives every storm is not stronger than one that lost some branches. It's just a tree that never met the right storm.",
      ] },
      { h: "What supports you, and what drains you", b: [
        "In the five-element cycle:",
        { ul: [
          "**Water grows Wood.** Yin Water (the fog) and Yang Water (the river) feed you — people and seasons that bring reflection, ideas, and depth. When you are depleted, tradition says the answer is not more effort. It's water: thinking, resting, reading, listening.",
          "**Wood feeds Fire.** Fire types (the sun, the candle) draw on your energy — often beautifully. You make them possible. But an untended fire will take everything you have.",
          "**Metal cuts Wood.** Yang Metal (the axe) is the classical challenge to your Day Master. This is not misfortune; the tradition reads Metal as the force that *shapes* Wood. Pruning. The relationships and years that cut you back are often the ones that made you a better tree.",
          "**Wood breaks Earth.** You draw from Earth types (the mountain, the field) — their stability is your soil.",
        ] },
      ] },
      { h: "How your Day Master is calculated", b: [
        "Your Day Master comes from the **day** of your birth, not the year or the month. It is the Heavenly Stem of the day pillar in your Four Pillars chart, calculated against the traditional solar calendar — which means the year doesn't turn on January 1st but at *Risshun*, the start of spring, in early February.",
        "This is why two people born in the same week can be the tree and the fog.",
      ] },
    ],
    faqs: [
      { q: "What does Yang Wood mean in Four Pillars?", a: "Yang Wood (甲) is one of the ten Heavenly Stems — the active, outward form of the Wood element, traditionally symbolised by a tall tree. As a Day Master it is associated with uprightness, long-term building, and a certain immovability." },
      { q: "Is Yang Wood the same as being a Wood sign?", a: "Not quite. Wood comes in two forms: Yang Wood (甲, the tree) and Yin Wood (乙, the vine). They share an element but are read as opposite strategies — one resists the storm, the other survives it by bending." },
      { q: "What is Yang Wood most compatible with?", a: "Tradition doesn't give simple verdicts, but the five-element cycle offers a shape: Water nourishes you, Fire draws on you, Metal challenges and shapes you, Earth grounds you. Compatibility in Four Pillars is read from whole charts, not Day Masters alone." },
    ],
  },

  {
    key: "yi", slug: "yin-wood", pe: "Yin Wood", cn: "乙", name: "The Vine",
    h1: "Yin Wood (乙): The Vine — Your Day Master",
    heroLine: "You are the softest thing in the room. You are also the last one standing.",
    desc: "Yin Wood (乙), the Vine, is one of the ten Day Masters in Four Pillars — adaptable, socially graceful, tougher than it looks. What it means, its shadow, and what supports it.",
    body: [
      { h: "Who Yin Wood is", b: [
        "Your Day Master is **Yin Wood** (乙, *kinoto*): the vine, the grass, the flowering plant.",
        "Where the tall tree resists the storm, Yin Wood survives it by bending, wrapping, and finding the sunlit gap no one else noticed. The classical texts are unusually admiring of this sign, and slightly wary of it. Grass is trodden on daily and outlives empires.",
        "Tradition paints Yin Wood as adaptable, socially graceful, and far tougher than it looks. You have an instinct for alliances — the vine climbs by choosing the right trellis, and you have always known which walls are load-bearing. You make progress look effortless when it was anything but.",
      ] },
      { h: "Yin Wood at work", b: [
        "You are the one who gets it done through people.",
        "Yang Wood builds structures. Yin Wood builds *networks* — and in most organisations, the network is what actually moves. The tradition associates this Day Master with negotiators, connectors, diplomats, and the quiet operators who are never the loudest voice in the meeting and somehow always get the resource.",
        "The trap is that your competence is invisible by design. Because you achieve through relationship rather than force, your contribution can be hard to point at — and organisations promote what they can point at. The classical counsel for Yin Wood is not \"be louder.\" It is: *make sure someone can name what you did.*",
      ] },
      { h: "Yin Wood in love", b: [
        "You give people the shape of themselves back.",
        "Yin Wood is read as attentive, accommodating, and unusually good at making a partner feel understood — because you are, in fact, paying attention. This sign reads a room before it enters it.",
        "The shadow is over-accommodation, and the tradition names it plainly. A vine can wind itself around so many others that it forgets which direction it originally meant to grow. Yin Wood people are prone to relationships in which they slowly become the trellis for someone else's climb — and to noticing this only years later, when they try to move and find they've grown into the shape of the wall.",
      ] },
      { h: "The shadow side", b: [
        "Not weakness. **Diffusion.**",
        "The old texts warn that Yin Wood's great strength — the ability to accommodate any structure — becomes dangerous when there is no structure of its own. The vine that adapts to every surface eventually has no shape that belongs to it.",
        "The classical remedy is deliberately unpoetic: decide what you want *before* the conversation, not during it. Yin Wood in a room will find the harmonious answer. Yin Wood alone, in advance, can find the true one.",
      ] },
      { h: "What supports you, and what drains you", b: [
        "In the five-element cycle:",
        { ul: [
          "**Water grows Wood.** The river and the fog feed you — reflection, ideas, and time alone. Yin Wood depletes fastest in constant company, which is exactly where it is most often found.",
          "**Wood feeds Fire.** The sun and the candle burn beautifully on your energy. You are the person who makes other people brilliant. Watch how much of you that costs.",
          "**Metal cuts Wood.** The axe and the jewel challenge you. For Yin Wood, tradition reads Metal less as violence and more as *pruning* — the hard conversations that clarify what you actually wanted.",
          "**Wood breaks Earth.** The mountain and the field are your ground. Stable people are not boring to you; they are what you climb.",
        ] },
      ] },
      { h: "How your Day Master is calculated", b: [
        "Your Day Master is the Heavenly Stem of the **day** you were born — not the year, not the month. It's calculated against the traditional solar calendar, where the year begins at *Risshun* (early February), not January 1st.",
      ] },
    ],
    faqs: [
      { q: "What does Yin Wood mean in Four Pillars?", a: "Yin Wood (乙) is the receptive form of the Wood element — traditionally symbolised by a vine or flowering plant. As a Day Master it is associated with adaptability, social intelligence, and a resilience that is easy to underestimate." },
      { q: "Is Yin Wood weaker than Yang Wood?", a: "No — the tradition frames them as different strategies, not different strengths. Yang Wood resists; Yin Wood bends and persists. Classical texts frequently note that the vine outlasts the tree." },
      { q: "What is Yin Wood most compatible with?", a: "Four Pillars reads compatibility from whole charts, not Day Masters alone. But the element cycle gives a shape: Water nourishes you, Fire draws on you, Metal prunes you, Earth grounds you." },
    ],
  },

  {
    key: "bing", slug: "yang-fire", pe: "Yang Fire", cn: "丙", name: "The Sun",
    h1: "Yang Fire (丙): The Sun — Your Day Master",
    heroLine: "You are the reason the room is warm. Someone should tell you to go home.",
    desc: "Yang Fire (丙), the Sun, is one of the ten Day Masters in Four Pillars — warm, generous, impossible to ignore. What it means, its shadow, and what supports it.",
    body: [
      { h: "Who Yang Fire is", b: [
        "Your Day Master is **Yang Fire** (丙, *hinoe*): the sun itself.",
        "Not a flame — a *star*. The classical distinction matters: a fire can be put out, moved, contained. The sun does none of these things. It simply rises, illuminates everything indiscriminately, and sets.",
        "Yang Fire people are described as warm, generous, impossible to ignore, and constitutionally incapable of doing anything by halves. You energise whole rooms without trying. You are also, the tradition notes with some affection, incapable of being subtle — the sun does not do subtext.",
      ] },
      { h: "Yang Fire at work", b: [
        "You are the reason morale exists.",
        "Tradition associates this Day Master with leadership of the visible kind: the founder who makes people believe, the teacher students remember, the manager whose team would follow them to another company. Yang Fire generates energy in others as a byproduct of existing, which is a genuinely rare thing and almost never recognised as work.",
        "The cost is invisible to everyone but you. You leave meetings depleted that everyone else left energised by. The classical counsel is unusually practical: *schedule your night*. The sun works in cycles. A Yang Fire person who treats rest as failure will burn out spectacularly and read it as a personal flaw.",
      ] },
      { h: "Yang Fire in love", b: [
        "Total, immediate, and generous to a fault.",
        "You do not do slow burns. Tradition reads Yang Fire as wholehearted, demonstrative, and quick to commit — you shine on people, and being shone on by you is a genuinely lovely experience.",
        "The shadow: the sun does not choose what it illuminates. Yang Fire can pour the same generosity into someone who is merely convenient as into someone who is right, and only notice the difference much later. The old texts advise Yang Fire to be *deliberate* about where the warmth goes — not to withhold it, but to aim it.",
      ] },
      { h: "The shadow side", b: [
        "Burnout, and the strange loneliness of the sun.",
        "Yang Fire depletes when there is no one to shine on. This is the trap the tradition names most clearly: you can end up choosing the audience over the room, staying in relationships and jobs that exhaust you because being needed is how you know you're burning.",
        "There is also the matter of heat. Yang Fire's directness is one of its virtues — you say the true thing — but the sun does not modulate. What feels like honesty from the inside can arrive as scorching from the outside. The classical advice is not \"be less bright.\" It's: notice that some people are standing much closer than you realise.",
      ] },
      { h: "What supports you, and what drains you", b: [
        "In the five-element cycle:",
        { ul: [
          "**Wood feeds Fire.** The tree and the vine are your fuel — people with ideas, projects, and long-term structure. Yang Fire without Wood burns fast and out. Find people who are *building* something and set it alight.",
          "**Fire creates Earth.** The mountain and the field are what your heat produces. You make things solid for other people. That's not nothing, but it does cost you.",
          "**Water controls Fire.** The river and the fog challenge you — cooling, questioning, slowing. This feels like opposition. Tradition reads it as *governance*: the sun that is never checked scorches the crop.",
          "**Fire melts Metal.** The axe and the jewel are what you work on — you transform people. Sometimes without asking.",
        ] },
      ] },
      { h: "How your Day Master is calculated", b: [
        "Your Day Master comes from the **day** of your birth, calculated against the traditional solar calendar — where the year turns at *Risshun* in early February, not January 1st.",
      ] },
    ],
    faqs: [
      { q: "What does Yang Fire mean in Four Pillars?", a: "Yang Fire (丙) is the active form of the Fire element, symbolised by the sun. As a Day Master it is associated with warmth, visibility, generosity, and a tendency to give more energy than one has." },
      { q: "Is Yang Fire the same as being a Fire sign in astrology?", a: "No. Western fire signs are decided by birth month; a Four Pillars Day Master is decided by birth day, within a different elemental system entirely. The overlap is metaphorical, not structural." },
      { q: "What drains Yang Fire?", a: "Tradition points to two things: having no one to shine on, and having no Wood — no long-term project or structure to burn on. Yang Fire without fuel consumes itself." },
    ],
  },

  {
    key: "ding", slug: "yin-fire", pe: "Yin Fire", cn: "丁", name: "The Candle",
    h1: "Yin Fire (丁): The Candle — Your Day Master",
    heroLine: "You see people. It's not always comfortable for them.",
    desc: "Yin Fire (丁), the Candle, is one of the ten Day Masters in Four Pillars — perceptive, refined, quietly magnetic. What it means, its shadow, and what supports it.",
    body: [
      { h: "Who Yin Fire is", b: [
        "Your Day Master is **Yin Fire** (丁, *hinoto*): the candle, the lamp, the hearth.",
        "The sun lights everything. Yin Fire lights *one thing, precisely* — one page, one face, one idea at a time. This is the tradition's sign of focused perception, and the classical texts describe it with a slight shiver: the candle shows what the darkness was hiding.",
        "Yin Fire people are associated with insight, refinement, and a quietly magnetic warmth that people confide in without quite knowing why. You are perceptive to a degree that other people find either wonderful or unnerving, depending on what you've noticed about them.",
      ] },
      { h: "Yin Fire at work", b: [
        "You are the one who sees the actual problem.",
        "Tradition associates this Day Master with analysts, editors, diagnosticians, designers, therapists — anyone whose value is in perceiving what everyone else is looking straight at and missing. Yin Fire doesn't illuminate broadly; it illuminates *correctly*.",
        "The difficulty is that this is hard to sell. The sun's contribution is obvious. The candle's contribution — \"I noticed the thing that would have killed the project\" — is invisible when it works. Yin Fire people often feel underestimated at work while being, quietly, indispensable.",
        "The classical counsel: choose the room. A candle in a floodlit hall is nothing. A candle in a dark room is everything.",
      ] },
      { h: "Yin Fire in love", b: [
        "You know things about people that they haven't told you.",
        "Yin Fire is read as intimate, attentive, and deeply loyal to a small number of people. You do not broadcast affection; you *concentrate* it. The people you love feel seen in a way most humans go their whole lives without experiencing.",
        "The shadow: you also see what they're hiding. Tradition warns that Yin Fire's perception is not always kind to Yin Fire — you notice the flicker of dishonesty, the small evasion, the thing they didn't say — and you can spend years reading a person's darkness with perfect clarity while staying exactly where you are.",
        "Seeing clearly is not the same as leaving. The old texts suggest Yin Fire people already know this.",
      ] },
      { h: "The shadow side", b: [
        "**Flicker.**",
        "A small flame is sensitive to every draft. Yin Fire is the most emotionally weather-dependent of the ten Day Masters — a careless remark, a cold room, a bad week, and the light guts and gutters.",
        "The tradition's advice is specific and unromantic: *guard your fuel.* Yin Fire people burn beautifully but not infinitely, and the classical failure mode is burning wherever the wind carries you — pouring perception into people and problems that never asked for it and won't thank you for it.",
        "Choose where to burn. That's the whole instruction.",
      ] },
      { h: "What supports you, and what drains you", b: [
        "In the five-element cycle:",
        { ul: [
          "**Wood feeds Fire.** The tree and the vine are your fuel. Yin Fire needs *material* — ideas, structures, people worth studying. Boredom is not a mood for you; it's starvation.",
          "**Fire creates Earth.** The mountain and the field are what your insight builds. Your seeing makes other people solid.",
          "**Water controls Fire.** The river and the fog challenge and cool you. For Yin Fire this can be genuinely dangerous — too much water and the candle goes out. Tradition advises Yin Fire to be careful of people and environments that are relentlessly rational, dismissive, or cold.",
          "**Fire melts Metal.** The axe and the jewel are what you work on and refine.",
        ] },
      ] },
      { h: "How your Day Master is calculated", b: [
        "Your Day Master comes from the **day** of your birth, not the year or month, calculated against the traditional solar calendar (the year begins at *Risshun*, in early February).",
      ] },
    ],
    faqs: [
      { q: "What does Yin Fire mean in Four Pillars?", a: "Yin Fire (丁) is the receptive form of the Fire element — the candle rather than the sun. As a Day Master it is associated with focused perception, insight, refinement, and emotional sensitivity." },
      { q: "Is Yin Fire weaker than Yang Fire?", a: "Different, not weaker. The tradition reads Yang Fire as broad and Yin Fire as precise. A candle can do things the sun cannot: it can be carried into a dark room." },
      { q: "Why is Yin Fire described as sensitive?", a: "Because a small flame responds to every draft. The classical texts treat this as the sign's cost of perception — you feel the room because you are reading it constantly." },
    ],
  },

  {
    key: "wu", slug: "yang-earth", pe: "Yang Earth", cn: "戊", name: "The Mountain",
    h1: "Yang Earth (戊): The Mountain — Your Day Master",
    heroLine: "You are the mountain others shelter against. Notice who is standing there.",
    desc: "Yang Earth (戊), the Mountain, is one of the ten Day Masters in Four Pillars — steady, protective, immovable. What it means, its shadow, and what supports it.",
    body: [
      { h: "Who Yang Earth is", b: [
        "Your Day Master is **Yang Earth** (戊, *tsuchinoe*): the mountain.",
        "Traditionally the most immovable of the ten. Steady, protective, slow to anger, and slower to change its mind. The classical texts return again and again to one image: people go to the mountain when the weather turns.",
        "Yang Earth accumulates dependents the way peaks accumulate snow. Colleagues, friends, entire families quietly organise themselves around your reliability — often without ever saying so, and often without you noticing until the weight is already there.",
      ] },
      { h: "Yang Earth at work", b: [
        "You are load-bearing.",
        "Tradition associates this Day Master with the roles that hold: operations, infrastructure, the senior person who has been there through three restructures and knows where everything actually is. Yang Earth is rarely the fastest-moving element in the room and almost always the reason the room is still standing.",
        "The difficulty is that mountains are not promoted. Stability is invisible until it fails, and organisations reward visible motion. Yang Earth people frequently find that the person who reorganised everything got the credit for what the mountain was already holding up.",
        "The classical counsel is not to become the storm. It is to *make the holding legible*.",
      ] },
      { h: "Yang Earth in love", b: [
        "Deeply steady, and easy to take for granted.",
        "Yang Earth loves through presence and reliability rather than declaration. You are the person who is there. Not dramatically — just, reliably, permanently there. Tradition reads this as one of the most durable forms of love in the system, and one of the most quietly under-appreciated.",
        "The shadow is that you will endure things you should not endure. A mountain does not leave. If a relationship becomes cold, or one-sided, or slowly extractive, Yang Earth's instinct is not to walk — it's to *hold*. The old texts do not romanticise this. Endurance and love are different things, and the mountain is capable of confusing them for decades.",
      ] },
      { h: "The shadow side", b: [
        "Inertia.",
        "The classical warning is exact: *a mountain confuses \"unmoving\" with \"right.\"* Yang Earth's great virtue — not being moved by every wind — becomes its great failure when the thing that needs to move is you.",
        "You will defend a position long after you have stopped believing in it, because changing it feels like collapse rather than growth. You will stay in the job, the city, the arrangement, because the alternative requires becoming a different shape.",
        "The tradition's answer is unexpectedly gentle: even mountains are reshaped — by water, by seasons, by time. The wise ones *cooperate with the weathering*. You don't have to move all at once. But you do have to let the water in.",
      ] },
      { h: "What supports you, and what drains you", b: [
        "In the five-element cycle:",
        { ul: [
          "**Fire creates Earth.** The sun and the candle feed you. Yang Earth needs warmth and inspiration from outside — you do not generate it internally, and you go grey without it. Find the people who burn.",
          "**Earth bears Metal.** The axe and the jewel are what you produce. Your stability is what lets other people be sharp.",
          "**Wood breaks Earth.** The tree and the vine challenge you — they root into you, draw from you, and change your shape. This feels like being used. Tradition reads it as being *cultivated*.",
          "**Earth controls Water.** The river and the fog are what you contain. You are what gives shape to other people's currents. Be careful not to dam what should flow.",
        ] },
      ] },
      { h: "How your Day Master is calculated", b: [
        "Your Day Master comes from the **day** of your birth — not the year, not the month — calculated against the traditional solar calendar, where the year begins at *Risshun* in early February.",
      ] },
    ],
    faqs: [
      { q: "What does Yang Earth mean in Four Pillars?", a: "Yang Earth (戊) is the active form of the Earth element, symbolised by a mountain. As a Day Master it is associated with stability, protection, endurance, and a resistance to change that is both its strength and its limit." },
      { q: "Is Yang Earth stubborn?", a: "Tradition frames it as immovability rather than stubbornness — but concedes the practical difference is small. The classical shadow is mistaking \"unmoving\" for \"correct.\"" },
      { q: "What does Yang Earth need?", a: "Fire. The tradition is clear that Earth does not generate its own warmth: Yang Earth without inspiration from outside becomes cold, heavy ground." },
    ],
  },

  {
    key: "ji", slug: "yin-earth", pe: "Yin Earth", cn: "己", name: "The Field",
    h1: "Yin Earth (己): The Field — Your Day Master",
    heroLine: "Everything growing around you is standing in you. Look at what you've grown.",
    desc: "Yin Earth (己), the Field, is one of the ten Day Masters in Four Pillars — nurturing, practical, quietly strategic. What it means, its shadow, and what supports it.",
    body: [
      { h: "Who Yin Earth is", b: [
        "Your Day Master is **Yin Earth** (己, *tsuchinoto*): the field, the garden soil.",
        "Where the mountain *endures*, the field **produces**. This is the tradition's sign of nurture, practicality, and the rare talent of making other things grow.",
        "Yin Earth people turn ideas into harvests. You quietly absorb seeds, water, neglect, and the occasional storm, and return something edible anyway. Tradition describes this Day Master as tolerant, resourceful, and considerably more strategic than it appears — soil looks passive right up until you notice that everything alive is standing in it.",
      ] },
      { h: "Yin Earth at work", b: [
        "You are the one who actually delivers.",
        "Tradition associates this Day Master with implementers, producers, project leads, and the people who take someone else's vision and turn it into a thing that exists. Yin Earth is not usually the person with the idea. Yin Earth is the reason the idea happened.",
        "The occupational hazard is obvious and the tradition names it: you become the ground everyone builds on, and grounds don't get credit. Worse, the more competently you absorb chaos, the more chaos you'll be given. Yin Earth people are the last to be protected in an organisation, because they always cope.",
      ] },
      { h: "Yin Earth in love", b: [
        "You make people better versions of themselves.",
        "Yin Earth loves through cultivation — you notice what someone could become, and you make the conditions for it. Partners of Yin Earth people frequently look back and realise their best decade happened while standing in this soil.",
        "The shadow: the field gives, and gives, and is not always asked what it needs. Tradition warns that Yin Earth people will nourish a relationship that is not nourishing them for years, quietly converting their own richness into someone else's growth — and calling it love, because it partly is.",
      ] },
      { h: "The shadow side", b: [
        "**Depletion.**",
        "The classical line is unsentimental: *a field that is always giving and never lying fallow loses its richness.*",
        "Yin Earth's failure is not dramatic. It's slow. Year by year, you give a little more, hold a little more, absorb a little more, and one day you notice that nothing grows in you anymore and you have no idea when that happened.",
        "The old texts are firm about the remedy, and it is the hardest instruction in the system: **Yin Earth must schedule its own off-seasons.** Not when things calm down — they won't. On purpose, in advance, against protest.",
        "Fallow is not laziness. It's how soil works.",
      ] },
      { h: "What supports you, and what drains you", b: [
        "In the five-element cycle:",
        { ul: [
          "**Fire creates Earth.** The sun and the candle feed you — warmth, inspiration, being *seen*. Yin Earth without Fire is cold ground: still capable, no longer generative.",
          "**Earth bears Metal.** The axe and the jewel come out of you. What you grow, other people sharpen.",
          "**Wood breaks Earth.** The tree and the vine draw directly from you. These are the relationships that take. Tradition doesn't call this bad — it calls it *the point of soil*. But it names the cost honestly.",
          "**Earth controls Water.** The river and the fog are what you contain and direct.",
        ] },
      ] },
      { h: "How your Day Master is calculated", b: [
        "Your Day Master comes from the **day** of your birth, calculated against the traditional solar calendar — the year begins at *Risshun*, in early February, not January 1st.",
      ] },
    ],
    faqs: [
      { q: "What does Yin Earth mean in Four Pillars?", a: "Yin Earth (己) is the receptive form of the Earth element — field or garden soil rather than mountain. As a Day Master it is associated with nurture, practicality, productivity, and a tendency toward self-depletion." },
      { q: "What is the difference between Yang Earth and Yin Earth?", a: "The mountain endures; the field produces. Yang Earth is read as protective and immovable, Yin Earth as generative and giving. They share stability but express it in opposite directions." },
      { q: "What depletes Yin Earth?", a: "Continuous giving without rest. The classical texts treat rest not as recovery but as necessary to the function — soil that never lies fallow stops being fertile." },
    ],
  },

  {
    key: "geng", slug: "yang-metal", pe: "Yang Metal", cn: "庚", name: "The Axe",
    h1: "Yang Metal (庚): The Axe — Your Day Master",
    heroLine: "You are the one they call when someone has to say it. They will call you again.",
    desc: "Yang Metal (庚), the Axe, is one of the ten Day Masters in Four Pillars — decisive, dutiful, allergic to ambiguity. What it means, its shadow, and what supports it.",
    body: [
      { h: "Who Yang Metal is", b: [
        "Your Day Master is **Yang Metal** (庚, *kanoe*): the axe, the sword, the raw ore.",
        "Metal exists to cut. The classical texts do not soften this: Yang Metal is the element of decisive action, and the tradition treats it as a tool rather than a temperament.",
        "Yang Metal people are described as decisive, dutiful, and allergic to ambiguity — bringing an almost surgical clarity to messes that paralyse everyone else. Where others see a difficult situation, you see the cut that resolves it, and you frequently cannot understand why nobody else has made it yet.",
      ] },
      { h: "Yang Metal at work", b: [
        "You are the one who ends things.",
        "Bad projects, bad hires, bad strategies, meetings that should have finished twenty minutes ago. Tradition associates this Day Master with executives, surgeons, editors, and anyone whose job requires saying no with a straight face. Yang Metal is comfortable in the moment everyone else is avoiding.",
        "This makes you valuable and slightly feared, and the tradition notes both. The failure mode is that an organisation will use you as its blade — sending you to deliver every hard message — and then quietly resent you for the cuts they asked you to make.",
        "The classical counsel: know whose hand is on the handle.",
      ] },
      { h: "Yang Metal in love", b: [
        "Loyal in the sworn-oath sense.",
        "Yang Metal does not do casual. Tradition reads this Day Master as fiercely committed, protective, and honest to a degree that some people experience as an assault. You will tell your partner the true thing. You will assume this is love, and you will be right, and it will still land badly.",
        "The shadow is sharpness without a sheath. The same edge that cuts through a problem nicks the person standing next to it. Yang Metal people are often genuinely bewildered by the damage they do — because the cut was *accurate*, and accuracy felt like kindness from the inside.",
      ] },
      { h: "The shadow side", b: [
        "**Rigidity, and the tyranny of the correct.**",
        "Yang Metal's classical failure is intolerance for excuses — including, inconveniently, its own. You hold a hard line, and you hold it against yourself first, which is why you feel entitled to hold it against everyone else.",
        "But the old texts have an unusual note of comfort for this sign: *metal is refined by fire and polished by friction.* Your hardest seasons — the ones where you were pressured, opposed, ground down — are traditionally read as the ones that gave you your finish. Yang Metal that has never been tested is not sharp. It's just hard.",
        "Which means the people who resist you are not your enemies. They're your forge.",
      ] },
      { h: "What supports you, and what drains you", b: [
        "In the five-element cycle:",
        { ul: [
          "**Earth bears Metal.** The mountain and the field feed you — stability, ground, patient people who don't flinch. Yang Metal without Earth is a blade with no handle.",
          "**Metal enriches Water.** The river and the fog are what you produce. Your clarity becomes other people's depth.",
          "**Fire melts Metal.** The sun and the candle challenge you — heat, emotion, people who won't be resolved by a decision. This feels like chaos. Tradition reads it as *tempering*.",
          "**Metal cuts Wood.** The tree and the vine are what you shape. You prune people, often usefully, occasionally fatally.",
        ] },
      ] },
      { h: "How your Day Master is calculated", b: [
        "Your Day Master comes from the **day** of your birth, calculated against the traditional solar calendar (the year turns at *Risshun*, early February).",
      ] },
    ],
    faqs: [
      { q: "What does Yang Metal mean in Four Pillars?", a: "Yang Metal (庚) is the active form of the Metal element — the axe or unrefined ore. As a Day Master it is associated with decisiveness, justice, loyalty, and a bluntness that can cut both ways." },
      { q: "Is Yang Metal harsh?", a: "Tradition frames it as unambiguous rather than harsh — but acknowledges the effect on other people is often the same. The classical shadow is \"sharpness without a sheath.\"" },
      { q: "What refines Yang Metal?", a: "Fire. The old texts are consistent: Metal is made by pressure and heat. The seasons that were hardest on you are traditionally read as the ones that made you usable." },
    ],
  },

  {
    key: "xin", slug: "yin-metal", pe: "Yin Metal", cn: "辛", name: "The Jewel",
    h1: "Yin Metal (辛): The Jewel — Your Day Master",
    heroLine: "You notice the flaw. Try not to point it at yourself.",
    desc: "Yin Metal (辛), the Jewel, is one of the ten Day Masters in Four Pillars — precise, aesthetic, exacting. What it means, its shadow, and what supports it.",
    body: [
      { h: "Who Yin Metal is", b: [
        "Your Day Master is **Yin Metal** (辛, *kanoto*): the jewel, the needle, the finely worked blade.",
        "This is traditionally the most exacting of the ten. Precise, aesthetic, quietly proud, and deeply sensitive to quality in all things — including, the texts note pointedly, the quality of how you are treated.",
        "Yin Metal has a needle's gift: small, elegant interventions that hold entire garments together. And a jeweller's eye for the flaw no one else can see. You walk into a room and register, involuntarily, everything that is slightly wrong in it.",
      ] },
      { h: "Yin Metal at work", b: [
        "You are the standard.",
        "Tradition associates this Day Master with craft, curation, and quality control in the broadest sense — designers, editors, specialists, the person whose approval means the thing is actually finished. Yang Metal cuts. Yin Metal *refines*.",
        "The work you do is often the difference between competent and excellent, and it is almost impossible to explain to anyone who cannot see it. Yin Metal people frequently find themselves in rooms where they are the only one who knows the work isn't good enough, arguing for a standard they cannot make legible.",
        "The classical counsel is bleak and useful: some rooms will never see it. Find the ones that do, and stop trying to educate the rest.",
      ] },
      { h: "Yin Metal in love", b: [
        "Selective, elegant, and slower to trust than anyone realises.",
        "Yin Metal does not give itself away. Tradition reads this Day Master as intensely loyal to a small number of people, and quietly devastated by carelessness — a thoughtless remark from someone you love does more damage than an insult from a stranger.",
        "The shadow: you notice the flaws in your partner too. Every one of them. And the tradition warns that Yin Metal's precision, pointed at the person closest to you, can slowly file them down. What feels like helping them improve can arrive as never being enough.",
      ] },
      { h: "The shadow side", b: [
        "**The eye, turned inward.**",
        "Yin Metal's great gift — seeing the flaw — becomes its great cruelty when there is no other object in the room. The tradition is unusually direct about this: the sign that detects imperfection everywhere will detect it most reliably in the mirror.",
        "Yin Metal people are prone to a specific and grinding form of self-criticism: not \"I am bad,\" but \"this is not yet good enough\" — repeated, indefinitely, about everything, including themselves.",
        "The old texts offer this sign an unexpectedly tender line, and it is worth sitting with:",
        "*A gem is not diminished by an imperfect setting. It is simply waiting to be reset.*",
        "The flaw you keep seeing in yourself may not be a flaw. It may be a room that does not suit you.",
      ] },
      { h: "What supports you, and what drains you", b: [
        "In the five-element cycle:",
        { ul: [
          "**Earth bears Metal.** The mountain and the field are your ground. Yin Metal needs stability and patience around it — chaotic environments do not just annoy you, they degrade you.",
          "**Metal enriches Water.** The river and the fog come from you. Your precision becomes other people's clarity.",
          "**Fire melts Metal.** The sun and the candle challenge you. Heat, emotion, the unresolvable. Tradition reads this as necessary and painful in equal measure: the jewel is *cut* by fire.",
          "**Metal cuts Wood.** The tree and the vine are what you shape and refine.",
        ] },
      ] },
      { h: "How your Day Master is calculated", b: [
        "Your Day Master comes from the **day** of your birth, calculated against the traditional solar calendar — the year begins at *Risshun*, in early February.",
      ] },
    ],
    faqs: [
      { q: "What does Yin Metal mean in Four Pillars?", a: "Yin Metal (辛) is the receptive form of the Metal element — the jewel or needle rather than the axe. As a Day Master it is associated with precision, refinement, aesthetic sensitivity, and a critical eye that turns easily inward." },
      { q: "What is the difference between Yang Metal and Yin Metal?", a: "Yang Metal cuts; Yin Metal refines. The axe resolves situations by force of decision. The jewel improves them by noticing what is imperfect." },
      { q: "Why is Yin Metal associated with self-criticism?", a: "Because the sign's defining capacity is flaw-detection. The tradition treats this as an occupational hazard of precision, not a character defect." },
    ],
  },

  {
    key: "ren", slug: "yang-water", pe: "Yang Water", cn: "壬", name: "The River",
    h1: "Yang Water (壬): The River — Your Day Master",
    heroLine: "You don't push through walls. You outlast them.",
    desc: "Yang Water (壬), the River, is one of the ten Day Masters in Four Pillars — restless, intelligent, hard to contain. What it means, its shadow, and what supports it.",
    body: [
      { h: "Who Yang Water is", b: [
        "Your Day Master is **Yang Water** (壬, *mizunoe*): the ocean, the great river.",
        "Big water is always going somewhere, and it takes the landscape with it. This is the tradition's sign of vast intelligence, restlessness, and momentum — the element that cannot be held, only channelled.",
        "Yang Water people think in currents rather than steps. Ideas arrive in floods. Plans reroute overnight. Standing still feels faintly unnatural, and the tradition suggests it is: rivers that stop become swamps.",
      ] },
      { h: "Yang Water at work", b: [
        "You are the one who sees around the corner.",
        "Tradition associates this Day Master with strategists, entrepreneurs, writers, and anyone whose work is fundamentally about *movement* — spotting where the world is going and getting there first. Yang Water is persuasive, adaptive, and difficult to contain, and organisations either build around you or lose you.",
        "The difficulty is finishing. The river is always going somewhere new, and Yang Water people accumulate brilliant half-things: the project that was nearly great, the idea that got replaced by a better idea, the company that pivoted four times.",
        "The classical counsel is one word: **banks**. Not fewer ideas — *constraints*. The river that accepts its banks is the one that reaches the sea.",
      ] },
      { h: "Yang Water in love", b: [
        "Magnetic, generous, and hard to hold.",
        "Yang Water is read as charming and genuinely interested in people — you are curious about your partner in a way that flatters and delights. You also, the tradition notes, tend to arrive like weather and leave like it.",
        "The shadow is not infidelity. It's *diffusion of attention*. Yang Water can be entirely present and entirely elsewhere at the same time, and the people who love you learn to recognise the moment your current changes direction. The old texts advise Yang Water to make its commitments deliberately and structurally — because the water will not naturally stay.",
      ] },
      { h: "The shadow side", b: [
        "**The flood.**",
        "Force without banks scatters its own power. Yang Water's failure is not weakness — it's *excess without direction*: ten projects, six friendships, three cities, endless motion, and at the end of it, no delta. Nothing arrived anywhere.",
        "The tradition does not tell Yang Water to slow down. It tells you to choose a shape. The Nile is not more powerful than a flood; it is more *consequential*, because it goes somewhere every year for a thousand years.",
        "Pick a sea.",
      ] },
      { h: "What supports you, and what drains you", b: [
        "In the five-element cycle:",
        { ul: [
          "**Metal enriches Water.** The axe and the jewel feed you — precision, structure, people who insist on standards. Yang Water without Metal is volume without clarity.",
          "**Water grows Wood.** The tree and the vine are what you nourish. You make other people's projects possible, often without noticing you did.",
          "**Earth controls Water.** The mountain and the field challenge you — they contain, constrain, and slow you. This feels like being blocked. Tradition reads it as *being given a course*.",
          "**Water controls Fire.** The sun and the candle are what you cool and govern. You are the perspective that stops other people from burning down.",
        ] },
      ] },
      { h: "How your Day Master is calculated", b: [
        "Your Day Master comes from the **day** of your birth, calculated against the traditional solar calendar (the year turns at *Risshun*, in early February).",
      ] },
    ],
    faqs: [
      { q: "What does Yang Water mean in Four Pillars?", a: "Yang Water (壬) is the active form of the Water element — the ocean or great river. As a Day Master it is associated with intelligence, momentum, adaptability, and a restlessness that resists containment." },
      { q: "Is Yang Water unreliable?", a: "Tradition frames it as mobile rather than unreliable — but the practical effect on other people can be similar. The classical counsel is not to move less, but to choose a direction and accept banks." },
      { q: "What does Yang Water need?", a: "Structure. The old texts are consistent: water without banks floods and disperses. Yang Water thrives with constraints it chose on purpose." },
    ],
  },

  {
    key: "gui", slug: "yin-water", pe: "Yin Water", cn: "癸", name: "The Fog",
    h1: "Yin Water (癸): The Fog — Your Day Master",
    heroLine: "No one saw you coming. That was never an accident.",
    desc: "Yin Water (癸), the Fog, is one of the ten Day Masters in Four Pillars — intuitive, imaginative, quietly pervasive. What it means, its shadow, and what supports it.",
    body: [
      { h: "Who Yin Water is", b: [
        "Your Day Master is **Yin Water** (癸, *mizunoto*): the rain, the mist, the mountain spring.",
        "The subtlest of the ten. Intuitive, imaginative, and quietly pervasive — the fog has occupied the whole valley before anyone noticed it arriving.",
        "Yin Water people understand things *sideways*: through feeling, pattern, and atmosphere rather than argument. This is the tradition's sign of dreamers, healers, artists, and readers of rooms — and the texts are careful to note that its gentleness is routinely underestimated. Rain, after all, is what carves canyons.",
      ] },
      { h: "Yin Water at work", b: [
        "You know things before you can justify them.",
        "Tradition associates this Day Master with the kinds of work where perception matters more than force: research, therapy, art, writing, the strategic role where someone has to feel where the whole thing is heading. Yin Water people are frequently right long before they can explain why, which is a professional liability in most rooms and a superpower in the right one.",
        "The occupational difficulty is credibility. You arrive at the correct answer through a process nobody can audit, and organisations trust what they can audit. Yin Water people learn, painfully, to *reverse-engineer* their intuitions into arguments — and to watch someone else present the conclusion three months later to applause.",
      ] },
      { h: "Yin Water in love", b: [
        "You feel what they're feeling before they say it.",
        "Yin Water loves attentively and atmospherically. You do not need to be told there's a problem; you knew on Tuesday. Partners describe this as being deeply understood, and occasionally as being unable to hide.",
        "The shadow is that fog does not have edges. Yin Water can merge into a partner so completely that the boundary disappears — absorbing their moods, their goals, their weather, until there is no clear question of what *you* wanted. And because you are so good at feeling other people, you may not notice this happening for years.",
      ] },
      { h: "The shadow side", b: [
        "**Dissipation.**",
        "Mist can drift anywhere, which is not the same as arriving.",
        "Yin Water's classical failure is a life that is beautiful, perceptive, kind, and *unaccumulated*. The insight goes nowhere. The talent goes nowhere. The years pass in a fine gray light and nothing is built, not because you lacked ability, but because you never chose a vessel.",
        "The old texts are unusually gentle with this sign, and unusually firm:",
        "*Yin Water does best with a vessel — one clear intention to gather itself into.*",
        "Not ten. One. Fog that condenses becomes a stream. A stream carves stone.",
      ] },
      { h: "What supports you, and what drains you", b: [
        "In the five-element cycle:",
        { ul: [
          "**Metal enriches Water.** The axe and the jewel feed you — precision, standards, people who will not accept vagueness. Yin Water without Metal never sharpens into anything.",
          "**Water grows Wood.** The tree and the vine are what you nourish. Your perception makes other people's growth possible.",
          "**Earth controls Water.** The mountain and the field challenge you — they contain and direct. This can feel oppressive. Tradition reads it as *the vessel*.",
          "**Water controls Fire.** The sun and the candle are what you cool. You are the one who tells the burning person to rest.",
        ] },
      ] },
      { h: "How your Day Master is calculated", b: [
        "Your Day Master comes from the **day** of your birth — not the year, not the month — calculated against the traditional solar calendar, where the year begins at *Risshun* in early February.",
      ] },
    ],
    faqs: [
      { q: "What does Yin Water mean in Four Pillars?", a: "Yin Water (癸) is the receptive form of the Water element — rain, mist, or a mountain spring. As a Day Master it is associated with intuition, imagination, emotional perception, and a tendency to disperse." },
      { q: "What is the difference between Yang Water and Yin Water?", a: "The river moves; the fog pervades. Yang Water is read as momentum and force, Yin Water as perception and subtlety. Both are hard to contain, for opposite reasons." },
      { q: "Why is Yin Water called the subtlest Day Master?", a: "Because its influence is atmospheric rather than direct. The classical image is fog: it has filled the valley before anyone noticed it arriving." },
    ],
  },
];
