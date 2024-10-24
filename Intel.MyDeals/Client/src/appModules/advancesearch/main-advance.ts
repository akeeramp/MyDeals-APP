import '../../polyfills';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppAdvanceModule } from './app.advance.module';
// Bootstrap using the UpgradeModule
platformBrowserDynamic().bootstrapModule(AppAdvanceModule)