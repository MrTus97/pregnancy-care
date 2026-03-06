# PowerShell script for Windows - Check deployment readiness
# Usage: .\check-deployment.ps1

Write-Host "[*] Checking Pregnancy Care Tracker deployment readiness..." -ForegroundColor Cyan
Write-Host ""

# Check Node version
Write-Host "[*] Node.js & npm version:" -ForegroundColor Yellow
node --version
npm --version
Write-Host ""

# Check required files
Write-Host "[*] Checking required files:" -ForegroundColor Yellow
$files = @("package.json", "next.config.ts", "public/manifest.json", "vercel.json", ".gitignore")
foreach ($file in $files) {
  if (Test-Path $file) {
    Write-Host "  [OK] $file" -ForegroundColor Green
  }
  else {
    Write-Host "  [!!] $file (missing)" -ForegroundColor Red
  }
}
Write-Host ""

# Check dependencies
Write-Host "[*] Checking key dependencies:" -ForegroundColor Yellow
$deps = @("next", "@supabase/supabase-js", "next-pwa", "react", "recharts")
foreach ($dep in $deps) {
  if (npm list $dep 2>$null | Select-String $dep) {
    Write-Host "  [OK] $dep" -ForegroundColor Green
  }
  else {
    Write-Host "  [!!] $dep" -ForegroundColor Red
  }
}
Write-Host ""

# Check Git setup
Write-Host "[*] Checking Git setup:" -ForegroundColor Yellow
if (Test-Path ".git") {
  Write-Host "  [OK] Git repository initialized" -ForegroundColor Green
  
  try {
    $remote = git remote get-url origin 2>$null
    if ($remote) {
      Write-Host "  [OK] Remote configured: $remote" -ForegroundColor Green
    }
    else {
      Write-Host "  [!!] No remote repository configured" -ForegroundColor Yellow
      Write-Host "     Run: git remote add origin https://github.com/YOUR_USERNAME/counterDate.git"
    }
  }
  catch {
    Write-Host "  [!!] Could not check remote" -ForegroundColor Yellow
  }
  
  try {
    $status = git status --porcelain 2>$null
    if ([string]::IsNullOrEmpty($status)) {
      Write-Host "  [OK] All changes committed" -ForegroundColor Green
    }
    else {
      Write-Host "  [!!] Uncommitted changes detected" -ForegroundColor Yellow
      Write-Host "     Run: git add . ; git commit -m 'Ready for deployment'"
    }
  }
  catch {
    Write-Host "  [!!] Could not check status" -ForegroundColor Yellow
  }
}
else {
  Write-Host "  [!!] Not a Git repository" -ForegroundColor Red
}
Write-Host ""

# Check environment files
Write-Host "[*] Checking environment files:" -ForegroundColor Yellow
if (Test-Path ".env.local") {
  Write-Host "  [OK] .env.local exists" -ForegroundColor Green
  Write-Host "  [*] Contains:" -ForegroundColor Cyan
  Get-Content .env.local | Where-Object { $_ -match "NEXT_PUBLIC" } | ForEach-Object {
    Write-Host "     - $_"
  }
}
else {
  Write-Host "  [*] .env.local not found (set env vars on Vercel instead)" -ForegroundColor Cyan
}
Write-Host ""

# Build check
Write-Host "[*] Testing build:" -ForegroundColor Yellow
Write-Host "  Running: npm run build" -ForegroundColor Gray
$output = npm run build 2>&1 | Out-String
if ($LASTEXITCODE -eq 0) {
  Write-Host "  [OK] Build successful!" -ForegroundColor Green
}
else {
  Write-Host "  [!!] Build failed!" -ForegroundColor Red
  Write-Host "  Please check the errors above and run: npm run build" -ForegroundColor Red
}
Write-Host ""

# Summary
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host "[*] Pre-deployment Checklist:" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Before deploying to Vercel, ensure:" -ForegroundColor Yellow
Write-Host "  [ ] GitHub account created"
Write-Host "  [ ] Vercel account created"
Write-Host "  [ ] Supabase project created"
Write-Host "  [ ] Supabase URL copied"
Write-Host "  [ ] Supabase Anon Key copied"
Write-Host "  [ ] Code committed locally (git status is clean)"
Write-Host "  [ ] Code pushed to GitHub"
Write-Host "  [ ] Build passes locally (checked above)"
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Green
Write-Host "  1. Read: VERCEL_QUICK_START.md"
Write-Host "  2. Push to GitHub: git push origin main"
Write-Host "  3. Go to: https://vercel.com/dashboard"
Write-Host "  4. Import your GitHub repository"
Write-Host "  5. Add Supabase environment variables"
Write-Host "  6. Deploy!"
Write-Host ""
Write-Host "Ready for deployment..." -ForegroundColor Green
