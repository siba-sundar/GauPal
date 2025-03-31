const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();

// Function to insert article data
async function insertArticleData() {
  const articlesRef = db.collection('events');
  
  // Gir Cow Article Data
  const eventsList = [
    {
        "name": "Global Dairy Farming Summit 2025",
        "description": "An international event bringing together dairy farmers, industry experts, and researchers to discuss modern dairy farming techniques and sustainability.",
        "location": "National Dairy Research Institute, Karnal, India",
        "dateTime": "2025-06-15T09:30:00Z",
        "coordinates": {
          "latitude": 29.6857,
          "longitude": 76.9905
        },
        "organizer": "Indian Council of Agricultural Research (ICAR)",
        "images": [
          {
            "url": "https://example.com/event_dairy1.jpg",
            "caption": "Panel discussion on sustainable dairy farming."
          },
          {
            "url": "https://example.com/event_dairy2.jpg",
            "caption": "Farmers learning about modern milking techniques."
          }
        ]
      },
      {
        "name": "Indigenous Cattle Breeding Expo",
        "description": "A national expo showcasing the best indigenous cattle breeds, breeding techniques, and genetic improvement strategies.",
        "location": "Gau Vigyan Kendra, Ahmedabad, India",
        "dateTime": "2025-07-20T10:00:00Z",
        "coordinates": {
          "latitude": 23.0225,
          "longitude": 72.5714
        },
        "organizer": "National Dairy Development Board (NDDB)",
        "images": [
          {
            "url": "https://example.com/event_breeding1.jpg",
            "caption": "Experts explaining selective breeding methods."
          },
          {
            "url": "https://example.com/event_breeding2.jpg",
            "caption": "Indigenous cattle showcase at the expo."
          }
        ]
      },
      {
        "name": "Smart Agriculture & Livestock Tech Conference",
        "description": "A technology-focused event discussing AI, IoT, and automation in dairy farming and livestock management.",
        "location": "Indian Agricultural Research Institute, New Delhi, India",
        "dateTime": "2025-08-10T11:00:00Z",
        "coordinates": {
          "latitude": 28.6353,
          "longitude": 77.2249
        },
        "organizer": "Federation of Indian Animal Science Associations",
        "images": [
          {
            "url": "https://example.com/event_agri1.jpg",
            "caption": "Livestock monitoring technology in action."
          },
          {
            "url": "https://example.com/event_agri2.jpg",
            "caption": "Farmers learning about AI-based disease detection."
          }
        ]
      },
      {
        "name": "Organic Dairy & Cow-Based Products Expo",
        "description": "A trade show highlighting organic dairy farming, traditional cow-based products, and sustainable farming practices.",
        "location": "Maharashtra Krishi Vidyapeeth, Pune, India",
        "dateTime": "2025-09-25T10:30:00Z",
        "coordinates": {
          "latitude": 18.5204,
          "longitude": 73.8567
        },
        "organizer": "National Organic Farming Association of India",
        "images": [
          {
            "url": "https://example.com/event_organic1.jpg",
            "caption": "Organic dairy farm demonstration."
          },
          {
            "url": "https://example.com/event_organic2.jpg",
            "caption": "Showcase of cow-based Ayurvedic products."
          }
        ]
      },
      {
        "name": "India Livestock & Dairy Expo",
        "description": "One of the largest livestock and dairy expos in India, featuring advanced breeding technologies, feed solutions, and sustainable dairy management techniques.",
        "location": "Hyderabad International Trade Expo Center, India",
        "dateTime": "2025-10-12T09:00:00Z",
        "coordinates": {
          "latitude": 17.3850,
          "longitude": 78.4867
        },
        "organizer": "Indian Federation of Livestock Farmers",
        "images": [
          {
            "url": "https://example.com/event_livestock1.jpg",
            "caption": "Experts discussing advanced cattle feeding techniques."
          },
          {
            "url": "https://example.com/event_livestock2.jpg",
            "caption": "Farmers attending a hands-on training session."
          }
        ]
      },
      {
        "name": "National Conference on Indigenous Cow Breeds",
        "description": "A dedicated event to discuss the conservation, benefits, and promotion of indigenous cow breeds like Gir, Sahiwal, and Red Sindhi.",
        "location": "Gau Seva Kendra, Jaipur, India",
        "dateTime": "2025-11-05T10:00:00Z",
        "coordinates": {
          "latitude": 26.9124,
          "longitude": 75.7873
        },
        "organizer": "Indian Indigenous Cattle Breeders Association",
        "images": [
          {
            "url": "https://example.com/event_indigenous1.jpg",
            "caption": "Experts discussing indigenous cow conservation."
          },
          {
            "url": "https://example.com/event_indigenous2.jpg",
            "caption": "Farmers learning about the benefits of native breeds."
          }
        ]
      },
      {
        "name": "Dairy Tech India Expo",
        "description": "A premier exhibition showcasing the latest advancements in dairy equipment, cattle genetics, and milk processing technologies.",
        "location": "Bangalore International Exhibition Centre, India",
        "dateTime": "2025-12-15T09:30:00Z",
        "coordinates": {
          "latitude": 13.0124,
          "longitude": 77.5431
        },
        "organizer": "Federation of Indian Dairy Farmers",
        "images": [
          {
            "url": "https://example.com/event_dairytech1.jpg",
            "caption": "Innovative dairy processing technology showcase."
          },
          {
            "url": "https://example.com/event_dairytech2.jpg",
            "caption": "Attendees exploring modern cattle management tools."
          }
        ]
      },
      {
        "name": "Sustainable Cattle Farming & Climate Resilience Forum",
        "description": "A workshop and conference focused on eco-friendly dairy farming practices, reducing carbon footprints, and improving cattle resilience to climate change.",
        "location": "Punjab Agricultural University, Ludhiana, India",
        "dateTime": "2026-01-20T11:00:00Z",
        "coordinates": {
          "latitude": 30.9010,
          "longitude": 75.8573
        },
        "organizer": "Indian Council of Agricultural Research (ICAR)",
        "images": [
          {
            "url": "https://example.com/event_sustainable1.jpg",
            "caption": "Experts discussing sustainable livestock farming."
          },
          {
            "url": "https://example.com/event_sustainable2.jpg",
            "caption": "Climate resilience strategies for dairy farmers."
          }
        ]
      },
      {
        "name": "Gau Pusthi Mela: Ayurveda & Cow-Based Products Fair",
        "description": "A large-scale fair featuring Ayurvedic cow-based products, organic dairy farming, and traditional medicine applications.",
        "location": "Rishikul Ayurvedic College, Haridwar, India",
        "dateTime": "2026-02-10T10:30:00Z",
        "coordinates": {
          "latitude": 29.9457,
          "longitude": 78.1642
        },
        "organizer": "National Cow Protection & Ayurveda Association",
        "images": [
          {
            "url": "https://example.com/event_gaupusthi1.jpg",
            "caption": "Organic cow-based products at the fair."
          },
          {
            "url": "https://example.com/event_gaupusthi2.jpg",
            "caption": "Ayurveda experts discussing cow-based medicines."
          }
        ]
      },
      {
        "name": "Precision Dairy Farming & Automation Conference",
        "description": "A high-tech event exploring automation in dairy farming, including smart feeding systems, AI-based disease detection, and robotic milking solutions.",
        "location": "IIT Kharagpur, West Bengal, India",
        "dateTime": "2026-03-18T09:00:00Z",
        "coordinates": {
          "latitude": 22.3149,
          "longitude": 87.3095
        },
        "organizer": "Indian Society of Dairy Technology",
        "images": [
          {
            "url": "https://example.com/event_precision1.jpg",
            "caption": "AI-driven dairy farming technologies."
          },
          {
            "url": "https://example.com/event_precision2.jpg",
            "caption": "Automated cattle health monitoring solutions."
          }
        ]
      }
    
  ];

  try {
    // Add each article to Firestore and let Firestore generate IDs
    const batch = db.batch();
    
    // Process each article
    for (const event of eventsList) {
      const docRef = articlesRef.doc(); // Auto-generated ID
      batch.set(docRef, event);
    }
    
    // Commit the batch
    await batch.commit();
    console.log(`${eventsList.length} articles added successfully to Firestore!`);
  } catch (error) {
    console.error("Error adding articles to Firestore:", error);
  }
}

// Run the function
insertArticleData().catch(console.error);