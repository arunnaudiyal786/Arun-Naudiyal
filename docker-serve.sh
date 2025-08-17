#!/bin/bash

# Docker-based Jekyll server
# This solves Ruby compatibility issues by using a controlled environment

echo "🐳 Starting Jekyll with Docker..."
echo "📂 Building Jekyll container..."

# Build the Docker image
docker build -t portfolio-jekyll .

# Run the container
echo "🚀 Starting server on http://localhost:4000"
echo "⚡ Jekyll will automatically reload on file changes"
echo "Press Ctrl+C to stop the server"
echo ""

docker run -it --rm \
  -p 4000:4000 \
  -v "$(pwd):/app" \
  portfolio-jekyll