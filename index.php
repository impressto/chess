<?php
// Read version from package.json for cache busting
$packageJson = json_decode(file_get_contents(__DIR__ . '/package.json'), true);
$version = $packageJson['version'] ?? '1.0.0';

// Set the base URL for the chess subdirectory
$baseUrl = 'https://impressto.ca/chess';
?>
<!DOCTYPE html>
<html lang="es">
  <head>
    <meta charset="UTF-8" />
    <base href="<?php echo $baseUrl; ?>/" />
    
    <!-- PWA Mobile Optimization -->
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, minimal-ui, viewport-fit=cover" />
    <meta name="theme-color" content="#ddcaa9" />
    <meta name="description" content="Juego de ajedrez clásico con IA!" />
    <meta name="keywords" content="ajedrez, chess, games, react, pwa" />
    
    <!-- PWA Manifest -->
    <link rel="manifest" href="<?php echo $baseUrl; ?>/dist/manifest.json" />
    <link rel="icon" href="<?php echo $baseUrl; ?>/dist/assets/black-king.png" />
    
    <!-- Apple Mobile Web App -->
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="apple-mobile-web-app-title" content="Chess" />
    <link rel="apple-touch-icon" href="<?php echo $baseUrl; ?>/dist/assets/black-king.png" />
    
    <title>Chess Game</title>
    <link rel="stylesheet" crossorigin href="<?php echo $baseUrl; ?>/dist/assets/index.css?v=<?php echo $version; ?>">
    
    <style>
        /* Prevent scrolling on mobile */
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            overflow-x: hidden;
        }
        
        #root {
            width: 100%;
            min-height: 100vh;
        }
        
        /* Mobile optimization */
        @media screen and (max-width: 768px) {
            html {
                height: 100vh;
                height: -webkit-fill-available;
            }
            body {
                min-height: 100vh;
                min-height: -webkit-fill-available;
            }
        }
    </style>
  </head>
  <body>
    <noscript>You need to enable JavaScript to run this app.</noscript>
    <div id="root"></div>
    
    <script type="module" crossorigin src="<?php echo $baseUrl; ?>/dist/assets/index.js?v=<?php echo $version; ?>"></script>
    <link rel="modulepreload" crossorigin href="<?php echo $baseUrl; ?>/dist/assets/vendor.js?v=<?php echo $version; ?>">
    
    <!-- Service Worker Registration -->
    <script>
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('<?php echo $baseUrl; ?>/dist/service-worker.js')
                    .then(registration => {
                        console.log('✅ Service Worker registered:', registration.scope);
                    })
                    .catch(error => {
                        console.log('❌ Service Worker registration failed:', error);
                    });
            });
        }
    </script>
  </body>
</html>
