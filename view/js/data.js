// Heritage Sites Data Model
export const heritageSites = [
    {
        key: "hampi",
        name: "Hampi (Group of Monuments)",
        category: "UNESCO",
        era: "Vijayanagara (14th–16th c.)",
        coords: [15.335, 76.462],
        highlights: [
            "Virupaksha & Vittala complexes",
            "Royal enclosures & tanks",
            "Stone chariot and monolithic sculptures"
        ],
        videoUrl: "",
        description: {
            history: "Hampi was the capital of the Vijayanagara Empire, one of the largest and wealthiest kingdoms in medieval India. The city flourished between the 14th and 16th centuries, with over 1,600 monuments spread across 26 square kilometers. It was a center of trade, culture, and religion, attracting merchants and pilgrims from across the world.",
            architecture: "The architecture of Hampi is characterized by its massive stone structures, intricate carvings, and unique blend of Dravidian and Islamic styles. The monuments include temples, palaces, markets, and water systems, all built using locally available granite. The Vitthala Temple's stone chariot and musical pillars are engineering marvels.",
            timeline: [
                { year: "1336", event: "Foundation of Vijayanagara Empire" },
                { year: "1509-1529", event: "Peak under Krishnadevaraya" },
                { year: "1565", event: "Battle of Talikota - Empire's decline" },
                { year: "1986", event: "UNESCO World Heritage Site designation" }
            ]
        }
    },
    {
        key: "pattadakal",
        name: "Pattadakal Group of Monuments",
        category: "UNESCO",
        era: "Chalukya (7th–8th c.)",
        coords: [15.948, 75.816],
        highlights: [
            "Mix of Dravidian and Nagara architecture",
            "Virupaksha and Mallikarjuna temples",
            "UNESCO World Heritage Site"
        ],
        videoUrl: "",
        description: {
            history: "Pattadakal was a royal city of the Chalukya dynasty, serving as a coronation site for kings. The temple complex represents a unique fusion of northern (Nagara) and southern (Dravidian) architectural styles, showcasing the cultural synthesis of ancient India.",
            architecture: "The monuments feature intricate stone carvings, elaborate pillars, and beautifully sculpted panels depicting scenes from Hindu epics. The Virupaksha Temple is the largest and most elaborate, while the Papanatha Temple shows a blend of both architectural styles.",
            timeline: [
                { year: "7th century", event: "Early Chalukya period construction" },
                { year: "8th century", event: "Peak architectural development" },
                { year: "1987", event: "UNESCO World Heritage Site" }
            ]
        }
    },
    {
        key: "badami",
        name: "Badami Cave Temples",
        category: "Heritage",
        era: "Chalukya (6th–7th c.)",
        coords: [15.920, 75.679],
        highlights: [
            "Four rock-cut cave temples",
            "Ancient Hindu and Jain sculptures",
            "Agastya Lake and fort complex"
        ],
        videoUrl: "",
        description: {
            history: "Badami was the capital of the early Chalukya dynasty. The cave temples carved out of sandstone cliffs represent some of the earliest examples of Hindu temple architecture in South India. The site includes four main caves dedicated to Hindu deities and Jain Tirthankaras.",
            architecture: "The caves are carved into the red sandstone cliffs, featuring pillared halls, intricately carved ceilings, and large sculptural panels. The architecture demonstrates the transition from rock-cut to structural temple building in South India.",
            timeline: [
                { year: "540 CE", event: "Foundation of Badami by Pulakeshin I" },
                { year: "6th-7th century", event: "Cave temple construction" },
                { year: "8th century", event: "Decline after Pallava conquest" }
            ]
        }
    },
    {
        key: "belur",
        name: "Belur Chennakeshava Temple",
        category: "Heritage",
        era: "Hoysala (12th c.)",
        coords: [13.165, 75.865],
        highlights: [
            "Exquisite Hoysala architecture",
            "Intricate stone carvings",
            "Dancing figures and narrative panels"
        ],
        videoUrl: "",
        description: {
            history: "Belur was the first capital of the Hoysala Empire. The Chennakeshava Temple, built by King Vishnuvardhana, is considered one of the finest examples of Hoysala architecture. It took 103 years to complete and features thousands of intricate carvings.",
            architecture: "The temple is built on a star-shaped platform (stellate) and features a unique style with lathe-turned pillars, detailed friezes, and sculptures that appear to be in motion. The craftsmanship is so fine that it's said the sculptures were polished with sandalwood paste.",
            timeline: [
                { year: "1117 CE", event: "Temple construction begins" },
                { year: "1220 CE", event: "Temple completion" },
                { year: "12th century", event: "Hoysala architectural peak" }
            ]
        }
    },
    {
        key: "halebidu",
        name: "Halebidu Hoysaleswara Temple",
        category: "Proposed UNESCO",
        era: "Hoysala (12th c.)",
        coords: [13.216, 75.993],
        highlights: [
            "Largest Hoysala temple",
            "Over 20,000 sculptures",
            "Proposed UNESCO site"
        ],
        videoUrl: "",
        description: {
            history: "Halebidu (meaning 'old capital') was the second capital of the Hoysala Empire. The Hoysaleswara Temple, dedicated to Shiva, is one of the largest temples built by the Hoysalas and represents the pinnacle of their architectural achievement.",
            architecture: "The temple features two identical shrines, intricate carvings covering every surface, and a unique soapstone construction that allowed for fine detailing. The temple walls are covered with narrative panels depicting Hindu epics and mythology.",
            timeline: [
                { year: "1121 CE", event: "Temple construction begins" },
                { year: "12th century", event: "Peak Hoysala period" },
                { year: "1311 CE", event: "Sacked by Malik Kafur" }
            ]
        }
    },
    {
        key: "mysore-palace",
        name: "Mysore Palace",
        category: "Heritage",
        era: "Wodeyar Dynasty (20th c.)",
        coords: [12.305, 76.653],
        highlights: [
            "Indo-Saracenic architecture",
            "Illuminated during Dasara",
            "Royal residence of Wodeyars"
        ],
        videoUrl: "",
        description: {
            history: "The Mysore Palace, also known as Amba Vilas Palace, is the official residence of the Wodeyar dynasty. The current structure was built between 1897 and 1912 after a fire destroyed the previous wooden palace. It's one of India's most visited monuments.",
            architecture: "The palace combines Hindu, Muslim, Rajput, and Gothic architectural styles. It features three-story stone structure with marble domes and a 145-foot five-story tower. The interior is adorned with intricate carvings, paintings, and stained glass windows.",
            timeline: [
                { year: "1399", event: "Wodeyar dynasty established" },
                { year: "1897", event: "Fire destroys old palace" },
                { year: "1912", event: "Current palace completed" }
            ]
        }
    },
    {
        key: "sravanabelagola",
        name: "Shravanabelagola",
        category: "Heritage",
        era: "Ganga Dynasty (10th c.)",
        coords: [12.858, 76.488],
        highlights: [
            "57-foot monolithic Gommateshwara statue",
            "Important Jain pilgrimage center",
            "Mahamastakabhisheka festival"
        ],
        videoUrl: "",
        description: {
            history: "Shravanabelagola is one of the most important Jain pilgrimage centers in South India. The site is famous for its massive monolithic statue of Lord Bahubali (Gommateshwara), which stands at 57 feet tall and is one of the largest free-standing statues in the world.",
            architecture: "The statue is carved from a single block of granite and stands on Vindhyagiri Hill. The site includes numerous Jain temples, inscriptions, and monuments spanning over a millennium. The architecture reflects various periods of Jain art and culture.",
            timeline: [
                { year: "981 CE", event: "Gommateshwara statue consecrated" },
                { year: "10th century", event: "Ganga dynasty period" },
                { year: "Every 12 years", event: "Mahamastakabhisheka festival" }
            ]
        }
    },
    {
        key: "bijapur",
        name: "Bijapur Gol Gumbaz",
        category: "Heritage",
        era: "Adil Shahi (17th c.)",
        coords: [16.824, 75.715],
        highlights: [
            "World's second largest dome",
            "Whispering gallery",
            "Adil Shahi architecture"
        ],
        videoUrl: "",
        description: {
            history: "Gol Gumbaz is the mausoleum of Mohammed Adil Shah, the seventh ruler of the Adil Shahi dynasty. The monument is famous for its massive dome, which is the second largest in the world (after St. Peter's Basilica in Rome) and its unique whispering gallery.",
            architecture: "The structure features a square base with a massive hemispherical dome. The whispering gallery has remarkable acoustic properties where even the slightest sound echoes multiple times. The architecture is a fine example of Deccan Islamic style.",
            timeline: [
                { year: "1626", event: "Construction begins" },
                { year: "1656", event: "Completion of Gol Gumbaz" },
                { year: "17th century", event: "Adil Shahi architectural peak" }
            ]
        }
    },
    {
        key: "belur-halebidu",
        name: "Belur and Halebidu (Hoysala Temples)",
        category: "Proposed UNESCO",
        era: "Hoysala (12th c.)",
        coords: [13.190, 75.929],
        highlights: [
            "Twin Hoysala temple complexes",
            "Masterpiece of Indian temple architecture",
            "Proposed for UNESCO World Heritage"
        ],
        videoUrl: "",
        description: {
            history: "Belur and Halebidu represent the pinnacle of Hoysala architecture. These twin temple complexes showcase the extraordinary craftsmanship of Hoysala artisans, with thousands of intricate sculptures and carvings that tell stories from Hindu epics and mythology.",
            architecture: "The temples are built on star-shaped platforms with lathe-turned pillars, detailed friezes, and sculptures that appear to be in motion. The soapstone construction allowed for incredibly fine detailing, making these temples among the most ornate in India.",
            timeline: [
                { year: "1117 CE", event: "Belur temple construction begins" },
                { year: "1121 CE", event: "Halebidu temple construction begins" },
                { year: "12th century", event: "Peak Hoysala architectural period" },
                { year: "2014", event: "Proposed for UNESCO World Heritage status" }
            ]
        }
    },
    {
        key: "badami-aihole-pattadakal",
        name: "Badami, Aihole and Pattadakal",
        category: "Proposed UNESCO",
        era: "Chalukya (6th–8th c.)",
        coords: [15.934, 75.748],
        highlights: [
            "Chalukya architectural evolution",
            "Early Hindu temple architecture",
            "Proposed UNESCO extension"
        ],
        videoUrl: "",
        description: {
            history: "Badami, Aihole, and Pattadakal form a unique architectural ensemble that shows the evolution of early Hindu temple architecture in South India. While Pattadakal is already a UNESCO site, the complete Chalukya complex including Badami and Aihole is proposed for extension.",
            architecture: "These sites demonstrate the transition from rock-cut architecture (Badami caves) to structural temple building (Aihole and Pattadakal), showcasing the development of Dravidian and Nagara architectural styles.",
            timeline: [
                { year: "540 CE", event: "Badami established as Chalukya capital" },
                { year: "6th-7th century", event: "Aihole experimental temple phase" },
                { year: "7th-8th century", event: "Pattadakal mature phase" },
                { year: "Ongoing", event: "Proposed UNESCO extension" }
            ]
        }
    }
];

// Helper function to convert lat/lon to 3D coordinates
export function latLonTo3D(lat, lon, radius = 50) {
    // Karnataka approximate center: 15.3173° N, 75.7139° E
    // Scale factor for map projection
    const centerLat = 15.3173;
    const centerLon = 75.7139;
    const scale = 0.5; // Scale factor for positioning
    
    const x = (lon - centerLon) * scale * 10;
    const z = (lat - centerLat) * scale * 10;
    const y = 0; // Will be adjusted based on terrain
    
    return [x, y, z];
}

