export type Vibe = "water" | "snow" | "culture" | "green";

export type DateIdea = { title: string; when: "Morning" | "Afternoon" | "Sunset" | "Night" | "All day"; text: string };

export type Romance = {
  slug: string;
  /** Short line that sells the feeling, not the logistics. */
  line: string;
  vibes: Vibe[];
  /** Things a couple can do together, written as small scenes. */
  dates: DateIdea[];
  /** Little touches we can usually arrange on request. Confirmed in your quote. */
  touches: string[];
  /** A plain, honest note a couple should know before choosing. */
  honest: string;
  /** Not suited to some occasions. */
  notBabymoon?: boolean;
};

/** Romantic angle for each destination. Plans are confirmed in your personal quote. */
export const romance: Romance[] = [
  {
    slug: "maldives",
    line: "A whole island with nothing to do but each other.",
    vibes: ["water"],
    dates: [
      { title: "Sandbank for two", when: "Afternoon", text: "A small boat drops you on a ribbon of white sand in the middle of the lagoon. Bring a picnic, swim in water so clear it looks painted and leave when the tide asks you to." },
      { title: "Snorkel the house reef together", when: "Morning", text: "Wade in from the beach, put your faces in the water and follow the same turtle. It is the easiest first adventure you will ever share." },
      { title: "Dinner with your feet in the sand", when: "Night", text: "A table set on the beach, lanterns, the sound of the sea. This is the evening everyone remembers when they describe the trip." },
      { title: "Sunrise from the water villa deck", when: "Morning", text: "Coffee, a hammock and the lagoon turning from grey to gold. Do absolutely nothing until breakfast." },
      { title: "A couples' spa, as slow as you like", when: "Afternoon", text: "Treatments in a sea-facing room, side by side. A good way to use one of the quiet afternoons the islands hand you." },
    ],
    touches: ["Flower and towel decoration in your villa", "Private beach dinner", "Sunset cruise or sandbank picnic", "A cake or surprise for an anniversary"],
    honest: "Resorts sit on their own islands, so the trip is quiet by design. If you want nightlife or markets, mix it with a night in Malé or choose another destination.",
  },
  {
    slug: "kashmir",
    line: "Snow-capped mountains, still water and one shared blanket.",
    vibes: ["snow", "green"],
    dates: [
      { title: "A shikara at sundown", when: "Sunset", text: "Cushions, a canopy and a boatman who knows when to stop talking. Dal Lake goes copper and the mountains turn violet. Bring a shawl." },
      { title: "A night on a houseboat", when: "Night", text: "Carved cedar ceilings, a window onto the water and a wazwan dinner. It feels like staying inside an old story." },
      { title: "The Gulmarg gondola", when: "All day", text: "The ride lifts you into a different season. In winter it is snow and laughter, in summer it is meadows and wildflowers." },
      { title: "Walk the Mughal gardens", when: "Morning", text: "Fountains, chinar trees and terraces built for exactly this: slow walks with someone you like. Go early before the tour buses." },
      { title: "Pahalgam by the river", when: "Afternoon", text: "A pony ride, a riverside picnic and a lot of blue water. Pahalgam is the soft day of the trip." },
    ],
    touches: ["Houseboat night with a candlelit dinner", "Traditional Kashmiri dress photoshoot", "Warm room set-up and flowers", "A private shikara slot at sunset"],
    honest: "Weather and road conditions decide a lot in Kashmir. We build slack into the days and tell you honestly which months suit snow and which suit meadows.",
  },
  {
    slug: "bali",
    line: "Jungle mornings, temple sunsets and a pool that is yours.",
    vibes: ["green", "water", "culture"],
    dates: [
      { title: "Rice terraces at first light", when: "Morning", text: "Beat the crowds to the terraces near Ubud. Mist, palms, green on green. Finish with coffee overlooking the valley." },
      { title: "A private pool breakfast", when: "Morning", text: "Breakfast floating on the water, flowers on top. It is on every Bali wish list for a reason." },
      { title: "Sunset at a sea temple", when: "Sunset", text: "Waves around the rock, a sky going orange and a small crowd all looking the same way. Arrive early for a good spot." },
      { title: "A cooking class for two", when: "Afternoon", text: "Shop in the market, grind the spice paste and eat what you made. Funnier and more romantic than it sounds." },
      { title: "A candlelit dinner above the jungle", when: "Night", text: "A table at the edge of a ravine, frogs and fireflies for background music. Dress up a little." },
    ],
    touches: ["Flower bath or villa decoration", "Floating breakfast", "Couples' massage", "A private driver for the full trip"],
    honest: "Bali traffic is real. Staying in one or two bases and using a private driver makes the trip calmer than hopping between many places.",
  },
  {
    slug: "munnar-alleppey",
    line: "Tea hills in the morning, a houseboat for two by afternoon.",
    vibes: ["green", "water"],
    dates: [
      { title: "Tea estates in the mist", when: "Morning", text: "Walk between rows of tea with the clouds at your knees. Chai tastes better when it is brewed ten steps from where it grew." },
      { title: "A lakeside evening", when: "Sunset", text: "Mattupetty lake at golden hour, a paddle boat and nowhere to be. The cool air does the rest." },
      { title: "A private houseboat", when: "All day", text: "Your own boat, a cook and a canopy. Drift past villages while lunch is made in the galley." },
      { title: "A Kerala meal on the water", when: "Afternoon", text: "Fish curry, banana-leaf rice and a slow canal. A very good way to start a long afternoon nap." },
      { title: "Fort Kochi at night", when: "Night", text: "Old streets, lit-up cafés and sea air. Hold hands, get a little lost." },
    ],
    touches: ["Houseboat with a candlelit dinner", "Flower decoration in your room", "Ayurvedic couples' massage", "A cake for an anniversary"],
    honest: "Houseboat air-conditioning usually runs only at night, and monsoon months suit some couples more than others. We will match the month to your taste.",
  },
  {
    slug: "udaipur-jaipur",
    line: "Palaces on a lake, a sky full of lanterns, a story to retell.",
    vibes: ["culture"],
    dates: [
      { title: "Lake Pichola at golden hour", when: "Sunset", text: "A boat ride with the City Palace glowing and the lake going gold. Udaipur is built for this exact moment." },
      { title: "A rooftop dinner facing the palace", when: "Night", text: "Candles, a lit-up skyline and slow service. Book early. The good tables go first." },
      { title: "Amber Fort at dawn", when: "Morning", text: "Climb up while the light is soft and the crowds are not. The walls change colour as the sun comes up." },
      { title: "A block-print workshop together", when: "Afternoon", text: "Press your own pattern on cloth in a family studio. You leave with a keepsake you actually made." },
      { title: "Wander the pink bazaars", when: "Afternoon", text: "Bangles, jutis, spices. Get lost, bargain gently and share a lassi." },
    ],
    touches: ["Heritage hotel with a lake view", "Rooftop candlelight dinner", "Traditional dress photoshoot", "Cultural evening with folk music"],
    honest: "Summer afternoons are properly hot. Winter and early spring are kindest, and we plan outdoor time for mornings and evenings.",
  },
  {
    slug: "andaman",
    line: "White sand, clear water and a beach that is mostly yours.",
    vibes: ["water"],
    dates: [
      { title: "Radhanagar at sunset", when: "Sunset", text: "A long, wide, quiet beach with a bright sky. Walk it barefoot together and watch the colours change." },
      { title: "Snorkel at Elephant Beach", when: "Morning", text: "Boat out, masks on, a reef full of colour a few strokes from the sand. A good first underwater date." },
      { title: "Kayak among the mangroves", when: "Morning", text: "Quiet water, tangled roots and egrets. Paddle slowly and talk quietly." },
      { title: "A beach dinner at a quiet shack", when: "Night", text: "Grilled fish, bare feet and a sky that goes on forever. Keep your phone in your bag." },
      { title: "Cellular Jail and the light show", when: "Night", text: "Not romantic, but moving, and the kind of thing couples talk about after the trip." },
    ],
    touches: ["Candlelit beach dinner", "Underwater photoshoot", "Room decoration", "A private cruise or a quiet beach day"],
    honest: "Ferries and sea conditions set the rhythm in the Andamans. We build a flexible plan and tell you early if the sea says no.",
  },
  {
    slug: "coorg",
    line: "Coffee hills, cool mornings and an evening just for two.",
    vibes: ["green"],
    dates: [
      { title: "A sunrise jeep safari", when: "Morning", text: "Wake before the birds, climb into a jeep and watch the hills turn gold. The best way to earn breakfast." },
      { title: "A candlelit dinner with wine", when: "Night", text: "A table set for two among the coffee bushes, lanterns and low music. Our Coorg package includes one evening like this." },
      { title: "A waterfall walk", when: "Afternoon", text: "Abbey Falls, the sound of water and a short walk back for chai. Gentle enough for any pace." },
      { title: "Coffee estate tasting", when: "Morning", text: "Learn how your cup is made, from plant to roast. Buy a bag for the road home." },
      { title: "A blanket, a book and a balcony", when: "All day", text: "Coorg rewards doing nothing well. Plan one slow day. You will not regret it." },
    ],
    touches: ["Candlelit dinner with wine", "Bonfire evening", "Room decoration", "A private estate stay"],
    honest: "Roads wind a lot, so travel days can be tiring if you tend to get carsick. We plan generous breaks.",
  },
  {
    slug: "pondicherry",
    line: "Pastel streets, sea breeze and long lunches.",
    vibes: ["culture", "water"],
    dates: [
      { title: "Sunrise on the Promenade", when: "Morning", text: "Walk the seafront before the heat, then find a café for filter coffee. A calm beginning for any couple." },
      { title: "Cycle through the French Quarter", when: "Morning", text: "Yellow walls, bougainvillea and quiet lanes. Stop whenever something looks pretty, which is often." },
      { title: "A long lunch in a courtyard cafe", when: "Afternoon", text: "A shaded garden, crusty bread and nowhere to be. Share too much dessert." },
      { title: "Auroville, softly", when: "Afternoon", text: "Visit the Matrimandir viewpoint and wander the green lanes nearby. Different from anything else in town." },
      { title: "A seafood dinner by the sea", when: "Night", text: "Grilled fish, a breeze and music from a nearby place. Take the slow way home." },
    ],
    touches: ["Heritage villa stay", "Candlelit rooftop dinner", "Bike tour for two", "A sunrise photo walk"],
    honest: "Pondicherry is small. It is perfect for a short getaway, and for a longer honeymoon it works best as the first or last stop.",
  },
];

export const getRomance = (slug: string) => romance.find((r) => r.slug === slug);

export const occasions = [
  { id: "honeymoon", label: "Honeymoon", note: "Just married. We keep it unhurried, with the little touches you would like." },
  { id: "anniversary", label: "Anniversary", note: "Tell us the number and we will make the trip feel like a celebration." },
  { id: "babymoon", label: "Babymoon", note: "A gentler pace, shorter transfers and no high altitude. We will ask about your doctor's advice." },
  { id: "just-us", label: "Just us", note: "No occasion needed. A first trip together or a long-overdue escape." },
] as const;
