# Gaupal

**Gaupal** is an AI-powered digital platform designed to conserve indigenous Indian cattle breeds. It integrates artificial intelligence, computer vision, genetic optimization, and multilingual support to empower farmers, boost biodiversity, and facilitate sustainable agriculture.

---

## 🌟 Features

### Cattle Breed Management
* **Cow Breed Identification & Health Tracking** using AI & image processing
* **Breed Database** with comprehensive information about Indian cattle breeds
* **Cattle Management** system for farmers to track individual animals
* **Genetic Breeding Recommendations** using advanced optimization algorithms

### Health Monitoring & Disease Detection
* **Real-Time Disease Detection** using EfficientNetB3 CNN models (image-based)
* **Symptom-Based Disease Prediction** using ensemble learning models
* **Health Tracking** for individual cattle
* **Vaccination Records** management

### Educational & Support Features
* **Educational Content** in regional languages with gamification features
* **Farmer Assistance** via Gemini AI chatbot
* **Articles & Resources** about cattle breeds and care
* **Event Listings** related to cattle farming

### Marketplace & Commerce
* **Direct-to-Consumer Marketplace** for organic & Ayurvedic cow-based products
* **Farmer Dashboard** for managing products and orders
* **Product Management** for farmers to list and sell items

### Additional Features
* **Google Maps Integration** for location-based services
* **Multi-user Support** with farmer and FLW roles
* **KYC Verification** system
* **Order & Review Management**
* **Notifications & Messaging**

---

## 📂 Project Structure

```
Gaupal/
├── Frontend/                 # React + TailwindCSS client application
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # UI components
│   │   ├── layouts/          # Page layouts
│   │   ├── pages/            # Route components
│   │   ├── services/         # API services
│   │   ├── store/            # Redux store
│   │   └── utils/            # Utility functions
├── Server/                   # Node.js backend with Firebase integration
│   ├── controller/           # API controllers
│   ├── Routes/               # API route definitions
│   ├── ChatBot/              # Gemini AI integration
│   └── utils/                # Backend utilities
├── Models/                   # ML models (EfficientNet, XGBoost, etc.)
│   ├── breed-identification/ # Breed identification model
│   ├── breeding_model/       # Breeding recommendation model
│   ├── disease_identify/     # Disease detection model
│   └── disease-qna/          # Disease Q&A model
├── assets/                   # Project images and assets
└── requirements.txt          # Python dependencies for ML models
```

---

## ⚙️ Technologies Used

### Frontend
* **Framework**: React 19, Vite
* **Styling**: TailwindCSS, CSS Modules
* **State Management**: Redux Toolkit
* **Routing**: React Router v7
* **Maps**: React Google Maps API
* **UI Components**: ShadCN UI, Lucide React, Framer Motion
* **Data Visualization**: Recharts
* **Markdown Rendering**: React Markdown
* **Icons**: React Icons, Lucide React

### Backend
* **Runtime**: Node.js
* **Framework**: Express.js
* **Database**: Firebase Firestore
* **Authentication**: Firebase Auth
* **File Storage**: Firebase Storage
* **Cloud Services**: Google Cloud Platform (Vertex AI, Cloud Storage)
* **APIs**: Google Places, Google Translate, Gemini AI

### Machine Learning & AI
* **Computer Vision**: EfficientNetB3, MobileNetV2/V3
* **Disease Detection**: CNN models for image-based diagnosis
* **Ensemble Learning**: Voting classifiers for symptom-based prediction
* **Genetic Algorithms**: For breeding recommendations
* **NLP**: Gemini AI for chatbot functionality
* **ML Frameworks**: TensorFlow, Scikit-learn, XGBoost

### Development Tools
* **Build Tool**: Vite
* **Code Quality**: ESLint
* **Containerization**: Docker
* **Deployment**: Vercel (Frontend), Google Cloud Run (ML models)

---

## 🚀 Setup Instructions

### 🔧 Prerequisites

* Node.js >= 18.x
* npm >= 8.x
* Firebase CLI (optional)
* Python 3.8+ (for ML models)

### 🔑 Environment Configuration

Create `.env` files in both the `Frontend/` and `Server/` directories.

**Frontend/.env:**
```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
VITE_FIREBASE_APP_ID=your_firebase_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_firebase_measurement_id
VITE_SERVER_URL=http://localhost:5001
VITE_IDENTIFY_BREED=http://localhost:8080
VITE_DISEASE_IDENTIFICATION_MODEL=http://localhost:8081
VITE_DISEASE_QNA=http://localhost:8082
```

**Server/.env:**
```env
PORT=5001
FIREBASE_DATABASE_URL=your_firebase_database_url
GOOGLE_CLOUD_STORAGE_BUCKET=your_google_cloud_storage_bucket
GEMINI_API_KEY=your_gemini_api_key
```

### 1️⃣ Frontend Setup

```bash
cd Frontend
npm install       # Install dependencies
npm run dev       # Start frontend dev server
```

### 2️⃣ Backend Setup

```bash
cd Server
npm install       # Install dependencies
npm run dev       # Start backend server
```

