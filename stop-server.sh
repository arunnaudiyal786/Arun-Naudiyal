#!/bin/bash

# Script to stop all portfolio development servers
# Handles Python HTTP servers, Jekyll servers, and Docker containers

echo "🛑 Stopping portfolio development servers..."

# Function to kill processes by port
kill_by_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null)
    
    if [ -n "$pids" ]; then
        echo "   📍 Found processes on port $port: $pids"
        kill -9 $pids 2>/dev/null
        echo "   ✅ Stopped processes on port $port"
    else
        echo "   ℹ️  No processes running on port $port"
    fi
}

# Function to kill processes by name pattern
kill_by_pattern() {
    local pattern=$1
    local description=$2
    local pids=$(pgrep -f "$pattern" 2>/dev/null)
    
    if [ -n "$pids" ]; then
        echo "   📍 Found $description processes: $pids"
        pkill -f "$pattern" 2>/dev/null
        echo "   ✅ Stopped $description processes"
    else
        echo "   ℹ️  No $description processes running"
    fi
}

# Stop servers on common development ports
echo "🔍 Checking common development ports..."
kill_by_port 4000
kill_by_port 4001
kill_by_port 8000
kill_by_port 3000

# Stop Python HTTP servers
echo "🐍 Stopping Python HTTP servers..."
kill_by_pattern "python.*http.server" "Python HTTP server"
kill_by_pattern "python3.*http.server" "Python3 HTTP server"

# Stop Jekyll servers
echo "💎 Stopping Jekyll servers..."
kill_by_pattern "jekyll.*serve" "Jekyll"
kill_by_pattern "bundle.*jekyll" "Bundle Jekyll"

# Stop Docker containers with portfolio in the name
echo "🐳 Stopping Docker containers..."
DOCKER_CONTAINERS=$(docker ps -q --filter "ancestor=portfolio-jekyll" 2>/dev/null)
if [ -n "$DOCKER_CONTAINERS" ]; then
    echo "   📍 Found portfolio Docker containers: $DOCKER_CONTAINERS"
    docker stop $DOCKER_CONTAINERS
    echo "   ✅ Stopped portfolio Docker containers"
else
    echo "   ℹ️  No portfolio Docker containers running"
fi

# Additional cleanup for any background processes started by our scripts
echo "🧹 Additional cleanup..."
kill_by_pattern "serve.sh" "serve.sh script"

# Check if any processes are still running on the main ports
echo "🔍 Final verification..."
REMAINING_4000=$(lsof -ti:4000 2>/dev/null)
REMAINING_8000=$(lsof -ti:8000 2>/dev/null)

if [ -n "$REMAINING_4000" ] || [ -n "$REMAINING_8000" ]; then
    echo "⚠️  Some processes may still be running:"
    [ -n "$REMAINING_4000" ] && echo "   Port 4000: $REMAINING_4000"
    [ -n "$REMAINING_8000" ] && echo "   Port 8000: $REMAINING_8000"
    echo "   You may need to manually kill them with: kill -9 <PID>"
else
    echo "✅ All portfolio servers stopped successfully!"
fi

echo ""
echo "🎉 Server cleanup complete!"
echo "💡 To start the server again, run: ./serve.sh"