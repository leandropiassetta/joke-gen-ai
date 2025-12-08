#!/bin/bash

# Colors for output
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${BLUE}  🐳 Docker Compose - Building and Starting Services${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""

# Run docker compose up with build
docker compose up --build -d

echo ""
echo -e "${YELLOW}Waiting for services to initialize...${NC}"
echo ""

# Wait a bit for services to start
sleep 5

# Run the health check script
bash ./healthcheck.sh
