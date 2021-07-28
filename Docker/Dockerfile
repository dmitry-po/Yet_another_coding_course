# Source: https://hub.docker.com/_/python/
# Base image
FROM python:3
# Set working directory
WORKDIR /usr/src/app
# Copy data to working directory
COPY . .
# Setting the port
EXPOSE 5000
# Execute application
CMD ["python", "./app.py"]
