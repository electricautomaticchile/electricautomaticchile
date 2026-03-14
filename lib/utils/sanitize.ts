const DANGEROUS_PATTERNS = [
  /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
  /javascript:/gi,
  /on\w+\s*=/gi,
  /<iframe/gi,
  /<object/gi,
  /<embed/gi,
  /eval\(/gi,
  /expression\(/gi,
];

// MED-04: Sanitización idempotente — escapar primero, luego limpiar patrones
export function sanitizeHTML(input: string): string {
  if (!input) return '';
  
  // Escapar HTML entities primero
  let sanitized = input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
  
  // Luego remover patrones peligrosos sobre el texto ya escapado
  DANGEROUS_PATTERNS.forEach(pattern => {
    sanitized = sanitized.replace(pattern, '');
  });
  
  return sanitized;
}

export function sanitizeInput(input: string): string {
  if (!input) return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '')
    .slice(0, 1000);
}

export function sanitizeEmail(email: string): string {
  if (!email) return '';
  
  return email
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9@._+-]/g, '')
    .slice(0, 255);
}

export function sanitizeNumeric(input: string): string {
  if (!input) return '';
  
  return input.replace(/[^0-9]/g, '');
}

export function sanitizeAlphanumeric(input: string): string {
  if (!input) return '';
  
  return input.replace(/[^a-zA-Z0-9\s-_]/g, '');
}

export function sanitizeRUT(rut: string): string {
  if (!rut) return '';
  
  return rut
    .replace(/[^0-9kK-]/g, '')
    .toUpperCase();
}

export function sanitizeTelefono(telefono: string): string {
  if (!telefono) return '';
  
  return telefono.replace(/[^0-9+\s()-]/g, '');
}

export function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export function sanitizeURL(url: string): string {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    return parsed.toString();
  } catch {
    return '';
  }
}

export function sanitizeFilename(filename: string): string {
  if (!filename) return '';
  
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .slice(0, 255);
}

export function preventXSS(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeHTML(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => preventXSS(item));
  }
  
  if (obj && typeof obj === 'object') {
    const sanitized: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sanitized[key] = preventXSS(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
}
