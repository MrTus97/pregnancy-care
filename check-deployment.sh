#!/bin/bash
# Script to verify project is ready for Vercel deployment

echo "🔍 Checking Pregnancy Care Tracker deployment readiness..."
echo ""

# Check Node version
echo "✓ Node.js version:"
node --version
npm --version
echo ""

# Check required files
echo "✓ Checking required files:"
files=("package.json" "next.config.ts" "public/manifest.json" "vercel.json" ".gitignore")
for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "  ✅ $file"
  else
    echo "  ❌ $file (missing)"
  fi
done
echo ""

# Check dependencies
echo "✓ Checking dependencies:"
if npm ls next > /dev/null 2>&1; then
  echo "  ✅ next installed"
else
  echo "  ❌ next not found"
fi

if npm ls @supabase/supabase-js > /dev/null 2>&1; then
  echo "  ✅ @supabase/supabase-js installed"
else
  echo "  ❌ @supabase/supabase-js not found"
fi

if npm ls next-pwa > /dev/null 2>&1; then
  echo "  ✅ next-pwa installed"
else
  echo "  ❌ next-pwa not found"
fi
echo ""

# Check Git setup
echo "✓ Checking Git setup:"
if git rev-parse --git-dir > /dev/null 2>&1; then
  echo "  ✅ Git repository initialized"
  
  # Check remote
  if git remote get-url origin > /dev/null 2>&1; then
    echo "  ✅ Remote repository configured"
    echo "     Remote: $(git remote get-url origin)"
  else
    echo "  ⚠️  No remote repository configured yet"
    echo "     Run: git remote add origin <your-github-url>"
  fi
  
  # Check uncommitted changes
  if [ -z "$(git status --porcelain)" ]; then
    echo "  ✅ All changes committed"
  else
    echo "  ⚠️  Uncommitted changes detected"
    echo "     Run: git add . && git commit -m 'Ready for deployment'"
  fi
else
  echo "  ❌ Not a Git repository"
fi
echo ""

# Check environment setup
echo "✓ Checking environment files:"
if [ -f ".env.local" ]; then
  echo "  ✅ .env.local exists"
  echo "  ⚠️  Make sure variables are set:"
  echo "     - NEXT_PUBLIC_SUPABASE_URL"
  echo "     - NEXT_PUBLIC_SUPABASE_ANON_KEY"
else
  echo "  ℹ️  .env.local not found (you'll set on Vercel)"
fi
echo ""

# Build check
echo "✓ Testing build:"
npm run build > /tmp/build.log 2>&1
if [ $? -eq 0 ]; then
  echo "  ✅ Build successful"
else
  echo "  ❌ Build failed"
  echo "  Please check: npm run build"
fi
echo ""

echo "═══════════════════════════════════════"
echo "📋 Pre-deployment Checklist:"
echo "═══════════════════════════════════════"
echo ""
echo "Before deploying to Vercel, ensure:"
echo "  [ ] GitHub account created"
echo "  [ ] Repository pushed to GitHub"
echo "  [ ] Vercel account created"
echo "  [ ] Supabase URL ready"
echo "  [ ] Supabase Anon Key ready"
echo "  [ ] .env.local has correct values (for local testing)"
echo "  [ ] Build passes locally (npm run build)"
echo "  [ ] All changes committed (git status is clean)"
echo ""
echo "Then follow VERCEL_QUICK_START.md for step-by-step guide!"
echo ""
echo "✨ Ready to deploy? Run: git push origin main"
