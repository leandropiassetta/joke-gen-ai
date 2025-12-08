#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to check container health
check_container_health() {
    local container_name=$1
    local service_name=$2
    local check_command=$3

    # Wait a moment for container to be ready
    sleep 2

    # Try to get container status
    local status=$(docker inspect "$container_name" --format='{{.State.Status}}' 2>/dev/null)
    
    if [ "$status" != "running" ]; then
        echo -e "${RED}✗ ${service_name}${NC} - Container not running"
        return 1
    fi

    # Try to execute health check command
    if eval "$check_command" > /dev/null 2>&1; then
        echo -e "${GREEN}✓ ${service_name}${NC} - Healthy"
        return 0
    else
        echo -e "${YELLOW}⚠ ${service_name}${NC} - Running (check pending)"
        return 2
    fi
}

# Print header
echo ""
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║           🚀 Joke Gen AI - Health Check Status              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check each service
check_container_health "joker_db" "PostgreSQL Database" "docker exec joker_db pg_isready -U postgres -q"
db_status=$?

sleep 1

check_container_health "joker_backend" "AdonisJS Backend" "curl -sf http://localhost:3333/health > /dev/null"
backend_status=$?

sleep 1

check_container_health "joker_frontend" "Vue.js Frontend" "curl -sf http://localhost:5173/ > /dev/null"
frontend_status=$?

echo ""

# Print summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"

if [ $db_status -eq 0 ] && [ $backend_status -eq 0 ] && [ $frontend_status -eq 0 ]; then
    echo -e "${BLUE}║${NC}              ${GREEN}✓ All Services Healthy${NC}"
    echo -e "${BLUE}║${NC}"
    echo -e "${BLUE}║${NC}  Frontend:  ${GREEN}http://localhost:5173${NC}"
    echo -e "${BLUE}║${NC}  Backend:   ${GREEN}http://localhost:3333${NC}"
    echo -e "${BLUE}║${NC}  Database:  ${GREEN}postgresql://localhost:5432${NC}"
else
    echo -e "${BLUE}║${NC}              ${YELLOW}⚠ Services Starting${NC}"
    echo -e "${BLUE}║${NC}  Some services may still be initializing..."
fi

echo -e "${BLUE}║${NC}"
echo -e "${BLUE}║${NC}  Run: ${YELLOW}docker compose logs -f${NC} for full logs"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
