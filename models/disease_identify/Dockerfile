# Use official Python slim image for a smaller base
FROM python:3.9-slim

# Prevent Python from writing bytecode and buffering outputs
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set working directory in the container
WORKDIR /app

# Update and clean package lists to reduce image size
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Copy only the requirements file first for better caching
COPY requirements.txt .

# Install dependencies with no cache and remove unnecessary packages
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code to the container
COPY . .

# Copy the trained model to the correct path
COPY model/cow_health_efficientnetb3_tuned.h5 /app/model/cow_health_efficientnetb3_tuned.h5

# Ensure the uploads directory exists and has proper permissions
RUN mkdir -p uploads && \
    chmod -R 755 uploads

# Expose the application port
EXPOSE 8080

# Command to run the FastAPI application with Uvicorn
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080"]