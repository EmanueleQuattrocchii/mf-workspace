const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({

  name: 'shell', // Nome del progetto
  exposes: {
    // './MfeService': './projects/shell/src/app/services/mfe.service.ts',
  },
 
  shared: ['@angular/core', '@angular/common', '@angular/router', '@angular/forms'],
 
  filename: 'remoteEntry.js',
  port: 4200,

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0
  
});
