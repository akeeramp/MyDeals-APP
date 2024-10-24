import '../../polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppDashboardModule } from './app.dashboard.module';
import { enableProdMode } from '@angular/core';
// Bootstrap using the UpgradeModule
enableProdMode();
platformBrowserDynamic().bootstrapModule(AppDashboardModule)