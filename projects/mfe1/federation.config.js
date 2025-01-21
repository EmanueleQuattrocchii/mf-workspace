const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({

  name: 'mfe1',
 
  remotes: {
    shell: 'shell@http://localhost:4200/remoteEntry.js', // Riferimento alla Shell Application
  },
 
  shared: ['@angular/core', '@angular/common', '@angular/router', '@angular/forms'],

  output: {
    publicPath: 'auto' 
  }

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0
  
});
