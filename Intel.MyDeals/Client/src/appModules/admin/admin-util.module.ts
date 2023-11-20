import { LoadingPanelComponent } from '../../app/core/loadingPanel/loadingPanel.component';
import { MultiCheckFilterComponent } from "../../app/shared/kendo/multichecker.component";
import { CustomDateFilterComponent } from '../../app/shared/kendo/customDateFilter.component';
import { iconMctPctComponent } from '../../app/core/gridCell/iconMctPct/iconMctPct.component';

import { notificationDockComponent } from '../../app/core/notification/notificationDock.component';
import { AdminBannerComponent } from '../../app/core/adminBanner/adminBanner.component';
import { GlobalSearchComponent } from '../../app/advanceSearch/globalSearch/globalSearch.component';
import { GlobalSearchResultsComponent } from '../../app/advanceSearch/globalSearchResults/globalSearchResults.component';
import { FooterComponent } from '../../app/shared/footer/footer.component';
import { dealPopupIconComponent } from '../../app/core/dealPopup/dealPopupIcon.component';
import { dealPopupComponent } from '../../app/core/dealPopup/dealPopup.component';
import { dealPopupDockComponent } from '../../app/core/dealPopup/dealPopupDock.component';
import { HeaderComponent } from '../../app/shared/header/header.component';
import { PingComponent } from '../../app/core/ping/ping.component';
import { LoadingSpinnerComponent } from '../../app/shared/loadingSpinner/loadingSpinner.component';
import { endCustomerRetailModalComponent } from '../../app/contract/ptModals/dealEditorModals/endCustomerRetailModal.component'
import { notificationsSettingsDialog } from '../../app/admin/notifications/admin.notificationsSettings.component';
import { notificationsModalDialog } from '../../app/admin/notifications/admin.notificationsModal.component'

export let AdminUtilComponents = [ 
    LoadingPanelComponent,
    MultiCheckFilterComponent,
    CustomDateFilterComponent,
    iconMctPctComponent,
    notificationDockComponent,
    AdminBannerComponent,
    GlobalSearchComponent,
    GlobalSearchResultsComponent,
    FooterComponent,
    dealPopupIconComponent,
    dealPopupComponent,
    dealPopupDockComponent,
    HeaderComponent,
    PingComponent,
    LoadingSpinnerComponent,
    endCustomerRetailModalComponent,
    notificationsSettingsDialog,
    notificationsModalDialog
]