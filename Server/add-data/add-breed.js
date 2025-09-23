const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();

// Function to insert all cow breed articles
async function insertCowBreedArticles() {
  const articlesRef = db.collection('cow-breeds');
  
  // Updated article data structure
  const articleDataArray = [
    {
      "gir": {
        "breed": "gir",
        "title": "Gir Cow Breed: India's Pride and a Symbol of Milk Abundance",
        "introduction": {
          "content": "The Gir cow is one of the most admired and famous indigenous cow breeds of India. Originating from Gujarat, the Gir breed is widely recognized for its milk production, resilience, and adaptability.",
          "image": {
            "url": "https://upload.wikimedia.org/wikipedia/commons/7/72/Gir_Cow.JPG",
            "caption": "A majestic Gir cow from Gujarat, India"
          }
        },
        "headings": [
          {
            "heading": "Origin and History",
            "content": "The Gir cow breed hails from the Gir forests of Gujarat. It is one of the principal Zebu cattle breeds in India, known for centuries.",
            "image": {
              "url": "https://example.com/gir_cow_origin.jpg",
              "caption": "Gir cows grazing in the Gir forest, Gujarat"
            }
          },
          {
            "heading": "Physical Characteristics",
            "content": "Gir cows are distinct with their large, curving horns and prominent foreheads. They are typically reddish-brown in color with white patches.",
            "image": {
              "url": "https://example.com/gir_cow_physical.jpg",
              "caption": "Distinct features: prominent forehead, curving horns."
            }
          }
        ]
      }
    },
    {
        "sahiwal": {
          "breed": "sahiwal",
          "title": "Sahiwal Cow Breed: The Supreme Milk Producer of Punjab",
          "introduction": {
            "content": "The Sahiwal cow is a popular and highly productive indigenous breed, originating from the Sahiwal district in Punjab, India. Known for its excellent milk yield and resistance to heat, this breed has gained international recognition.",
            "image": {
              "url": "https://upload.wikimedia.org/wikipedia/commons/4/44/Sahiwal_cow.JPG",
              "caption": "A robust Sahiwal cow from Punjab, India."
            }
          },
          "headings": [
            {
              "heading": "Origin and History",
              "content": "The Sahiwal breed comes from the Punjab region and is named after the Sahiwal district. It is one of the best dairy breeds in India and Pakistan, appreciated for its high milk production.",
              "image": {
                "url": "https://example.com/sahiwal_cow_origin.jpg",
                "caption": "Sahiwal cows in the fields of Punjab."
              }
            },
            {
              "heading": "Physical Characteristics",
              "content": "Sahiwal cows have a reddish-brown coat with lighter shading on the underbelly and legs. They are medium-sized cattle with loose skin and a well-developed udder.",
              "image": {
                "url": "https://example.com/sahiwal_cow_physical.jpg",
                "caption": "Typical Sahiwal cow with a well-developed udder."
              }
            }
          ]
        },
      },
      {
        "tharparkar": {
          "breed": "tharparkar",
          "title": "Tharparkar Cow Breed: The Resilient Desert Cattle of India",
          "introduction": {
            "content": "The Tharparkar cow is a dual-purpose breed known for both milk and draught power. Originating from the Thar Desert region, it is valued for its hardiness and ability to thrive in arid conditions.",
            "image": {
              "url": "https://upload.wikimedia.org/wikipedia/commons/d/db/Tharparkar_Cow.jpg",
              "caption": "A sturdy Tharparkar cow from the Thar Desert."
            }
          },
          "headings": [
            {
              "heading": "Origin and History",
              "content": "The Tharparkar breed hails from the Thar Desert region of Rajasthan. Historically, these cows have played a crucial role in sustaining the economy of desert farmers.",
              "image": {
                "url": "https://example.com/tharparkar_cow_origin.jpg",
                "caption": "Tharparkar cows grazing in the arid Thar region."
              }
            },
            {
              "heading": "Physical Characteristics",
              "content": "Tharparkar cows are medium-sized with a white or gray coat. They are known for their resistance to heat and drought, making them well-suited to harsh climates.",
              "image": {
                "url": "https://example.com/tharparkar_cow_physical.jpg",
                "caption": "Tharparkar cow with a resilient and lean body."
              }
            }
          ]
        }
      },
      {
        "hariana": {
            "breed": "hariana",
            "title": "Hariana Cow Breed: The Hardy Draught and Dairy Cattle from Haryana",
            "introduction": {
              "content": "The Hariana cow is an indigenous breed known for both milk production and its role as a draught animal. It hails from the Rohtak, Hisar, and Jind districts of Haryana, India, and is well-adapted to the region's climate.",
              "image": {
                "url": "https://upload.wikimedia.org/wikipedia/commons/3/3c/Hariana_Cattle.jpg",
                "caption": "A typical Hariana cow from Haryana, India."
              }
            },
            "headings": [
              {
                "heading": "Origin and History",
                "content": "The Hariana breed is indigenous to the state of Haryana. Historically, it has been a vital part of the local farming economy, providing both milk and draught power.",
                "image": {
                  "url": "https://example.com/hariana_cow_origin.jpg",
                  "caption": "Hariana cows working in the fields of Haryana."
                }
              },
              {
                "heading": "Physical Characteristics",
                "content": "Hariana cows are medium to large in size, with a white or light gray coat. They are hardy animals that can perform well under various climatic conditions.",
                "image": {
                  "url": "https://example.com/hariana_cow_physical.jpg",
                  "caption": "Hariana cow with a strong and resilient physique."
                }
              }
            ]
          }
      },
      {
        "ongole": {
          "breed": "ongole",
          "title": "Ongole Cow Breed: The Powerful Draught Animal of Andhra Pradesh",
          "introduction": {
            "content": "The Ongole cow is a famous indigenous breed originating from Andhra Pradesh, India. It is known for its strength, making it an excellent draught animal, and also produces good-quality milk.",
            "image": {
              "url": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Ongole_Cow.jpg",
              "caption": "A majestic Ongole cow from Andhra Pradesh."
            }
          },
          "headings": [
            {
              "heading": "Origin and History",
              "content": "Ongole cattle have been bred in the coastal districts of Andhra Pradesh for centuries. They are highly prized for their strength and endurance in agricultural work.",
              "image": {
                "url": "https://example.com/ongole_cow_origin.jpg",
                "caption": "Ongole cows in the fields of Andhra Pradesh."
              }
            },
            {
              "heading": "Physical Characteristics",
              "content": "Ongole cows are large and muscular with a white or gray coat. They have a distinctive hump and are known for their impressive size and power.",
              "image": {
                "url": "https://example.com/ongole_cow_physical.jpg",
                "caption": "Ongole cow with a strong and muscular build."
              }
            }
          ]
        },
      },
      {
        "red_sindhi": {
          "breed": "red_sindhi",
          "title": "Red Sindhi Cow Breed: Renowned for Its Milk and Adaptability",
          "introduction": {
            "content": "The Red Sindhi cow is known for its high milk yield and ability to adapt to different climates. This breed, originating from the Sindh province of Pakistan, is widely distributed across India due to its excellent dairy qualities.",
            "image": {
              "url": "https://upload.wikimedia.org/wikipedia/commons/1/19/Red_Sindhi_Cattle.jpg",
              "caption": "A distinctive Red Sindhi cow."
            }
          },
          "headings": [
            {
              "heading": "Origin and History",
              "content": "The Red Sindhi cow breed is native to the Sindh region in Pakistan. Its introduction to India has been a success story, as the breed is now popular among dairy farmers for its milk productivity.",
              "image": {
                "url": "https://example.com/red_sindhi_cow_origin.jpg",
                "caption": "Red Sindhi cows thriving in the Indian subcontinent."
              }
            },
            {
              "heading": "Physical Characteristics",
              "content": "Red Sindhi cows are medium-sized with a deep reddish-brown coat. They have a compact body structure and are well adapted to different climatic conditions.",
              "image": {
                "url": "https://example.com/red_sindhi_cow_physical.jpg",
                "caption": "Red Sindhi cow with a strong and compact body."
              }
            }
          ]
        },
      },{
        "tharparkar": {
          "breed": "tharparkar",
          "title": "Tharparkar Cow Breed: The Resilient Desert Cattle of India",
          "introduction": {
            "content": "The Tharparkar cow is a dual-purpose breed known for both milk and draught power. Originating from the Thar Desert region, it is valued for its hardiness and ability to thrive in arid conditions.",
            "image": {
              "url": "https://upload.wikimedia.org/wikipedia/commons/d/db/Tharparkar_Cow.jpg",
              "caption": "A sturdy Tharparkar cow from the Thar Desert."
            }
          },
          "headings": [
            {
              "heading": "Origin and History",
              "content": "The Tharparkar breed hails from the Thar Desert region of Rajasthan. Historically, these cows have played a crucial role in sustaining the economy of desert farmers.",
              "image": {
                "url": "https://example.com/tharparkar_cow_origin.jpg",
                "caption": "Tharparkar cows grazing in the arid Thar region."
              }
            },
            {
              "heading": "Physical Characteristics",
              "content": "Tharparkar cows are medium-sized with a white or gray coat. They are known for their resistance to heat and drought, making them well-suited to harsh climates.",
              "image": {
                "url": "https://example.com/tharparkar_cow_physical.jpg",
                "caption": "Tharparkar cow with a resilient and lean body."
              }
            }
          ]
        }
      }

      
    // Add other breeds similarly...
  ];

  try {
    // Batch write to optimize performance
    const batch = db.batch();

    articleDataArray.forEach((articleObj) => {
      const breed = Object.keys(articleObj)[0];
      const article = articleObj[breed];
      
      // Add metadata to each article
      const articleWithMetadata = {
        ...article,
        metadata: {
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          category: "Cow Breeds",
          tags: ["Indian Cattle", article.title.split(':')[0].trim()]
        }
      };

      // Use the breed as the document ID
      const docRef = articlesRef.doc(breed);
      batch.set(docRef, articleWithMetadata);
    });

    // Commit the batch
    await batch.commit();
    console.log(`Successfully added ${articleDataArray.length} articles to Firestore!`);
  } catch (error) {
    console.error("Error adding articles to Firestore:", error);
  } finally {
    // Optional: Close the Firebase app if you're done
    admin.app().delete();
  }
}

// Run the function
insertCowBreedArticles().catch(console.error);