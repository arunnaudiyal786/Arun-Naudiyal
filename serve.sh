#!/bin/bash

# Simple server script for the portfolio website
# This serves the site without Jekyll dependencies

PORT=${1:-4000}

echo "🚀 Starting portfolio server on port $PORT..."
echo "📂 Serving from: $(pwd)"
echo "🌐 Visit: http://localhost:$PORT"
echo "⚡ Your dynamic configuration system is ready!"
echo ""
echo "📝 To update content:"
echo "   1. Edit config.yaml"
echo "   2. Refresh your browser"
echo ""
echo "🛑 To stop the server:"
echo "   • Press Ctrl+C (if running in foreground)"
echo "   • Run: ./stop-server.sh (to stop all servers)"
echo ""

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    python3 -m http.server $PORT
elif command -v python &> /dev/null; then
    python -m http.server $PORT
else
    echo "❌ Error: Python is not installed or not in PATH"
    echo "Please install Python to run the server"
    exit 1
fi