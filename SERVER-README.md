# Server Management Guide

This guide explains how to start and stop your portfolio development server.

## 🚀 Starting the Server

### Option 1: Using the start script (Recommended)
```bash
./serve.sh
```

### Option 2: Using Python directly
```bash
python3 -m http.server 4000
```

### Option 3: Custom port
```bash
./serve.sh 8080  # Starts server on port 8080
```

## 🛑 Stopping the Server

### Option 1: Using the stop script (Recommended)
```bash
./stop-server.sh
```
This script will:
- Stop all servers on common ports (4000, 4001, 8000, 3000)
- Kill Python HTTP servers
- Stop Jekyll processes
- Stop Docker containers
- Provide verification of cleanup

### Option 2: Manual stop (if server is in foreground)
```bash
Ctrl+C
```

### Option 3: Kill specific port
```bash
lsof -ti:4000 | xargs kill -9  # Kills processes on port 4000
```

## 📊 Checking Server Status

### Check what's running on specific ports
```bash
lsof -i:4000  # Check port 4000
lsof -i:8000  # Check port 8000
```

### List all HTTP servers
```bash
ps aux | grep "http.server"
```

### Check if your site is accessible
```bash
curl -s -o /dev/null -w "%{http_code}" http://localhost:4000
```
- Returns `200` if server is running
- Returns connection error if server is stopped

## 🔧 Troubleshooting

### "Address already in use" error
```bash
./stop-server.sh  # Stop all servers
./serve.sh        # Start fresh
```

### Server won't stop
```bash
# Find the process ID
lsof -ti:4000

# Kill it forcefully (replace PID with actual process ID)
kill -9 <PID>
```

### Permission denied when running scripts
```bash
chmod +x serve.sh
chmod +x stop-server.sh
chmod +x docker-serve.sh
```

## 🌐 Accessing Your Site

Once the server is running:
- **Local access**: http://localhost:4000
- **Network access**: http://YOUR_IP:4000 (if firewall allows)

## 📝 Development Workflow

1. **Start server**: `./serve.sh`
2. **Edit content**: Modify `config.yaml`
3. **View changes**: Refresh browser
4. **Stop server**: `./stop-server.sh` (when done)

## 🚨 Emergency Stop

If everything else fails:
```bash
sudo pkill -f "python.*http.server"
sudo pkill -f "jekyll"
sudo pkill -f "bundle"
```

**Note**: Use `sudo` only as a last resort and be careful with these commands.