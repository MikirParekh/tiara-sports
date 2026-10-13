// Simple test to check if Node.js is working on SmarterASP.NET
const http = require('http');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(`
    <!DOCTYPE html>
    <html>
    <head><title>Node.js Test - Tiara Sports</title></head>
    <body style="font-family: Arial; padding: 40px; background: #dc2626; color: white;">
      <h1>✅ Node.js is WORKING!</h1>
      <p><strong>Port:</strong> ${port}</p>
      <p><strong>Node Version:</strong> ${process.version}</p>
      <p><strong>Platform:</strong> ${process.platform}</p>
      <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'production'}</p>
      <p><strong>Current Time:</strong> ${new Date().toLocaleString()}</p>
      <hr>
      <p>If you see this, your Node.js backend is running correctly on SmarterASP.NET!</p>
    </body>
    </html>
  `);
});

server.listen(port, () => {
  console.log(`Test server running on port ${port}`);
});
