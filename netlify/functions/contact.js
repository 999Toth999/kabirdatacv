const fs = require('fs');
const path = require('path');

const MAX_NAME_LENGTH = 200;
const MAX_EMAIL_LENGTH = 254;
const MAX_MESSAGE_LENGTH = 5000;
const MAX_BODY_SIZE = 10000;

const ALLOWED_ORIGINS = [
  'https://kabirdatacv.netlify.app',
  'http://localhost:3000',
];

function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    .trim();
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function getCorsHeaders(origin) {
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

exports.handler = async (event) => {
  const origin = event.headers.origin || event.headers.Origin || '';
  const corsHeaders = getCorsHeaders(origin);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  try {
    if (!event.body || event.body.length > MAX_BODY_SIZE) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Request body is missing or too large' }),
      };
    }

    let data;
    try {
      data = JSON.parse(event.body);
    } catch {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Invalid JSON' }),
      };
    }

    const name = sanitize(data.name);
    const email = sanitize(data.email);
    const messageText = sanitize(data.message);

    const errors = [];
    if (!name || name.length > MAX_NAME_LENGTH) {
      errors.push(`Name is required and must be under ${MAX_NAME_LENGTH} characters`);
    }
    if (!email || !isValidEmail(email) || email.length > MAX_EMAIL_LENGTH) {
      errors.push('A valid email address is required');
    }
    if (!messageText || messageText.length > MAX_MESSAGE_LENGTH) {
      errors.push(`Message is required and must be under ${MAX_MESSAGE_LENGTH} characters`);
    }

    if (errors.length > 0) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({ error: 'Validation failed', details: errors }),
      };
    }

    const timestamp = new Date().toISOString();
    const message = [
      `Date: ${timestamp}`,
      `Name: ${name}`,
      `Email: ${email}`,
      `Message: ${messageText}`,
      '-------------------',
      '',
    ].join('\n');

    const filePath = path.join('/tmp', 'contact-messages.txt');
    fs.appendFileSync(filePath, message);

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Internal server error' }),
    };
  }
};
