# Script de vérification de la configuration GuinéeMarket
# Exécutez ce script PowerShell pour vérifier que tout est configuré correctement

Write-Host "🔍 Vérification de la configuration GuinéeMarket..." -ForegroundColor Cyan
Write-Host ""

# Vérifier la présence du fichier .env
$envPath = Join-Path $PWD ".env"
if (-not (Test-Path $envPath)) {
    Write-Host "❌ Fichier .env manquant" -ForegroundColor Red
    Write-Host "📝 Créez un fichier .env à la racine du projet avec :" -ForegroundColor Yellow
    Write-Host "   VITE_SUPABASE_URL=votre_url_supabase" -ForegroundColor White
    Write-Host "   VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase" -ForegroundColor White
    Write-Host ""
    Write-Host "💡 Copiez le fichier env.example vers .env" -ForegroundColor Yellow
} else {
    Write-Host "✅ Fichier .env trouvé" -ForegroundColor Green
    
    # Lire et vérifier le contenu du .env
    $envContent = Get-Content $envPath -Raw
    $lines = $envContent -split "`n"
    
    $hasSupabaseUrl = $false
    $hasSupabaseKey = $false
    
    foreach ($line in $lines) {
        if ($line -match "VITE_SUPABASE_URL=") {
            $hasSupabaseUrl = $true
            $url = $line -split "=" | Select-Object -Last 1
            if ($url -and $url -notmatch "votre_url" -and $url -notmatch "votre-projet-id") {
                Write-Host "✅ VITE_SUPABASE_URL configuré" -ForegroundColor Green
            } else {
                Write-Host "⚠️  VITE_SUPABASE_URL doit être configuré avec votre vraie URL" -ForegroundColor Yellow
            }
        }
        
        if ($line -match "VITE_SUPABASE_ANON_KEY=") {
            $hasSupabaseKey = $true
            $key = $line -split "=" | Select-Object -Last 1
            if ($key -and $key -notmatch "votre_cle" -and $key -notmatch "votre_cle_anonyme") {
                Write-Host "✅ VITE_SUPABASE_ANON_KEY configuré" -ForegroundColor Green
            } else {
                Write-Host "⚠️  VITE_SUPABASE_ANON_KEY doit être configuré avec votre vraie clé" -ForegroundColor Yellow
            }
        }
    }
    
    if (-not $hasSupabaseUrl) {
        Write-Host "❌ VITE_SUPABASE_URL manquant dans le fichier .env" -ForegroundColor Red
    }
    
    if (-not $hasSupabaseKey) {
        Write-Host "❌ VITE_SUPABASE_ANON_KEY manquant dans le fichier .env" -ForegroundColor Red
    }
}

# Vérifier les dépendances
Write-Host ""
Write-Host "📦 Vérification des dépendances..." -ForegroundColor Cyan

try {
    $packageJson = Get-Content "package.json" -Raw | ConvertFrom-Json
    $requiredDeps = @("@supabase/supabase-js", "react", "react-dom")
    
    foreach ($dep in $requiredDeps) {
        if ($packageJson.dependencies.$dep) {
            Write-Host "✅ $dep installé ($($packageJson.dependencies.$dep))" -ForegroundColor Green
        } else {
            Write-Host "❌ $dep manquant" -ForegroundColor Red
        }
    }
} catch {
    Write-Host "❌ Erreur lors de la lecture du package.json" -ForegroundColor Red
}

# Vérifier la structure des dossiers
Write-Host ""
Write-Host "📁 Vérification de la structure..." -ForegroundColor Cyan

$requiredDirs = @("src", "src/components", "src/hooks", "src/types", "src/lib")
foreach ($dir in $requiredDirs) {
    if (Test-Path $dir) {
        Write-Host "✅ $dir/" -ForegroundColor Green
    } else {
        Write-Host "❌ $dir/ manquant" -ForegroundColor Red
    }
}

# Instructions de configuration
Write-Host ""
Write-Host "🚀 Instructions de configuration :" -ForegroundColor Cyan
Write-Host "1. Créez un projet sur https://supabase.com" -ForegroundColor White
Write-Host "2. Copiez vos clés dans le fichier .env" -ForegroundColor White
Write-Host "3. Exécutez le script database-setup.sql dans Supabase" -ForegroundColor White
Write-Host "4. Lancez le projet avec : npm run dev" -ForegroundColor White

Write-Host ""
Write-Host "📚 Documentation :" -ForegroundColor Cyan
Write-Host "- README.md : Instructions générales" -ForegroundColor White
Write-Host "- SETUP_INSTRUCTIONS.md : Configuration rapide" -ForegroundColor White
Write-Host "- CONFIGURATION_SUPABASE.md : Configuration détaillée" -ForegroundColor White
Write-Host "- database-setup.sql : Script de base de données" -ForegroundColor White

Write-Host ""
Write-Host "✨ Configuration terminée !" -ForegroundColor Green
