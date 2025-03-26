const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json');

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

const db = admin.firestore();

async function insertDiseaseData() {
  const diseasesRef = db.collection('diseases');
  
  const diseasesData = [
    {
      id: "Abscess",
      name: "Abscess",
      symptoms: [
        "Swelling in affected area",
        "Pus discharge",
        "Pain when touched",
        "Reduced appetite",
        "Localized heat around the infected area",
        "Potential fever"
      ],
      details: "An abscess is a localized infection where pus accumulates in a confined space within the body's tissues. In cattle, these infections can develop from bacterial invasions, physical injuries, or compromised immune systems, creating painful, swollen areas that require immediate medical attention. Abscesses can occur in various body parts including skin, internal organs, and soft tissues.",
      precautions: [
        "Regular cleaning of wounds",
        "Maintaining good hygiene",
        "Keeping animals in clean, dry areas",
        "Prompt treatment of any cuts or injuries",
        "Regular health inspections",
        "Vaccination against common bacterial infections"
      ],
      solutions: [
        "Antibiotics",
        "Surgical drainage",
        "Wound care and dressing",
        "Pain management",
        "Isolation of infected animal",
        "Supportive nutritional care"
      ],
      veterinaryImportance: "Abscesses can quickly become serious if not treated promptly, potentially leading to systemic infections and significant health complications for the animal. Early detection and treatment are crucial to prevent spread and ensure complete recovery."
    },
    {
      id: "Actinomycosis",
      name: "Actinomycosis",
      symptoms: [
        "Swelling in jaw or neck region",
        "Difficulty chewing",
        "Noticeable weight loss",
        "Discharge from lumps",
        "Hard, firm swellings",
        "Potential formation of draining tracts",
        "Reduced feed intake"
      ],
      details: "Actinomycosis is a chronic bacterial infection that primarily affects soft tissues, especially in the jaw and neck area of cattle. Caused by Actinomyces bacteria, this condition creates persistent, hard swellings that can develop into draining tracts, significantly impacting the animal's ability to eat and maintain health. The infection can spread to bone tissue, causing significant structural damage.",
      precautions: [
        "Avoid rough feed that can cause mouth wounds",
        "Maintain clean feeding areas",
        "Regular oral health checks",
        "Minimize trauma to mouth and jaw",
        "Proper dental care",
        "Balanced nutrition to support immune system"
      ],
      solutions: [
        "Long-term antibiotic treatment",
        "Surgical drainage of abscesses",
        "Supportive nutritional care",
        "Pain management",
        "Soft diet to reduce jaw stress",
        "Potential surgical intervention for advanced cases"
      ],
      veterinaryImportance: "Early detection and aggressive treatment are crucial to prevent permanent damage and ensure the animal's recovery and quality of life. The condition can lead to significant economic losses if not managed effectively."
    },
    {
      id: "Bovine Dermatophilosis",
      name: "Bovine Dermatophilosis (Rain Rot)",
      symptoms: [
        "Crusty skin lesions",
        "Patchy hair loss",
        "Intense skin irritation",
        "Visible inflammation",
        "Scab formation",
        "Potential secondary bacterial infections",
        "Reduced animal comfort"
      ],
      details: "Bovine Dermatophilosis is a bacterial skin infection that thrives in wet, humid conditions. The disease causes painful crusty lesions that can spread quickly through a herd, leading to significant discomfort and potential secondary infections for affected cattle. The causative organism, Dermatophilus congolensis, can penetrate damaged skin and multiply rapidly under moist conditions.",
      precautions: [
        "Keep animals dry and sheltered",
        "Prevent overcrowding",
        "Maintain strict hygiene practices",
        "Provide adequate drainage in pastures",
        "Regular skin inspections",
        "Minimize exposure to wet conditions"
      ],
      solutions: [
        "Topical antibiotic treatments",
        "Keeping affected areas clean and dry",
        "Improving overall herd management",
        "Isolating infected animals",
        "Comprehensive skin care routine",
        "Potential systemic antibiotics for severe cases"
      ],
      veterinaryImportance: "Prompt treatment prevents widespread infection and reduces long-term skin damage in the herd. The condition can significantly impact animal welfare and productivity if left untreated."
    },
    {
      id: "Bovine Warts",
      name: "Bovine Warts",
      symptoms: [
        "Wart-like growths on skin",
        "Thickening of affected areas",
        "Potential interference with movement",
        "Clustered or single growths",
        "Growths typically on head, neck, and shoulders",
        "Potential bleeding or secondary infections"
      ],
      details: "Bovine warts are caused by the bovine papillomavirus, typically affecting young cattle. These growths can appear on various body parts, particularly the head and neck, and while often benign, they can cause discomfort and potentially impact the animal's overall health. The virus spreads through direct contact and can persist in the environment.",
      precautions: [
        "Minimize contact with infected animals",
        "Boost overall herd immunity",
        "Regular health screenings",
        "Quarantine new animals",
        "Disinfect equipment and shared spaces",
        "Implement strict biosecurity measures"
      ],
      solutions: [
        "Surgical or topical wart removal",
        "Targeted vaccination",
        "Supporting immune system health",
        "Cryotherapy for stubborn warts",
        "Potential immune system boosters",
        "Supportive care during healing"
      ],
      veterinaryImportance: "Managing warts helps prevent spread and potential complications in young cattle populations. Early intervention can reduce economic losses and maintain herd health."
    },
    {
      id: "Bovine spongiform encephalopathy (BSE)",
      name: "Bovine spongiform encephalopathy (BSE)",
      symptoms: [
        "Behavioral changes",
        "Loss of coordination",
        "Progressive neurological deterioration",
        "Significant weight loss",
        "Aggressive or nervous behavior",
        "Decreased milk production",
        "Inability to stand or walk normally"
      ],
      details: "Bovine spongiform encephalopathy, commonly known as mad cow disease, is a fatal neurodegenerative disorder affecting the central nervous system of cattle. This prion disease causes progressive brain damage, leading to severe neurological symptoms and ultimately death. The disease is caused by misfolded proteins that create holes in brain tissue, resembling a sponge-like appearance.",
      precautions: [
        "Strict feed control",
        "Comprehensive import/export regulations",
        "Rigorous testing of cattle herds",
        "Ban on feeding ruminant-derived proteins",
        "Complete traceability of animal origins",
        "Stringent slaughter and processing protocols"
      ],
      solutions: [
        "No cure available",
        "Immediate culling of infected animals",
        "Preventing further transmission",
        "Comprehensive herd monitoring",
        "Public health surveillance",
        "Strict biosecurity measures"
      ],
      veterinaryImportance: "Critical public health concern requiring immediate isolation and comprehensive preventive measures to protect both animal and human populations. The potential for transmission to humans makes this disease extremely serious."
    },
    {
      id: "Dermatophytosis",
      name: "Dermatophytosis (Ringworm)",
      symptoms: [
        "Circular hairless patches",
        "Scaly, irritated skin",
        "Intense itching",
        "Potential skin inflammation",
        "Raised, crusty lesions",
        "Potential spread to other animals",
        "Weakened hair follicles"
      ],
      details: "Dermatophytosis is a highly contagious fungal infection that affects the skin, hair, and occasionally nails of cattle. The disease spreads rapidly through direct contact, causing circular patches of hair loss and significant skin irritation. Caused by various fungal species, it can affect animals with weakened immune systems more severely.",
      precautions: [
        "Maintain strict hygiene protocols",
        "Isolate infected animals",
        "Thoroughly disinfect equipment and living areas",
        "Regular cleaning and grooming",
        "Minimize stress on animals",
        "Boost overall herd nutrition"
      ],
      solutions: [
        "Topical antifungal treatments",
        "Environmental disinfection",
        "Comprehensive cleaning routines",
        "Systemic antifungal medications",
        "Supportive care to boost immunity",
        "Potential use of lime sulfur dips"
      ],
      veterinaryImportance: "Quick identification and treatment prevent widespread infection and reduce economic losses. The condition can significantly impact animal welfare and productivity."
    },
    {
      id: "Digital Dermatitis",
      name: "Digital Dermatitis (Hairy Heel Warts)",
      symptoms: [
        "Painful lesions on hooves",
        "Severe lameness",
        "Visible inflammation around hoof",
        "Potential bleeding",
        "Reduced mobility",
        "Decreased milk production",
        "Potential weight loss"
      ],
      details: "Digital Dermatitis is a progressive bacterial infection affecting cattle hooves, causing significant pain and lameness. Primarily caused by Treponema species, the disease creates painful lesions that can rapidly spread within a herd. It's particularly prevalent in confined dairy operations with high moisture environments.",
      precautions: [
        "Maintain clean, dry housing conditions",
        "Regular hoof trimming",
        "Foot bath treatments",
        "Minimize standing in wet areas",
        "Regular veterinary inspections",
        "Implement strict hygiene protocols"
      ],
      solutions: [
        "Topical antibiotic treatments",
        "Foot baths with copper sulfate",
        "Individual animal treatment",
        "Systemic antibiotics for severe cases",
        "Hoof block application",
        "Pain management strategies"
      ],
      veterinaryImportance: "Critical for maintaining herd mobility and productivity. Can cause significant economic losses if not managed effectively."
    },
    {
      id: "Foot and Mouth Disease",
      name: "Foot and Mouth Disease",
      symptoms: [
        "Blisters on feet and mouth",
        "Severe lameness",
        "Excessive salivation",
        "Rapid weight loss",
        "Fever",
        "Reduced milk production",
        "Potential abortion in pregnant animals"
      ],
      details: "Foot and Mouth Disease is an extremely contagious viral infection that affects cloven-hoofed animals, causing widespread economic and agricultural disruption. The disease spreads rapidly, creating painful blisters that prevent animals from eating, walking, and maintaining normal productivity. High transmissibility makes it a global agricultural concern.",
      precautions: [
        "Strict vaccination programs",
        "Controlling animal movement during outbreaks",
        "Immediate isolation of infected animals",
        "Comprehensive biosecurity measures",
        "International trade restrictions",
        "Rapid response protocols"
      ],
      solutions: [
        "Comprehensive quarantine measures",
        "Supportive veterinary care",
        "Symptomatic treatment",
        "Potential culling in severe outbreaks",
        "Vaccination of surrounding herds",
        "Strict decontamination procedures"
      ],
      veterinaryImportance: "This disease can devastate entire herds and has significant international trade implications, making prevention and quick response critical."
    },
    {
      id: "Hoof Rot",
      name: "Hoof Rot (Interdigital Necrobacillosis)",
      symptoms: [
        "Foul-smelling discharge",
        "Severe lameness",
        "Swelling between hoof claws",
        "Tissue decay",
        "Potential systemic infection",
        "Reduced mobility",
        "Potential weight loss"
      ],
      details: "Hoof Rot is a severe bacterial infection affecting the soft tissues between cattle hooves, caused primarily by Fusobacterium necrophorum. The condition thrives in wet, unhygienic environments and can rapidly progress from localized infection to systemic disease if left untreated.",
      precautions: [
        "Maintain dry, clean living conditions",
        "Regular hoof trimming",
        "Minimize standing in wet areas",
        "Implement foot bath treatments",
        "Regular veterinary inspections",
        "Proper drainage in pastures"
      ],
      solutions: [
        "Topical and systemic antibiotics",
        "Cleaning and dressing infected areas",
        "Potential surgical debridement",
        "Isolation of infected animals",
        "Pain management",
        "Comprehensive wound care"
      ],
      veterinaryImportance: "Critical for preventing severe lameness and potential systemic infections that can significantly impact herd productivity."
    },
    {
      id: "Lumpy Skin Disease",
      name: "Lumpy Skin Disease",
      symptoms: [
        "Multiple skin nodules",
        "Fever",
        "Reduced milk production",
        "Weight loss",
        "Impaired hide quality",
        "Potential secondary infections",
        "Swollen lymph nodes"
      ],
      details: "Lumpy Skin Disease is a viral infection transmitted by insects, causing widespread skin nodules and significant health complications. The disease can cause severe economic losses through reduced productivity, hide damage, and potential mortality.",
      precautions: [
        "Vector control",
        "Vaccination programs",
        "Quarantine of infected animals",
        "Insect management strategies",
        "Regular health monitoring",
        "Comprehensive biosecurity"
      ],
      solutions: [
        "Vaccination",
        "Symptomatic treatment",
        "Antibiotics for secondary infections",
        "Supportive care",
        "Wound management",
        "Isolation protocols"
      ],
      veterinaryImportance: "Significant economic and animal welfare implications requiring comprehensive management strategies."
    },
    {
      id: "Mange",
      name: "Mange",
      symptoms: [
        "Intense itching",
        "Hair loss",
        "Skin thickening",
        "Scab formation",
        "Reduced animal performance",
        "Potential secondary bacterial infections",
        "Visible skin irritation"
      ],
      details: "Mange is a parasitic skin disease caused by microscopic mites, leading to severe skin irritation and potential secondary complications. Different types of mange mites can cause varying levels of skin damage and animal distress.",
      precautions: [
        "Regular veterinary inspections",
        "Quarantine of new animals",
        "Proper cleaning and disinfection",
        "Periodic treatment against parasites",
        "Maintain good nutrition",
        "Minimize stress"
      ],
      solutions: [
        "Topical and injectable parasiticides",
        "Comprehensive environmental treatment",
        "Supportive skin care",
        "Isolation of infected animals",
        "Repeat treatments",
        "Monitoring for complete eradication"
      ],
      veterinaryImportance: "Critical for maintaining animal health, preventing economic losses, and preventing widespread infestation."
    },
    {
      id: "Mastitis",
      name: "Mastitis",
      symptoms: [
        "Swollen udder",
        "Abnormal milk appearance",
        "Reduced milk production",
        "Potential fever",
        "Hardened or painful udder quarters",
        "Potential systemic infection",
        "Changes in milk consistency"
      ],
      details: "Mastitis is an inflammatory condition of the udder, typically caused by bacterial infections. It's one of the most economically significant diseases in dairy cattle, leading to reduced milk quality, quantity, and potential long-term udder damage.",
      precautions: [
        "Proper milking hygiene",
        "Regular udder cleaning",
        "Maintaining clean milking equipment",
        "Prompt treatment of early symptoms",
        "Regular veterinary checks",
        "Implementing strict milking protocols"
      ],
      solutions: [
        "Targeted antibiotics",
        "Supportive care",
        "Potential culling of chronic cases",
        "Udder hygiene management",
        "Vaccination programs",
        "Comprehensive milk quality monitoring"
      ],
      veterinaryImportance: "Crucial for maintaining dairy herd productivity and milk quality. Early detection and management are key to minimizing economic losses."
    },
    {
      id: "Pediculosis",
      name: "Pediculosis (Lice Infestation)",
      symptoms: [
        "Excessive scratching",
        "Hair loss",
        "Skin irritation",
        "Rough hair coat",
        "Potential weight loss",
        "Reduced animal performance",
        "Visible lice on skin"
      ],
      details: "Pediculosis is a parasitic infestation caused by lice, which can significantly impact cattle health and productivity. These parasites cause intense discomfort and can lead to secondary skin infections and reduced animal performance.",
      precautions: [
        "Regular pest control treatments",
        "Quarantine of new animals",
        "Comprehensive environmental cleaning",
        "Periodic health inspections",
        "Maintain good nutrition",
        "Minimize stress"
      ],
      solutions: [
        "Topical insecticide treatments",
        "Comprehensive herd treatment",
        "Environmental disinfection",
        "Supportive nutritional care",
        "Repeat treatments",
        "Monitoring for complete eradication"
      ],
      veterinaryImportance: "Essential for maintaining animal comfort, preventing productivity losses, and preventing widespread infestation."
    },
    {
      id: "Photosensitization",
      name: "Photosensitization",
      symptoms: [
        "Skin redness and swelling",
        "Hair loss",
        "Skin cracking",
        "Extreme sensitivity to sunlight",
        "Potential severe skin damage",
        "Behavioral changes due to discomfort",
        "Potential secondary infections"
      ],
      details: "Photosensitization is a condition where animals develop extreme sensitivity to sunlight, often caused by liver damage, plant toxins, or genetic factors. It can lead to severe skin damage and significant animal distress.",
      precautions: [
        "Avoid pastures with photosensitizing plants",
        "Provide shade",
        "Regular veterinary monitoring",
        "Balanced nutrition",
        "Minimize sun exposure",
        "Identify and remove toxic plants"
      ],
      solutions: [
        "Shade and protection from sunlight",
        "Topical treatments",
        "Addressing underlying causes",
        "Supportive care",
        "Potential systemic treatments",
        "Dietary management"
      ],
      veterinaryImportance: "Critical for preventing severe skin damage and maintaining animal welfare in susceptible herds."
    },
    {
      id: "Pink Eye",
      name: "Infectious Bovine Keratoconjunctivitis (Pink Eye)",
      symptoms: [
        "Eye inflammation",
        "Excessive tearing",
        "Cloudy or ulcerated cornea",
        "Squinting",
        "Potential blindness",
        "Reduced grazing ability",
        "Potential weight loss"
      ],
      details: "Pink Eye is a highly contagious bacterial infection affecting cattle eyes, primarily caused by Moraxella bovis. The condition can spread rapidly through a herd and potentially lead to permanent vision damage if not treated promptly.",
      precautions: [
        "Fly control",
        "Minimize dust and eye irritants",
        "Quarantine of infected animals",
        "Regular eye inspections",
        "Maintain clean environment",
        "Implement strict biosecurity"
      ],
      solutions: [
        "Topical antibiotics",
        "Eye patches",
        "Systemic antibiotics",
        "Supportive care",
        "Isolation of infected animals",
        "Comprehensive treatment protocols"
      ],
      veterinaryImportance: "Crucial for preventing vision loss and maintaining herd productivity."
    },
    {
      id: "Healthy Cows",
      name: "Healthy Cow Management",
      symptoms: ["No Disease Symptoms"],
      details: "A comprehensive approach to maintaining optimal cattle health through proactive management, nutrition, and preventive care.",
      precautions: [
        "Regular veterinary check-ups",
        "Balanced nutrition",
        "Clean living environment",
        "Stress management",
        "Comprehensive vaccination programs",
        "Genetic selection for robust health"
      ],
      solutions: [
        "Preventive healthcare",
        "Nutrition optimization",
        "Regular health monitoring",
        "Comprehensive biosecurity",
        "Continuous education",
        "Adaptive management strategies"
      ],
      veterinaryImportance: "Proactive health management is key to maintaining productive and resilient cattle herds."
    }
  ];

  try {
    // Batch write to Firestore
    const batch = db.batch();
    diseasesData.forEach((disease) => {
      const diseaseRef = diseasesRef.doc(disease.id);
      batch.set(diseaseRef, disease);
    });

    await batch.commit();
    console.log("Diseases added successfully to Firestore!");
  } catch (error) {
    console.error("Error adding diseases to Firestore:", error);
  }
}

// Run the function
insertDiseaseData().catch(console.error);