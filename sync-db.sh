#!/bin/bash

# LS Lacrosse - Sync Production DB to Local Dev
# Usage: ./sync-db.sh

set -e

echo "🔄 Syncing production database to local development..."
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Step 1: Export from production
echo -e "${BLUE}Step 1/3:${NC} Exporting production database..."
pnpm exec wrangler d1 export ls-lacrosse-db --remote --output=./prod-backup.sql

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓${NC} Production data exported successfully"
else
  echo -e "${RED}✗${NC} Failed to export production data"
  exit 1
fi

echo ""

# Step 2: Backup current local database
echo -e "${BLUE}Step 2/3:${NC} Backing up current local database..."
LOCAL_DB_PATH=".wrangler/state/v3/d1/miniflare-D1DatabaseObject"
DB_FILE=$(find $LOCAL_DB_PATH -name "*.sqlite" -type f | head -n 1)

if [ -n "$DB_FILE" ]; then
  cp "$DB_FILE" "${DB_FILE}.backup"
  echo -e "${GREEN}✓${NC} Local database backed up"
else
  echo -e "${BLUE}ℹ${NC} No existing local database found (this is normal for first run)"
fi

echo ""

# Step 3: Import to local
echo -e "${BLUE}Step 3/3:${NC} Importing to local development database..."
pnpm exec wrangler d1 execute D1 --local --file=./prod-backup.sql

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✓${NC} Data imported successfully"
else
  echo -e "${RED}✗${NC} Failed to import data"
  exit 1
fi

echo ""
echo -e "${GREEN}✓ Database sync complete!${NC}"
echo ""
echo "Next steps:"
echo "  1. Start your dev server: pnpm run dev"
echo "  2. Visit http://localhost:3000/admin"
echo "  3. Your production data should now be available locally"
echo ""
echo "Note: The backup SQL file is saved as prod-backup.sql"
