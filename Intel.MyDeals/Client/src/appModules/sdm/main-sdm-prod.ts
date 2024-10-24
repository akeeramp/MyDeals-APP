import '../../polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppSDMModule } from './app.sdm.module';
import { enableProdMode } from '@angular/core';
// Bootstrap using the UpgradeModule
enableProdMode();
platformBrowserDynamic().bootstrapModule(AppSDMModule)