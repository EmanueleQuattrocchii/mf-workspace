import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/components/app/app.component';
import { initFederation } from '@angular-architects/native-federation';
 
async function main() {
  try {
    await initFederation('federation.manifest.json');
    await bootstrapApplication(AppComponent, appConfig);
  } catch (err) {
    console.error(err);
  }
}
 
main();
 