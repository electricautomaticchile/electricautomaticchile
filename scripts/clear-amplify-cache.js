#!/usr/bin/env node

/**
 * Script para limpiar cache de AWS Amplify y optimizar deployment
 * Uso: node scripts/clear-amplify-cache.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🔄 Iniciando limpieza de cache de AWS Amplify...\n');

// 1. Limpiar cache local de Next.js
console.log('📁 Limpiando cache local de Next.js...');
try {
  // Eliminar .next
  if (fs.existsSync('.next')) {
    fs.rmSync('.next', { recursive: true, force: true });
    console.log('✅ Directorio .next eliminado');
  }
  
  // Eliminar out
  if (fs.existsSync('out')) {
    fs.rmSync('out', { recursive: true, force: true });
    console.log('✅ Directorio out eliminado');
  }
  
  // Eliminar node_modules/.cache
  const cacheDir = path.join('node_modules', '.cache');
  if (fs.existsSync(cacheDir)) {
    fs.rmSync(cacheDir, { recursive: true, force: true });
    console.log('✅ Cache de node_modules eliminado');
  }
} catch (error) {
  console.log('⚠️  Error limpiando cache local:', error.message);
}

// 2. Generar nuevo build ID
console.log('\n🔨 Generando nuevo build ID...');
const newBuildId = `amplify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
console.log(`✅ Nuevo Build ID: ${newBuildId}`);

// 3. Crear archivo de invalidación de cache
console.log('\n📝 Creando archivo de invalidación de cache...');
const cacheInvalidationFile = path.join('public', 'cache-invalidation.json');
const cacheData = {
  timestamp: new Date().toISOString(),
  buildId: newBuildId,
  version: require('../package.json').version,
  lastUpdate: 'Google OAuth removal and cache optimization'
};

// Asegurar que el directorio public existe
if (!fs.existsSync('public')) {
  fs.mkdirSync('public');
}

fs.writeFileSync(cacheInvalidationFile, JSON.stringify(cacheData, null, 2));
console.log('✅ Archivo de invalidación creado en public/cache-invalidation.json');

// 4. Crear archivo _headers para Amplify
console.log('\n📋 Creando archivo _headers para Amplify...');
const headersContent = `# Headers para control de cache en Amplify
/*
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0
  X-Frame-Options: DENY
  X-Content-Type-Options: nosniff
  X-XSS-Protection: 1; mode=block
  Referrer-Policy: strict-origin-when-cross-origin

/api/*
  Cache-Control: no-cache, no-store, must-revalidate
  Pragma: no-cache
  Expires: 0

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/static/*
  Cache-Control: public, max-age=31536000, immutable
`;

fs.writeFileSync(path.join('public', '_headers'), headersContent);
console.log('✅ Archivo _headers creado');

// 5. Crear archivo _redirects para Amplify
console.log('\n🔀 Creando archivo _redirects para Amplify...');
const redirectsContent = `# Redirects para AWS Amplify
/dashboard-cliente /dashboard-cliente/index.html 200
/dashboard-empresa /dashboard-empresa/index.html 200
/dashboard-superadmin /dashboard-superadmin/index.html 200
/auth/login /auth/login/index.html 200
/auth/recovery /auth/recovery/index.html 200

# Fallback para SPA
/* /index.html 200
`;

fs.writeFileSync(path.join('public', '_redirects'), redirectsContent);
console.log('✅ Archivo _redirects creado');

// 6. Crear configuración de build para Amplify
console.log('\n⚙️  Actualizando configuración de build...');
const amplifyConfig = {
  version: 1,
  applications: [
    {
      frontend: {
        phases: {
          preBuild: {
            commands: [
              'echo "Limpiando cache..."',
              'rm -rf .next',
              'rm -rf out',
              'rm -rf node_modules/.cache',
              'npm ci'
            ]
          },
          build: {
            commands: [
              'echo "Construyendo aplicación..."',
              'npm run build'
            ]
          },
          postBuild: {
            commands: [
              'echo "Post-build optimizaciones..."',
              'echo "Build completado con éxito"'
            ]
          }
        },
        artifacts: {
          baseDirectory: '.next',
          files: [
            '**/*'
          ]
        },
        cache: {
          paths: []
        }
      }
    }
  ]
};

fs.writeFileSync('amplify.yml', `version: 1
applications:
  - frontend:
      phases:
        preBuild:
          commands:
            - echo "🔄 Limpiando cache de build anterior..."
            - rm -rf .next
            - rm -rf out
            - rm -rf node_modules/.cache
            - echo "📦 Instalando dependencias..."
            - npm ci
        build:
          commands:
            - echo "🔨 Construyendo aplicación..."
            - echo "Build ID: ${newBuildId}"
            - npm run build
        postBuild:
          commands:
            - echo "✅ Build completado exitosamente"
            - echo "Timestamp: $(date)"
      artifacts:
        baseDirectory: .next
        files:
          - '**/*'
      cache:
        paths: []
`);
console.log('✅ Archivo amplify.yml actualizado');

// 7. Actualizar package.json con nuevos scripts
console.log('\n📦 Actualizando scripts de package.json...');
const packageJsonPath = 'package.json';
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

packageJson.scripts = {
  ...packageJson.scripts,
  'clear-cache': 'node scripts/clear-amplify-cache.js',
  'amplify:build': 'npm run clear-cache && npm run build',
  'amplify:deploy': 'npm run clear-cache && npm run build',
  'build:fresh': 'rm -rf .next && rm -rf out && npm run build'
};

fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('✅ Scripts actualizados en package.json');

// 8. Instrucciones finales
console.log('\n🎯 PASOS PARA LIMPIAR CACHE EN AMPLIFY:\n');
console.log('1️⃣  OPCIÓN AUTOMÁTICA (recomendada):');
console.log('   - Haz commit de estos cambios');
console.log('   - Push a tu repositorio');
console.log('   - Amplify detectará los cambios automáticamente\n');

console.log('2️⃣  OPCIÓN MANUAL:');
console.log('   - Ve a AWS Amplify Console');
console.log('   - Selecciona tu aplicación');
console.log('   - Ve a "Build settings"');
console.log('   - Haz clic en "Clear cache" o "Redeploy this version"\n');

console.log('3️⃣  COMANDOS GIT PARA FORZAR DEPLOY:');
console.log('   git add .');
console.log('   git commit -m "chore: clear amplify cache and optimize build"');
console.log('   git push origin main\n');

console.log('✨ OPTIMIZACIONES APLICADAS:');
console.log('✅ Cache headers configurados');
console.log('✅ Build ID único generado');
console.log('✅ Archivo _headers creado');
console.log('✅ Archivo _redirects configurado');
console.log('✅ amplify.yml optimizado');
console.log('✅ Scripts de limpieza agregados\n');

console.log('🔍 VERIFICAR DESPUÉS DEL DEPLOY:');
console.log('   - Abrir Developer Tools (F12)');
console.log('   - Ir a Network tab');
console.log('   - Hacer hard refresh (Ctrl+Shift+R)');
console.log('   - Verificar que los recursos se carguen correctamente\n');

console.log('🎉 Proceso completado. ¡El próximo deploy debería resolver los problemas de cache!'); 