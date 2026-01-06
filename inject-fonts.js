const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'dist', 'index.html');

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Inyectar links de fuentes de íconos desde CDN antes del </head>
  const fontLinks = `
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Ionicons&display=swap">
  <style>
    @font-face {
      font-family: 'Ionicons';
      src: url('https://cdnjs.cloudflare.com/ajax/libs/ionicons/2.0.1/fonts/ionicons.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
    @font-face {
      font-family: 'MaterialCommunityIcons';
      src: url('https://cdn.jsdelivr.net/npm/@mdi/font@latest/fonts/materialdesignicons-webfont.ttf') format('truetype');
      font-weight: normal;
      font-style: normal;
    }
  </style>
`;
  
  html = html.replace('</head>', `${fontLinks}</head>`);
  
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('✅ Fuentes de íconos inyectadas en dist/index.html');
} else {
  console.error('❌ No se encontró dist/index.html');
}
