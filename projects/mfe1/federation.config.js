const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({

  name: 'mfe1',
  
  exposes: {
    './Sub': './projects/mfe1/src/app/components/app/app.component.ts'
    // './RegisterForm': './projects/registration/src/app/components/register-form/register-form.component.ts',
  },
 
  // remotes: {
  //   shell: 'shell@http://localhost:4200/remoteEntry.js', // Riferimento alla Shell Application
  // },
 
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
 
  skip: [
    'rxjs/ajax',
    'rxjs/fetch',
    'rxjs/testing',
    'rxjs/webSocket',
  ]

  // Please read our FAQ about sharing libs:
  // https://shorturl.at/jmzH0
  
});
