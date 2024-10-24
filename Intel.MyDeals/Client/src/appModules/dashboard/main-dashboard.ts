import '../../polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppDashboardModule } from './app.dashboard.module';
// Bootstrap using the UpgradeModule
platformBrowserDynamic().bootstrapModule(AppDashboardModule)