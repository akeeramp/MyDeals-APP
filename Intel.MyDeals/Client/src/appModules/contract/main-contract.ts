import '../../polyfills';
import '../../load-libs';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppContractModule } from './app.contract.module';
// Bootstrap using the UpgradeModule
platformBrowserDynamic().bootstrapModule(AppContractModule)