# AI-Powered Bovine Intelligence Suite

Welcome to the complete suite of **AI Models for Indian Cattle Breed Classification and Disease Diagnosis**, combining the power of **Deep Learning** and **Ensemble Machine Learning** to assist farmers, veterinarians, and livestock authorities with intelligent, scalable, and reliable solutions.


## Model 1: Cow Breed Classification using MobileNetV2

### Description
This model classifies images of Indian cow breeds using a lightweight and efficient **MobileNetV2** architecture. It’s ideal for mobile and web deployment due to its low size and fast inference time.

### Features
- Input Shape: `224x224x3`
- 41 Breed Classes
- Real-time image augmentation
- Multi-GPU training using `tf.distribute.MirroredStrategy`
- Output: `cow_breed_mobilenetv2.h5`

### ScreenShot:
  ![image](https://github.com/user-attachments/assets/fd3b0f51-38f3-4345-8d07-0ed78547329c)

## Model 2: AI-Powered Cattle Recommendation for Breeding
### Description
This model uses a Genetic Algorithm for Feature Selection combined with a Random Forest-based Recommendation Engine to suggest the most genetically compatible bulls for breeding. It evaluates cow profiles based on breed, health, and physical traits, then intelligently matches them with optimal bulls from the database.

### Features
- Uses Genetic Algorithms (GA) for feature selection
- Built with Random Forest for prediction and ranking
- Handles both classification and regression tasks
- Learns from historical cow-bull breeding data
- Outputs top 3 most compatible bulls with confidence scores

### ScreenShot:
![image](https://github.com/user-attachments/assets/75a715df-2b98-4510-8aaf-a276d11db6c9)
![image](https://github.com/user-attachments/assets/913f2ca3-559c-4a38-9529-db2ecca15e43)



## Model 3: Cattle Disease Prediction from Symptoms (Ensemble Learning)
### Description
This AI model predicts cattle diseases based on symptoms provided by the user, using an ensemble approach that combines multiple classifiers for higher accuracy and generalization.

By training on a labeled dataset of 26 cattle diseases and 93 symptoms, the model can identify the most probable disease given observed symptoms. It uses a Voting Classifier that includes:
- Decision Tree
- Random Forest
- K-Nearest Neighbors (KNN)

### Features
Key Features
- Handles 93 different symptoms
- Predicts one of 26 cattle diseases
- Ensemble learning for robust accuracy
- Trained on real-world veterinary data
- Saved model: ensemble_model_cattle_disease_prediction.pkl

### ScreenShot:
![image](https://github.com/user-attachments/assets/92433235-9622-48b2-b825-9e4b90cb0439)


## Model 4: Cattle Disease Prediction Using Deep Learning
### Description
This project leverages deep learning models like MobileNetV3 and EfficientNetB3 to classify cattle diseases using images. It supports multi-GPU training via TensorFlow’s MirroredStrategy and includes data preprocessing, augmentation, class balancing, and fine-tuned model training.

### Features
- Real-time data augmentation
- Train/Validation/Test splitting
- Balanced training using class_weight
- Multi-GPU support via MirroredStrategy
- MobileNetV3 and EfficientNetB3 models trained
- Exportable .h5 models for production use
- Integrated with Kaggle GPU (T4)

### ScreenShot:
![image](https://github.com/user-attachments/assets/f1dd4749-5ee8-451a-a0ea-9fbcf367d4eb)


## Installation & Setup Guide

###  1. Export Trained Models
Export all trained models from their respective .ipynb notebooks and save them as files in the correct directories.

### 2. Run with Docker
Each model module can be Dockerized and run independently.

breed- identification 
```
.cd mode/breed-identification
. mkdir model
. export the model in ".h5" format from ipynb and put it in model dir and update the path in main.py and Dockerfile
-> docker build -t breed-identify .
->docker run -p 8080:8080 --name breed-identify breed-identify
```

breeding_model
```
.cd mode/breed-identification
. mkdir model
. export the model in ".h5" format from ipynb and put it in model dir and update the path in main.py and Dockerfile
-> docker build -t breed-identify .
->docker run -p 8080:8080 --name breed-identify breed-identify
```


disease-qna
```
.cd mode/breed-identification
. mkdir model
. export the model in ".h5" format from ipynb and put it in model dir and update the path in main.py and Dockerfile
-> docker build -t breed-identify .
->docker run -p 8080:8080 --name breed-identify breed-identify
```



disease_identify
```
.cd mode/breed-identification
. mkdir model
. export the model in ".h5" format from ipynb and put it in model dir and update the path in main.py and Dockerfile
-> docker build -t breed-identify .
->docker run -p 8080:8080 --name breed-identify breed-identify
```
