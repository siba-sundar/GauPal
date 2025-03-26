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
  const articlesRef = db.collection('articles');
  
  // Gir Cow Article Data
  const girCowArticle = {
    title: "Gir Cow Breed: India's Pride and a Symbol of Milk Abundance",
    introduction: {
      content: "The Gir cow is one of the most admired and famous indigenous cow breeds of India. Originating from Gujarat, the Gir breed is widely recognized for its milk production, resilience, and adaptability. This article provides an in-depth look into the Gir cow's characteristics, importance, and its role in Indian agriculture.",
      image: {
        url: "https://example.com/gir_cow_intro.jpg",
        caption: "A majestic Gir cow from Gujarat, India"
      }
    },
    headings: [
      {
        heading: "Origin and History",
        content: "The Gir cow breed hails from the Gir forests of Gujarat and parts of Maharashtra. This breed has been known for centuries and is revered for its strong genetics and milk production capabilities. It is one of the principal Zebu cattle breeds in India.",
        image: {
          url: "https://example.com/gir_cow_origin.jpg",
          caption: "Gir cows grazing in the Gir forest, Gujarat"
        }
      },
      {
        heading: "Physical Characteristics",
        content: "Gir cows are distinct in appearance, characterized by their large, curving horns and prominent foreheads. They are typically reddish-brown in color, with some cows showing white patches. Their ears are pendulous, and they have a hump on their back, which is common in Zebu cattle.",
        image: {
          url: "https://example.com/gir_cow_physical.jpg",
          caption: "Distinct physical features of the Gir cow: prominent forehead, curving horns, and reddish-brown color"
        }
      },
      {
        heading: "Milk Production",
        content: "One of the standout features of the Gir cow is its ability to produce high-quality milk. On average, a Gir cow produces around 10-15 liters of milk per day, rich in A2 protein, which is known to be healthier than A1 milk. This breed is often crossbred with other dairy breeds to improve milk production in other regions.",
        image: {
          url: "https://example.com/gir_cow_milk.jpg",
          caption: "A Gir cow being milked, known for producing high-quality A2 milk"
        }
      },
      {
        heading: "Common Diseases",
        subsections: [
          {
            disease: "Foot-and-Mouth Disease (FMD)",
            details: "Gir cows, like many livestock, are susceptible to Foot-and-Mouth Disease, which causes sores and fever. It can affect their milk production and cause discomfort.",
            prevention: "Regular vaccinations and maintaining hygiene in their habitat can prevent the spread of this disease.",
            image: {
              url: "https://example.com/fmd_gir_cow.jpg",
              caption: "Preventing Foot-and-Mouth Disease in Gir cows with proper vaccination"
            }
          },
          {
            disease: "Mastitis",
            details: "Mastitis is an inflammation of the udder tissue in dairy cows. It can lead to reduced milk yield and quality. This condition is common in high-producing cows like Gir.",
            prevention: "Ensuring the cleanliness of milking equipment and proper milking practices are vital in preventing mastitis.",
            image: {
              url: "https://example.com/mastitis_gir_cow.jpg",
              caption: "Mastitis in Gir cows can be managed by improving sanitation practices during milking."
            }
          }
        ]
      },
      {
        heading: "Special Features of the Gir Cow",
        content: "Gir cows are highly resistant to hot weather and have adapted well to dry and arid environments. They are also disease-resistant, making them low-maintenance for farmers. Additionally, their milk contains high levels of A2 protein, which is considered beneficial for human consumption.",
        image: {
          url: "https://example.com/special_features_gir_cow.jpg",
          caption: "Gir cows are known for their resilience and special adaptability to arid climates."
        }
      },
      {
        heading: "Uses of the Gir Cow",
        content: "The Gir cow is primarily used for milk production, but it also plays a role in draft work in some areas. Due to its strong genetic traits, Gir cows are often crossbred with other breeds to enhance milk production in dairy farms.",
        image: {
          url: "https://example.com/gir_cow_uses.jpg",
          caption: "Gir cows are used for milk production and crossbreeding programs."
        }
      },
      {
        heading: "Conclusion",
        content: "The Gir cow holds an esteemed place in Indian dairy farming. With its rich history, unique physical attributes, and valuable milk production, it has made significant contributions to both rural economies and dairy farming industries worldwide.",
        image: {
          url: "https://example.com/gir_cow_conclusion.jpg",
          caption: "Gir cow: A valuable asset to the Indian dairy farming industry"
        }
      }
    ],
    // Add metadata
    metadata: {
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      category: "Animal Husbandry",
      tags: ["Gir Cow", "Dairy Farming", "Indian Cattle"]
    }
  };

  try {
    // Add the article to Firestore with a custom document ID
    await articlesRef.doc('gir').set(girCowArticle);
    console.log("Article added successfully to Firestore!");
  } catch (error) {
    console.error("Error adding article to Firestore:", error);
  }
}

// Run the function
insertArticleData().catch(console.error);