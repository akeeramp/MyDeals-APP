import { PingComponent } from '../core/ping/ping.component';
import { TrashcanComponent } from '../core/trashcan/trashcan.component';
import { LoadingPanelComponent } from '../core/loadingPanel/loadingpanel.component';
import { notificationDockComponent } from '../core/notification/notificationDock.component';
import { iconMctPctComponent } from '../../app/core/gridCell/iconMctPct/iconMctPct.component';
import { gridStatusBoardComponent } from '../core/gridStatusBoard/gridStatusBoard.component';
import { contractStatusBoardComponent } from '../core/gridStatusBoard/contractStatusBoard.component';
import { AdminBannerComponent } from '../core/adminBanner/adminBanner.component';
import { dealDetailsComponent } from '../core/gridCell/dealDetail/dealDetail.component';
import { dealToolsComponent } from '../core/gridCell/dealTools/dealTools.component';
import { dealTimelineComponent } from '../core/gridCell/dealTimelineModal/dealTimelineModal.component';

export let coreComponents = [
    PingComponent,
    TrashcanComponent,
    LoadingPanelComponent,
    notificationDockComponent,
    iconMctPctComponent,
    gridStatusBoardComponent,
    contractStatusBoardComponent,
    AdminBannerComponent,
    dealDetailsComponent,
    dealToolsComponent,
    dealTimelineComponent
]