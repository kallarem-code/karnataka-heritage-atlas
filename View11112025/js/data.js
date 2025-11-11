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
    },
    {
        key: "western_ghats",
        name: "Western Ghats (Karnataka)",
        category: "UNESCO",
        era: "Natural",
        coords: [13.520, 75.000],
        highlights: [
            "Biodiversity hotspot",
            "UNESCO World Heritage Site",
            "Ancient mountain range"
        ],
        videoUrl: "",
        description: {
            history: "The Western Ghats in Karnataka are part of one of the world's eight 'hottest hotspots' of biological diversity. This ancient mountain range dates back to the breakup of the supercontinent Gondwana some 150 million years ago.",
            architecture: "The Western Ghats feature unique ecosystems, endemic species, and serve as a critical watershed for peninsular India. The range includes several protected areas and national parks.",
            timeline: [
                { year: "150 million years ago", event: "Formation during Gondwana breakup" },
                { year: "2012", event: "UNESCO World Heritage Site designation" }
            ]
        }
    },
    {
        key: "somanathapura",
        name: "Somanathapura",
        category: "Proposed UNESCO",
        era: "Hoysala (13th c.)",
        coords: [12.277, 76.880],
        highlights: [
            "Kesava Temple",
            "Hoysala architecture",
            "Proposed UNESCO site"
        ],
        videoUrl: "",
        description: {
            history: "Somanathapura is famous for the Kesava Temple, one of the finest examples of Hoysala architecture. Built in 1268 CE, it represents the mature phase of Hoysala temple building.",
            architecture: "The temple features a trikuta (three-shrine) design with intricate carvings covering every surface. The star-shaped platform and lathe-turned pillars are characteristic of Hoysala style.",
            timeline: [
                { year: "1268 CE", event: "Temple construction" },
                { year: "13th century", event: "Hoysala period" }
            ]
        }
    },
    {
        key: "aihole",
        name: "Aihole",
        category: "Proposed UNESCO",
        era: "Chalukya (6th–8th c.)",
        coords: [16.021, 75.885],
        highlights: [
            "Cradle of Indian temple architecture",
            "Over 100 temples",
            "Experimental temple designs"
        ],
        videoUrl: "",
        description: {
            history: "Aihole is known as the 'Cradle of Indian Temple Architecture' with over 100 temples showcasing experimental designs. It was an important center for the development of Hindu temple architecture.",
            architecture: "The temples at Aihole show the evolution from simple rock-cut structures to complex structural temples, experimenting with various architectural styles and techniques.",
            timeline: [
                { year: "6th century", event: "Early Chalukya period" },
                { year: "7th-8th century", event: "Temple building peak" }
            ]
        }
    },
    {
        key: "bidar",
        name: "Bidar Fort",
        category: "Proposed UNESCO",
        era: "Bahmani/Adil Shahi (15th–16th c.)",
        coords: [17.914, 77.517],
        highlights: [
            "Bahmani capital",
            "Islamic architecture",
            "Proposed UNESCO site"
        ],
        videoUrl: "",
        description: {
            history: "Bidar was the capital of the Bahmani Sultanate and later the Barid Shahi dynasty. The fort complex represents a unique blend of Persian and Indian architectural styles.",
            architecture: "The fort features impressive gates, palaces, mosques, and gardens. The architecture showcases the synthesis of Islamic and Deccan styles with intricate tile work and calligraphy.",
            timeline: [
                { year: "1429", event: "Bidar becomes Bahmani capital" },
                { year: "15th-16th century", event: "Fort construction and expansion" }
            ]
        }
    },
    {
        key: "banavasi",
        name: "Banavasi",
        category: "Heritage",
        era: "Kadamba/Ancient (4th–6th c.)",
        coords: [14.533, 75.017],
        highlights: [
            "Ancient Kadamba capital",
            "Madhukeshwara Temple",
            "Prehistoric heritage"
        ],
        videoUrl: "",
        description: {
            history: "Banavasi is one of the oldest towns in Karnataka, serving as the capital of the Kadamba dynasty. It has been continuously inhabited for over 2000 years.",
            architecture: "The Madhukeshwara Temple is the main attraction, showcasing early Dravidian architecture. The site includes ancient inscriptions and archaeological remains.",
            timeline: [
                { year: "4th century CE", event: "Kadamba capital" },
                { year: "Ancient", event: "Continuous habitation" }
            ]
        }
    },
    {
        key: "mirjan",
        name: "Mirjan Fort",
        category: "Heritage",
        era: "Medieval/Maritime (16th c.)",
        coords: [14.483, 74.417],
        highlights: [
            "Coastal fort",
            "Maritime trade center",
            "Medieval architecture"
        ],
        videoUrl: "",
        description: {
            history: "Mirjan Fort was a strategic coastal fortification that played an important role in maritime trade. It was built by the rulers of Gersoppa and later expanded.",
            architecture: "The fort features impressive ramparts, bastions, and water management systems. It showcases medieval military architecture adapted to coastal conditions.",
            timeline: [
                { year: "16th century", event: "Fort construction" },
                { year: "Medieval", event: "Maritime trade period" }
            ]
        }
    },
    {
        key: "balligave",
        name: "Balligave",
        category: "Heritage",
        era: "Kadamba/Ancient (11th–12th c.)",
        coords: [14.383, 75.033],
        highlights: [
            "Ancient temple complex",
            "Kadamba architecture",
            "Living heritage"
        ],
        videoUrl: "",
        description: {
            history: "Balligave is an ancient temple town with several important temples dating back to the Kadamba and later periods. It represents a living heritage site.",
            architecture: "The temples showcase the evolution of temple architecture in Karnataka, with influences from various dynasties that ruled the region.",
            timeline: [
                { year: "11th-12th century", event: "Temple construction period" },
                { year: "Ancient", event: "Continuous religious significance" }
            ]
        }
    },
    {
        key: "brahmagiri",
        name: "Brahmagiri",
        category: "Heritage",
        era: "Prehistory/Mauryan (300 BCE–200 CE)",
        coords: [12.383, 76.383],
        highlights: [
            "Prehistoric site",
            "Ashokan edicts",
            "Archaeological importance"
        ],
        videoUrl: "",
        description: {
            history: "Brahmagiri is an important prehistoric and early historic site with evidence of human habitation dating back thousands of years. It contains Ashokan edicts from the 3rd century BCE.",
            architecture: "The site includes megalithic structures, rock edicts, and remains of ancient settlements. It provides crucial evidence of early human civilization in South India.",
            timeline: [
                { year: "300 BCE", event: "Ashokan period" },
                { year: "Prehistoric", event: "Early human habitation" }
            ]
        }
    },
    {
        key: "kurudumale",
        name: "Kurudumale",
        category: "Heritage",
        era: "Vijayanagara (14th–16th c.)",
        coords: [13.417, 77.250],
        highlights: [
            "Ganesha Temple",
            "Vijayanagara period",
            "Unique architecture"
        ],
        videoUrl: "",
        description: {
            history: "Kurudumale is known for its unique Ganesha Temple built during the Vijayanagara period. The site represents the spread of Vijayanagara architectural influence.",
            architecture: "The temple features distinctive architectural elements and carvings characteristic of the Vijayanagara style, adapted to local traditions.",
            timeline: [
                { year: "14th-16th century", event: "Vijayanagara period" },
                { year: "Medieval", event: "Temple construction" }
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

