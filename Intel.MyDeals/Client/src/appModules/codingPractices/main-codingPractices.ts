import '../../polyfills';
import '../../load-libs';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppCodingPracticesModule } from './app.codingPractices.module';
// Bootstrap using the UpgradeModule
platformBrowserDynamic().bootstrapModule(AppCodingPracticesModule)