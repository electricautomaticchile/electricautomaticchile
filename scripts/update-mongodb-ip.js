#!/usr/bin/env node

const https = require('https');
const { exec } = require('child_process');

// Configuración de MongoDB Atlas API
const MONGODB_API_PUBLIC_KEY = process.env.MONGODB_API_PUBLIC_KEY;
const MONGODB_API_PRIVATE_KEY = process.env.MONGODB_API_PRIVATE_KEY;
const MONGODB_PROJECT_ID = process.env.MONGODB_PROJECT_ID;

// Verifica que las variables de entorno necesarias estén definidas
if (!MONGODB_API_PUBLIC_KEY || !MONGODB_API_PRIVATE_KEY || !MONGODB_PROJECT_ID) {
  console.error('Error: Se requieren las variables de entorno MONGODB_API_PUBLIC_KEY, MONGODB_API_PRIVATE_KEY y MONGODB_PROJECT_ID');
  process.exit(1);
}

// Función para obtener la IP pública actual
function getPublicIP() {
  return new Promise((resolve, reject) => {
    exec('curl -s http://checkip.amazonaws.com', (error, stdout, stderr) => {
      if (error) {
        reject(`Error al obtener IP: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Error al obtener IP: ${stderr}`);
        return;
      }
      resolve(stdout.trim());
    });
  });
}

// Función para añadir la IP a MongoDB Atlas
function addIPToMongoDBAtlas(ip) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      ipAddress: ip,
      comment: 'AWS Amplify Build IP (temporal)',
      deleteAfterDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // Se eliminará después de 24 horas
    });

    const options = {
      hostname: 'cloud.mongodb.com',
      port: 443,
      path: `/api/atlas/v1.0/groups/${MONGODB_PROJECT_ID}/accessList`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        'Authorization': `Basic ${Buffer.from(`${MONGODB_API_PUBLIC_KEY}:${MONGODB_API_PRIVATE_KEY}`).toString('base64')}`
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      
      res.on('data', (chunk) => {
        responseBody += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(responseBody);
        } else {
          reject(`Error en la respuesta de MongoDB Atlas: ${res.statusCode} - ${responseBody}`);
        }
      });
    });

    req.on('error', (error) => {
      reject(`Error al llamar a la API de MongoDB Atlas: ${error.message}`);
    });

    req.write(data);
    req.end();
  });
}

// Ejecución principal
async function main() {
  try {
    console.log('Obteniendo IP pública...');
    const publicIP = await getPublicIP();
    console.log(`IP pública detectada: ${publicIP}`);
    
    console.log('Añadiendo IP a MongoDB Atlas...');
    await addIPToMongoDBAtlas(publicIP);
    console.log('IP añadida correctamente a MongoDB Atlas');
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
}

main(); 