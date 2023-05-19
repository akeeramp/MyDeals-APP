import { LoadingPanelComponent } from '../../app/core/loadingPanel/loadingpanel.component';
import { gridStatusBoardComponent } from '../../app/core/gridStatusBoard/gridStatusBoard.component';
import { contractStatusBoardComponent } from '../../app/core/gridStatusBoard/contractStatusBoard.component';
import { dealDetailsComponent } from '../../app/core/gridCell/dealDetail/dealDetail.component';
import { dealToolsComponent } from '../../app/core/gridCell/dealTools/dealTools.component';
import { LoaderComponent } from '../../app/shared/loader/loader.component';
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
import { dealPopupComponent } from '../../app/core/dealPopup/dealPopup.component';
import { dealPopupDockComponent } from '../../app/core/dealPopup/dealPopupDock.component';
import { HeaderComponent } from '../../app/shared/header/header.component';
import { PingComponent } from '../../app/core/ping/ping.component';
import { TenderFolioComponent } from '../../app/contract/tenderFolio/tenderFolio.component';
import { LoadingSpinnerComponent } from '../../app/shared/loadingSpinner/loadingspinner.component';

export let DashboardUtilComponents = [ 
    LoadingPanelComponent,
    gridStatusBoardComponent,
    contractStatusBoardComponent,
    dealDetailsComponent,
    dealToolsComponent,
    messageBoardModal,
    LoaderComponent,
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
    TenderFolioComponent,
    LoadingSpinnerComponent
]