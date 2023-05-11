import '../../polyfills';
import '../../load-libs';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppReportModule } from './app.report.module';
// Bootstrap using the UpgradeModule
platformBrowserDynamic().bootstrapModule(AppReportModule)