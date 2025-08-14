#!/usr/bin/env node

/**
 * Script de vérification de la configuration GuinéeMarket
 * Exécutez ce script pour vérifier que tout est configuré correctement
 */

import fs from "fs";
import path from "path";

console.log("🔍 Vérification de la configuration GuinéeMarket...\n");

// Vérifier la présence du fichier .env
const envPath = path.join(process.cwd(), ".env");
if (!fs.existsSync(envPath)) {
  console.log("❌ Fichier .env manquant");
  console.log("📝 Créez un fichier .env à la racine du projet avec :");
  console.log("   VITE_SUPABASE_URL=votre_url_supabase");
  console.log("   VITE_SUPABASE_ANON_KEY=votre_cle_anonyme_supabase");
  console.log("\n💡 Copiez le fichier env.example vers .env");
} else {
  console.log("✅ Fichier .env trouvé");

  // Lire et vérifier le contenu du .env
  const envContent = fs.readFileSync(envPath, "utf8");
  const lines = envContent.split("\n");

  let hasSupabaseUrl = false;
  let hasSupabaseKey = false;

  lines.forEach((line) => {
    if (line.includes("VITE_SUPABASE_URL=")) {
      hasSupabaseUrl = true;
      const url = line.split("=")[1];
      if (
        url &&
        !url.includes("votre_url") &&
        !url.includes("votre-projet-id")
      ) {
        console.log("✅ VITE_SUPABASE_URL configuré");
      } else {
        console.log(
          "⚠️  VITE_SUPABASE_URL doit être configuré avec votre vraie URL"
        );
      }
    }

    if (line.includes("VITE_SUPABASE_ANON_KEY=")) {
      hasSupabaseKey = true;
      const key = line.split("=")[1];
      if (
        key &&
        !key.includes("votre_cle") &&
        !key.includes("votre_cle_anonyme")
      ) {
        console.log("✅ VITE_SUPABASE_ANON_KEY configuré");
      } else {
        console.log(
          "⚠️  VITE_SUPABASE_ANON_KEY doit être configuré avec votre vraie clé"
        );
      }
    }
  });

  if (!hasSupabaseUrl) {
    console.log("❌ VITE_SUPABASE_URL manquant dans le fichier .env");
  }

  if (!hasSupabaseKey) {
    console.log("❌ VITE_SUPABASE_ANON_KEY manquant dans le fichier .env");
  }
}

// Vérifier les dépendances
console.log("\n📦 Vérification des dépendances...");

try {
  const packageJson = JSON.parse(fs.readFileSync("package.json", "utf8"));
  const requiredDeps = ["@supabase/supabase-js", "react", "react-dom"];

  requiredDeps.forEach((dep) => {
    if (packageJson.dependencies[dep]) {
      console.log(`✅ ${dep} installé (${packageJson.dependencies[dep]})`);
    } else {
      console.log(`❌ ${dep} manquant`);
    }
  });
} catch (error) {
  console.log("❌ Erreur lors de la lecture du package.json");
}

// Vérifier la structure des dossiers
console.log("\n📁 Vérification de la structure...");

const requiredDirs = [
  "src",
  "src/components",
  "src/hooks",
  "src/types",
  "src/lib",
];
requiredDirs.forEach((dir) => {
  if (fs.existsSync(dir)) {
    console.log(`✅ ${dir}/`);
  } else {
    console.log(`❌ ${dir}/ manquant`);
  }
});

// Instructions de configuration
console.log("\n🚀 Instructions de configuration :");
console.log("1. Créez un projet sur https://supabase.com");
console.log("2. Copiez vos clés dans le fichier .env");
console.log("3. Exécutez le script database-setup.sql dans Supabase");
console.log("4. Lancez le projet avec : npm run dev");

console.log("\n📚 Documentation :");
console.log("- README.md : Instructions générales");
console.log("- SETUP_INSTRUCTIONS.md : Configuration rapide");
console.log("- CONFIGURATION_SUPABASE.md : Configuration détaillée");
console.log("- database-setup.sql : Script de base de données");

console.log("\n✨ Configuration terminée !");
