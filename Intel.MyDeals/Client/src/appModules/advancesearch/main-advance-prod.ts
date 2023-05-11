import '../../polyfills';
import '../../load-libs';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppAdvanceModule } from './app.advance.module';
import { enableProdMode } from '@angular/core';
// Bootstrap using the UpgradeModule
enableProdMode();
platformBrowserDynamic().bootstrapModule(AppAdvanceModule)