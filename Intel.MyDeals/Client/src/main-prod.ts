import './polyfills.ts';
import './load-libs';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { enableProdMode } from '@angular/core';

enableProdMode();
// Bootstrap using the UpgradeModule
platformBrowserDynamic().bootstrapModule(AppModule)