### 3️⃣ Machine Learning Models Setup

The ML models are containerized and can be run with Docker:

**Breed Identification:**
```bash
cd models/breed-identification
docker build -t breed-identify .
docker run -p 8080:8080 --name breed-identify breed-identify
```

**Disease Detection:**
```bash
cd models/disease_identify
docker build -t disease-identify .
docker run -p 8081:8080 --name disease-identify disease-identify
```

**Disease Q&A:**
```bash
cd models/disease-qna
docker build -t disease-qna .
docker run -p 8082:8080 --name disease-qna disease-qna
```

**Breeding Model:**
```bash
cd models/breeding_model
docker build -t breeding-model .
docker run -p 8083:8080 --name breeding-model breeding-model
```

---

## 📋 API Endpoints

### Authentication
* `POST /gaupal/auth/signup` - User registration
* `POST /gaupal/auth/login` - User login
* `POST /gaupal/auth/logout` - User logout (protected)
* `GET /gaupal/auth/profile` - Get user profile (protected)
* `PUT /gaupal/auth/profile` - Update user profile (protected)

### Articles & Breeds
* `GET /gaupal/article/all-breed` - Get all breeds
* `GET /gaupal/article/breed/:breedName` - Get breed by name
* `GET /gaupal/article/random-breeds` - Get random breeds
* `GET /gaupal/article/search-breeds?q=query` - Search breeds
* `POST /gaupal/article/breed` - Add new breed (protected)

### Cattle Management
* `GET /gaupal/farmer/cattle/:farmerId` - Get all cattle for farmer
* `GET /gaupal/farmer/cattle/:cattleId` - Get specific cattle
* `POST /gaupal/farmer/cattle/:farmerId` - Add new cattle
* `PUT /gaupal/farmer/cattle/:cattleId` - Update cattle
* `DELETE /gaupal/farmer/cattle/:cattleId` - Delete cattle
* `POST /gaupal/farmer/cattle/:cattleId/vaccination` - Add vaccination record

### Disease Detection
* `GET /gaupal/farmer/disease/:diseaseId` - Get disease details
* `GET /gaupal/farmer/disease` - Get all diseases
* `GET /gaupal/farmer/disease/search?q=query` - Search diseases

### Chatbot
* `POST /gauguru/chat` - Chat with Gemini AI
* `GET /gauguru/greeting` - Get chatbot greeting

---

## 🤖 AI & Machine Learning Models

### 1. Breed Identification Model
* **Architecture**: MobileNetV2
* **Classes**: 41 Indian cattle breeds
* **Input**: 224x3 RGB images
* **Output**: Breed name with confidence score

### 2. Breeding Recommendation Model
* **Approach**: Genetic Algorithm for feature selection + Random Forest
* **Function**: Recommends compatible bulls for breeding
* **Features**: Considers breed, health, physical traits

### 3. Disease Detection Model
* **Architecture**: EfficientNetB3 and MobileNetV3
* **Input**: Cattle disease images
* **Output**: Disease classification with confidence

### 4. Symptom-Based Disease Prediction
* **Approach**: Ensemble Learning (Decision Tree, Random Forest, KNN)
* **Classes**: 26 cattle diseases
* **Features**: 93 different symptoms
* **Output**: Predicted disease based on symptoms

---

## 📱 User Roles

### Farmer
* Manage cattle inventory and health records
* Access breeding recommendations
* List and sell products
* Track orders and revenue
* Monitor cattle health and vaccination schedules

### FLW
* Browse cattle breeds and educational content
* Identify Different Cattle Breeds
* Access disease information and prevention tips
* View Breed Database
* Locate Nearby NGO's and Gaushalas
* View articles and resources

---

## 🌐 Deployment

### Frontend (Vercel)
1. Push code to GitHub repository
2. Connect Vercel account to repository
3. Set environment variables in Vercel dashboard
4. Deploy automatically on push

### Backend (Google Cloud)
1. Deploy Express server to Google Cloud Run
2. Configure Firebase project
3. Set up domain and SSL certificate
4. Configure environment variables

### ML Models (Docker)
1. Containerize each model
2. Push to container registry
3. Deploy to cloud platform
4. Configure load balancing if needed

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📞 Support

For support, please contact the development team or create an issue in the GitHub repository.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

* Google AI for providing Gemini AI and Vertex AI services
* TensorFlow and Keras for deep learning frameworks
* Firebase for backend services
* The open-source community for various libraries and tools used in this project

<p float="left">
  <img src="./assets/gaupal1.png" width="45%" />
  <img src="./assets/gaupal2.png" width="45%" />
</p>

<p float="left">
  <img src="./assets/gaupal3.png" width="45%" />
  <img src="./assets/gaupal4.png" width="45%" />
</p>

<p float="left">
  <img src="./assets/gaupal5.png" width="100%" />
</p>

Empowering farmers. Preserving heritage. Promoting sustainability.

> GauPal: The smart way to care for India's native cows. 🐄

© 2025 APX Nova. All rights reserved.
