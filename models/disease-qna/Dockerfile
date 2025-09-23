# Use Python as the base image
FROM python:3.10-slim  
# Match your local Python version

# Set the working directory in the container
WORKDIR /app

# Copy requirements first to leverage Docker cache
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application code and model
COPY main.py /app/
COPY model/ensemble_model_cattle_disease_prediction.pkl /app/model/ensemble_model_cattle_disease_prediction.pkl

# Expose port 7000
EXPOSE 8080

# Command to run FastAPI server

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]
