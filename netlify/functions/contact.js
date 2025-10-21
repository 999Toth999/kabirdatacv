const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
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
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save message' })
    };
  }
};