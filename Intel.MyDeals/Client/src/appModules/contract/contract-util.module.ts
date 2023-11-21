import { LoadingPanelComponent } from '../../app/core/loadingPanel/loadingPanel.component';
import { dealDetailsComponent } from '../../app/core/gridCell/dealDetail/dealDetail.component';
import { dealToolsComponent } from '../../app/core/gridCell/dealTools/dealTools.component';
import { MultiCheckFilterComponent } from "../../app/shared/kendo/multichecker.component";
import { CustomDateFilterComponent } from '../../app/shared/kendo/customDateFilter.component';
import { iconMctPctComponent } from '../../app/core/gridCell/iconMctPct/iconMctPct.component';
import { messageBoardModal } from '../../app/contract/contractManager/messageBoard/messageBoard.component';

import { notificationDockComponent } from '../../app/core/notification/notificationDock.component';
import { AdminBannerComponent } from '../../app/core/adminBanner/adminBanner.component';
import { GlobalSearchComponent } from '../../app/advanceSearch/globalSearch/globalSearch.component';
import { GlobalSearchResultsComponent } from '../../app/advanceSearch/globalSearchResults/globalSearchResults.component';
import { FooterComponent } from '../../app/shared/footer/footer.component';
import { dealPopupIconComponent } from '../../app/core/dealPopup/dealPopupIcon.component';
import {LoadingSpinnerComponent} from '../../app/shared/loadingSpinner/loadingSpinner.component';
import { dealPopupComponent } from '../../app/core/dealPopup/dealPopup.component';
import { dealPopupDockComponent } from '../../app/core/dealPopup/dealPopupDock.component';
import { globalRouteComponent } from "../../app/shared/globalroute/globalroute.component";
import { TrashcanComponent } from '../../app/core/trashcan/trashcan.component';
import { CustomDropDownFilterComponent } from '../../app/shared/kendo/customDropDownFilter.component';
import { floatingActioncomponent } from '../../app/core/floatingAction/floatingAction.component';
import { HeaderComponent } from '../../app/shared/header/header.component';
import { PingComponent } from '../../app/core/ping/ping.component';
import { fileAttachmentComponent } from '../../app/core/gridCell/fileAttachmentModal/fileAttachmentModal.component';
import { dealTimelineComponent } from '../../app/core/gridCell/dealTimelineModal/dealTimelineModal.component';
import { notificationsSettingsDialog } from '../../app/admin/notifications/admin.notificationsSettings.component';
import { notificationsModalDialog } from '../../app/admin/notifications/admin.notificationsModal.component'
import { LoaderComponent } from '../../app/shared/loader/loader.component';

export let ContractUtilComponents = [
    LoaderComponent,
    LoadingPanelComponent,
    dealDetailsComponent,
    dealToolsComponent,
    messageBoardModal,
    MultiCheckFilterComponent,
    CustomDateFilterComponent,
    iconMctPctComponent,
    notificationDockComponent,
    AdminBannerComponent,
    GlobalSearchComponent,
    GlobalSearchResultsComponent,
    FooterComponent,
    dealPopupIconComponent,
    LoadingSpinnerComponent,
    dealPopupComponent,
    dealPopupDockComponent,
    globalRouteComponent,
    TrashcanComponent,
    CustomDropDownFilterComponent,
    floatingActioncomponent,
    HeaderComponent,
    PingComponent,
    fileAttachmentComponent,
    dealTimelineComponent,
    notificationsSettingsDialog,
    notificationsModalDialog
]