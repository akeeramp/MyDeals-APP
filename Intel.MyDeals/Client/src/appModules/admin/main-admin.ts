import '../../polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppAdminModule } from './app.admin.module';
// Bootstrap using the UpgradeModule
platformBrowserDynamic().bootstrapModule(AppAdminModule)