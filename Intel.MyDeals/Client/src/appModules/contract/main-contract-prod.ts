import '../../polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppContractModule } from './app.contract.module';
import { enableProdMode } from '@angular/core';
// Bootstrap using the UpgradeModule
enableProdMode();
platformBrowserDynamic().bootstrapModule(AppContractModule)