import '../../polyfills';
import '../../load-libs';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppSDMModule } from './app.sdm.module';
// Bootstrap using the UpgradeModule
platformBrowserDynamic().bootstrapModule(AppSDMModule)