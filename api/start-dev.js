#!/usr/bin/env node

// Load environment variables from multiple files
require('dotenv').config({ path: '.env.local' });
require('dotenv').config({ path: '.env' });

// Debug: Check if environment variables are loaded
console.log('Environment check:');
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'Set' : 'Not set');
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'Set' : 'Not set');

// Start the server with tsx
const { spawn } = require('child_process');
const server = spawn('tsx', ['api/server.ts'], {
  stdio: 'inherit',
  env: { ...process.env }
});

server.on('close', (code) => {
  console.log(`Server process exited with code ${code}`);
  process.exit(code);
});