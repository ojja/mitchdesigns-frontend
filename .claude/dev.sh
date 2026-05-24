#!/bin/bash
cd /Users/ojja/Documents/Claude/Projects/MD-website-v1/frontend
NODE=/Users/ojja/.nvm/versions/node/v22.21.1/bin/node
PNPM=$($NODE -e "require('child_process').execSync('npm root -g', {encoding:'utf8'}).trim() + '/pnpm/bin/pnpm.cjs'" 2>/dev/null || echo "")

# Find pnpm.cjs under v22 node_modules
PNPM_CJS=$($NODE -e "console.log(require.resolve('pnpm/bin/pnpm.cjs'))" 2>/dev/null || echo "")

if [ -z "$PNPM_CJS" ]; then
  # fallback: locate via npm global root for v22
  GLOBAL_ROOT=$($NODE -e "const {execSync}=require('child_process'); console.log(execSync('npm root -g',{encoding:'utf8'}).trim())")
  PNPM_CJS="$GLOBAL_ROOT/pnpm/bin/pnpm.cjs"
fi

exec "$NODE" "$PNPM_CJS" dev
