import '../../polyfills';
import '../../load-libs';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppAdminModule } from './app.admin.module';
import { enableProdMode } from '@angular/core';
// Bootstrap using the UpgradeModule
enableProdMode();
platformBrowserDynamic().bootstrapModule(AppAdminModule)