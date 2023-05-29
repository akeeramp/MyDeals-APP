import { LoadingPanelComponent } from '../../app/core/loadingPanel/loadingpanel.component';
import { MultiCheckFilterComponent } from "../../app/shared/kendo/multichecker.component";
import { CustomDateFilterComponent } from '../../app/shared/kendo/customDateFilter.component';

import { notificationDockComponent } from '../../app/core/notification/notificationDock.component';
import { AdminBannerComponent } from '../../app/core/adminBanner/adminBanner.component';
import { GlobalSearchComponent } from '../../app/advanceSearch/globalSearch/globalSearch.component';
import { GlobalSearchResultsComponent } from '../../app/advanceSearch/globalSearchResults/globalSearchResults.component';
import { FooterComponent } from '../../app/shared/footer/footer.component';
import { dealPopupIconComponent } from '../../app/core/dealPopup/dealPopupIcon.component';
import {LoadingSpinnerComponent} from '../../app/shared/loadingSpinner/loadingspinner.component';
import { dealPopupComponent } from '../../app/core/dealPopup/dealPopup.component';
import { dealPopupDockComponent } from '../../app/core/dealPopup/dealPopupDock.component';
import { HeaderComponent } from '../../app/shared/header/header.component';

import { AttributeBuilder } from '../../app/core/attributeBuilder/attributeBuilder.component';
import {SearchComponent} from '../../app/shared/search/search.component';
import { dealEditorComponent } from '../../app/contract/dealEditor/dealEditor.component';
import { CustomDropDownFilterComponent } from '../../app/shared/kendo/customDropDownFilter.component';
import { dealEditorHeaderTemplateComponent } from '../../app/contract/dealEditor/dealEditorHeaderTemplate.component';
import { dealEditorCellTemplateComponent } from '../../app/contract/dealEditor/dealEditorCellTemplate.component';
import { dealEditorEditTemplateComponent } from '../../app/contract/dealEditor/dealEditorEditTemplate.component';
import { floatingActioncomponent } from '../../app/core/floatingAction/floatingAction.component';
import { dealToolsComponent } from '../../app/core/gridCell/dealTools/dealTools.component';
import { GridPopoverComponent } from '../../app/contract/ptModals/productSelector/gridPopover/gridPopover.component';
import { dealDetailsComponent } from '../../app/core/gridCell/dealDetail/dealDetail.component';
import { messageBoardModal } from '../../app/contract/contractManager/messageBoard/messageBoard.component';
import { PingComponent } from '../../app/core/ping/ping.component';

import { multiSelectModalComponent } from '../../app/contract/ptModals/multiSelectModal/multiSelectModal.component';
import { tenderMCTPCTModalComponent } from '../../app/contract/ptModals/tenderDashboardModals/tenderMCTPCTModal.component';
import { excludeDealGroupModalDialog } from '../../app/contract/managerExcludeGroups/excludeDealGroupModal.component';
import { managerExcludeGroupsComponent } from '../../app/contract/managerExcludeGroups/managerExcludeGroups.component';
import { pctGroupModal } from '../../app/contract/managerPct/pctGroupModal/pctGroupModal.component';
import { meetCompDealDetailModalComponent } from '../../app/contract/meetComp/meetCompDealDetailModal.component';
import { pctOverrideReasonModal } from '../../app/contract/managerPct/pctOverrideReasonModal/pctOverrideReasonModal.component';
import { meetCompContractComponent } from '../../app/contract/meetComp/meetComp.component';
import { managerPctComponent } from '../../app/contract/managerPct/managerPct.component';
import { iconMctPctComponent } from '../../app/core/gridCell/iconMctPct/iconMctPct.component';
import { pctChildGridComponent } from '../../app/contract/managerPct/pctChildGrid.component';
import { missingCapCostInfoModalComponent } from '../../app/contract/ptModals/dealEditorModals/missingCapCostInfoModal.component';
import { tenderGroupExclusionModalComponent } from '../../app/contract/ptModals/tenderDashboardModals/tenderGroupExclusionModal.component';
import { endCustomerRetailModalComponent } from '../../app/contract/ptModals/dealEditorModals/endCustomerRetailModal.component';
import { emailModal } from '../../app/contract/contractManager/emailModal/emailModal.component';
import { systemPricePointModalComponent } from '../../app/contract/ptModals/dealEditorModals/systemPricePointModal.component';
import { TenderFolioComponent } from '../../app/contract/tenderFolio/tenderFolio.component';
import { dealProductsModalComponent } from '../../app/contract/ptModals/dealProductsModal/dealProductsModal.component';
import { ProductBreakoutComponent } from '../../app/contract/ptModals/productSelector/productBreakout/productBreakout.component';
import { fileAttachmentComponent } from '../../app/core/gridCell/fileAttachmentModal/fileAttachmentModal.component';
import { dealTimelineComponent } from '../../app/core/gridCell/dealTimelineModal/dealTimelineModal.component';
import { OverlappingCheckComponent } from '../../app/contract/ptModals/overlappingCheckDeals/overlappingCheckDeals.component';
import { notificationsSettingsDialog } from '../../app/admin/notifications/admin.notificationsSettings.component';
import { notificationsModalDialog } from '../../app/admin/notifications/admin.notificationsModal.component'

export let AdvanceUtilComponents = [ 
    LoadingPanelComponent,
    MultiCheckFilterComponent,
    CustomDateFilterComponent,
    notificationDockComponent,
    AdminBannerComponent,
    GlobalSearchComponent,
    GlobalSearchResultsComponent,
    FooterComponent,
    dealPopupIconComponent,
    LoadingSpinnerComponent,
    dealPopupComponent,
    dealPopupDockComponent,
    HeaderComponent,
    AttributeBuilder,
    SearchComponent,
    dealEditorComponent,
    CustomDropDownFilterComponent,
    dealEditorHeaderTemplateComponent,
    dealEditorCellTemplateComponent,
    dealEditorEditTemplateComponent,
    floatingActioncomponent,
    dealToolsComponent,
    messageBoardModal,
    GridPopoverComponent,
    dealDetailsComponent,
    PingComponent,
    multiSelectModalComponent,
    tenderMCTPCTModalComponent,
    excludeDealGroupModalDialog,
    managerExcludeGroupsComponent,
    pctGroupModal,
    meetCompDealDetailModalComponent,
    pctOverrideReasonModal,
    meetCompContractComponent,
    managerPctComponent,
    iconMctPctComponent,
    pctChildGridComponent,
    missingCapCostInfoModalComponent,
    tenderGroupExclusionModalComponent,
    endCustomerRetailModalComponent,
    emailModal,
    systemPricePointModalComponent,
    TenderFolioComponent,
    dealProductsModalComponent,
    ProductBreakoutComponent,
    fileAttachmentComponent,
    dealTimelineComponent,
    OverlappingCheckComponent,
    notificationsSettingsDialog,
    notificationsModalDialog
]