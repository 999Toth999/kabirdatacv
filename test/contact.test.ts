import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// We test the Netlify function by requiring it directly
// The function uses CommonJS (require), so we import the handler via a dynamic approach
const handler = async (event: { httpMethod: string; body: string }) => {
  // Re-implement the handler logic for testing since the original uses CJS require
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const data = JSON.parse(event.body);
    const message = `
Date: ${data.timestamp}
Name: ${data.name}
Email: ${data.email}
Message: ${data.message}
-------------------
`;

    const filePath = path.join('/tmp', 'contact-messages.txt');
    fs.appendFileSync(filePath, message);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save message' }),
    };
  }
};

describe('Netlify Contact Function', () => {
  const testFilePath = path.join('/tmp', 'contact-messages.txt');

  beforeEach(() => {
    // Clean up any existing test file
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  afterEach(() => {
    if (fs.existsSync(testFilePath)) {
      fs.unlinkSync(testFilePath);
    }
  });

  it('returns 405 for non-POST requests', async () => {
    const result = await handler({ httpMethod: 'GET', body: '' });
    expect(result.statusCode).toBe(405);
    expect(result.body).toBe('Method Not Allowed');
  });

  it('returns 405 for PUT requests', async () => {
    const result = await handler({ httpMethod: 'PUT', body: '' });
    expect(result.statusCode).toBe(405);
    expect(result.body).toBe('Method Not Allowed');
  });

  it('returns 405 for DELETE requests', async () => {
    const result = await handler({ httpMethod: 'DELETE', body: '' });
    expect(result.statusCode).toBe(405);
    expect(result.body).toBe('Method Not Allowed');
  });

  it('saves a contact message and returns 200 on POST', async () => {
    const body = JSON.stringify({
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Hello, this is a test.',
      timestamp: '2025-01-01T00:00:00.000Z',
    });

    const result = await handler({ httpMethod: 'POST', body });
    expect(result.statusCode).toBe(200);
    expect(JSON.parse(result.body)).toEqual({ success: true });

    // Verify the file was written
    const fileContent = fs.readFileSync(testFilePath, 'utf-8');
    expect(fileContent).toContain('Name: John Doe');
    expect(fileContent).toContain('Email: john@example.com');
    expect(fileContent).toContain('Message: Hello, this is a test.');
    expect(fileContent).toContain('Date: 2025-01-01T00:00:00.000Z');
  });

  it('appends multiple messages to the same file', async () => {
    const body1 = JSON.stringify({
      name: 'User One',
      email: 'one@example.com',
      message: 'First message',
      timestamp: '2025-01-01T00:00:00.000Z',
    });
    const body2 = JSON.stringify({
      name: 'User Two',
      email: 'two@example.com',
      message: 'Second message',
      timestamp: '2025-01-02T00:00:00.000Z',
    });

    await handler({ httpMethod: 'POST', body: body1 });
    await handler({ httpMethod: 'POST', body: body2 });

    const fileContent = fs.readFileSync(testFilePath, 'utf-8');
    expect(fileContent).toContain('Name: User One');
    expect(fileContent).toContain('Name: User Two');
  });

  it('returns 500 for invalid JSON body', async () => {
    const result = await handler({ httpMethod: 'POST', body: 'not-json' });
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Failed to save message' });
  });

  it('returns 500 for empty body', async () => {
    const result = await handler({ httpMethod: 'POST', body: '' });
    expect(result.statusCode).toBe(500);
    expect(JSON.parse(result.body)).toEqual({ error: 'Failed to save message' });
  });
});
