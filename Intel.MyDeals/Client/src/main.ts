import './polyfills';
import './load-libs';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';


// Bootstrap using the UpgradeModule
platformBrowserDynamic().bootstrapModule(AppModule)