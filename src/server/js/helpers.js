import axios from 'axios';
import { config } from './config.js';
import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

const ENCRYPTION_KEY = Buffer.from('vjqwifx/a9Iy157KiCJotJ11GDKErgJVo0xaA2/uXnk=', 'base64');
const IV_LENGTH = 16; 
const DefaultExpirationTime = 15 * 60 * 1000; // minutos + segundos + milisegundos 

// Cache
const cache = {};
export function getCached(key) { 
  return cache[key]; 
}
export function setCached(key, value) {
  cache[key] = { timestamp: Date.now(), data: value };
}
export function clearCache() {
  for (const key in cache) {
    delete cache[key];
  }
}
export function isValidCached(key, ttlMs = DefaultExpirationTime) {
  if (!cache[key]) return false;
  return (Date.now() - cache[key].timestamp) < ttlMs;
}

// Función para realizar una solicitud con caché en el cliente
let dataUpdates = [];
let countUpdates = 0;
const getUpdates = async (token) => {
  const response = await axios.post(`${config.api_url}/site/latest-updates`, { token });
  if (response.data.result) {
    dataUpdates = response.data.updates;
  }
  countUpdates++;
  return true;
};
export async function requestWithCache(url, cacheKey, token, data_post = {}, expirationTime = DefaultExpirationTime) {
  const wordsProcess = {
    menu: ['menu'],
    network: ['network'],
    categories: ['categories', 'products'],
    colors: ['colors', 'products'],
    featured: ['featured'],
    site: ['site'],
  };
  const lastUpdateKey = `data_update_${cacheKey}`;
  let updateCache = false;
  let keyProcess = false;
  const origin = url.replace(`${config.site_url}/`, '');
  const today = new Date();

  // Detectar proceso
  for (const [key, process] of Object.entries(wordsProcess)) {
    if (origin.includes(key)) {
      keyProcess = key;
      break;
    }
  }

  // Verificar si necesita actualizar por actualizaciones recientes
  if (keyProcess) {
    const matchedKeys = wordsProcess[keyProcess];

    if (countUpdates === 0 && dataUpdates.length === 0) {
      await getUpdates(token);
    }

    const lastUpdate = getCached(lastUpdateKey)?.timestamp;
    const lastUpdateMinutes = lastUpdate ? Math.floor((today - new Date(lastUpdate)) / (1000 * 60)) : null;

    for (const update of dataUpdates) {
      for (const key of matchedKeys) {
        if (update.slug_process.includes(key)) {
          if (lastUpdateMinutes !== null && update.minutes_passed < lastUpdateMinutes && lastUpdateMinutes > 0) {
            updateCache = true;
            break;
          }
        }
      }
    }
  }

  // Validar si hay cache valida
  if (!updateCache && isValidCached(cacheKey, expirationTime)) {
    return getCached(cacheKey).data;
  }

  // Si no hay cache valida, hacer la solicitud
  const postData = { token, ...data_post };
  const response = await axios.post(url, postData, { withCredentials: false });
  const responseData = response.data;

  // Guardar en cache
  setCached(cacheKey, responseData);
  setCached(lastUpdateKey, { timestamp: new Date().toISOString() });
  return responseData;
}
export function detectDevice(request) {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader.match(/screen_width=(\d+)/);
  const width = match ? parseInt(match[1], 10) : 0;

  const ua = request.headers.get("user-agent") || "";
  const isMobileUA = /Mobi|Android/i.test(ua);
  const isTabletUA = /Tablet|iPad/i.test(ua);
  const isDesktopUA = !isMobileUA && !isTabletUA;

  const isSmall = width
    ? width < 992
    : isMobileUA || isTabletUA;

  return {
    width,
    isSmall,
    source: width ? 'cookie' : 'user-agent',
    device: width ? width < 992 ? 'small' : 'large' : isMobileUA ? 'mobile' : isTabletUA ? 'tablet' : 'desktop'
  };
}
export async function verifyCaptcha(token) {
  const secret = config.captcha_secret;
  const res = await fetch("https://www.google.com/recaptcha/api/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `secret=${secret}&response=${token}`,
  });
  return await res.json();
}
export function customEncrypt(text) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'binary');
  encrypted += cipher.final('binary');
  const encryptedBuffer = Buffer.concat([iv, Buffer.from(encrypted, 'binary')]);
  const base64 = encryptedBuffer.toString('base64');
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
export function customDecrypt(value) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/');
  const encryptedBuffer = Buffer.from(base64, 'base64');
  const iv = encryptedBuffer.slice(0, IV_LENGTH);
  const encryptedText = encryptedBuffer.slice(IV_LENGTH);
  const decipher = crypto.createDecipheriv('aes-256-cbc', ENCRYPTION_KEY, iv);
  let decrypted = decipher.update(encryptedText, 'binary', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
export function formatNumber(value,current="es-MX") {
  const number = parseFloat(value);
  return new Intl.NumberFormat(current, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
}
export async function publicIP() {
  try {
    const ipRes = await axios.get('https://api.ipify.org/?format=json');
    console.log('IP pública:', ipRes.data.ip);
  } catch (err) {
    console.warn('No se pudo obtener la IP pública:', err.message);
  }
}

export async function getImage(url) {
  const awsDomains = ['cloudfront.net'];
  if (url.startsWith('//')) url = 'https:' + url;
  if (!url.startsWith('http')) url = 'https://' + url;

  const isAws = awsDomains.some(domain => url.includes(domain));
  if (!isAws) return url;
  
  try {
    const response = await axios.get(url, { responseType: 'arraybuffer', headers: { 'User-Agent': 'Mozilla/5.0', 'Accept': 'image/*,*/*', }, });

    if (response.status === 200) {
      let mime = response.headers['content-type'];
      if (!mime) {
        const ext = path.extname(url).toLowerCase().replace('.', '');
        mime = `image/${ext || 'jpeg'}`;
      }

      const base64 = Buffer.from(response.data).toString('base64');
      return `data:${mime};base64,${base64}`;
    }
  } catch (error) {
    if (error.response?.status === 403) {
      console.warn('Imagen denegada (403):', error.message);
      publicIP();
    } else {
      console.warn('Error al convertir imagen:', error.message);
    }
    return 'https://mycavi.com/public/no-disponible.jpg';
  }

  return url;
}
export async function imageToBase64(source) {
  if (source.startsWith('//')) { source = 'https:' + url; }
  if (!source.startsWith('http')) { source = 'https://' + url; }

  try {
    const response = await axios.get(source, { responseType: 'arraybuffer' });
    const contentType = response.headers['content-type'];
    const base64 = Buffer.from(response.data).toString('base64');
    return `data:${contentType};base64,${base64}`;
  } catch (error) {
    if(error.response.status === 403){
      console.warn('Imagen denegada:', error.message);
      publicIP();
    }else{
      console.error('Error al convertir imagen a Base64:', error.message);
    }
    return 'https://mycavi.com/public/no-disponible.jpg';
  }
}

export function getDecryptedViews(cookieValue) {
  try {
    if (!cookieValue) return [];
    const parsed = JSON.parse(cookieValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn('Error al parsear vistas en cookie:', error.message);
    return [];
  }
}
export async function setViewedProduct(code_product, token) {
  try {
    const response = await axios.post(`${config.api_url}/product/view-set`, {
      token,
      code_product,
    });
    return response.data?.status === true;
  } catch (error) {
    console.error('Error al registrar producto visto:', error.message);
    return false;
  }
}