import { ContractDetailsComponent } from "../contract/contractDetails/contractDetails.component";
import { LnavComponent } from "../contract/lnav/lnav.component";
import { pricingTableComponent } from "../contract/pricingTable/pricingTable.component";
import { PricingTableEditorComponent } from "../contract/pricingTableEditor/pricingTableEditor.component";
import { TenderFolioComponent } from "../contract/tenderFolio/tenderFolio.component"
import { TenderManagerComponent } from "../contract/tenderManager/tenderManager.component"
import { publishTenderComponent } from "../contract/publishTender/publishTender.component"
import { ProductSelectorComponent } from "../contract/ptModals/productSelector/productselector.component";
import { GeoSelectorComponent } from "../contract/ptModals/geo/geo.component";
import { multiSelectModalComponent } from "../contract/ptModals/multiSelectModal/multiSelectModal.component";
import { MeetCompContractComponent } from "../contract/meetComp/meetComp.component";
import { dealEditorComponent } from "../contract/dealEditor/dealEditor.component";
import { contractManagerComponent } from "../contract/contractManager/contractManager.component";
import { AutoFillComponent } from "../contract/ptModals/autofillsettings/autofillsettings.component";
import { dealEditorHeaderTemplateComponent } from "../contract/dealEditor/dealEditorHeaderTemplate.component";
import { dealEditorCellTemplateComponent } from "../contract/dealEditor/dealEditorCellTemplate.component";
import { dealEditorEditTemplateComponent } from "../contract/dealEditor/dealEditorEditTemplate.component";
import { ManagerPctComponent } from "../contract/managerPct/managerPct.component";
import { pctChildGridComponent } from "../contract/managerPct/pctChildGrid.component";
import { systemPricePointModalComponent } from "../contract/ptModals/dealEditorModals/systemPricePointModal.component";
import { endCustomerRetailModalComponent } from "../contract/ptModals/dealEditorModals/endCustomerRetailModal.component";
import { RenameTitleComponent } from "../contract/ptModals/renameTitle/renameTitle.component";
import { managerExcludeGroupsComponent } from "../contract/managerExcludeGroups/managerExcludeGroups.component";
import { excludeDealGroupModalDialog } from "../contract/managerExcludeGroups/excludeDealGroupModal.component";
import { ProductCorrectorComponent } from "../contract/ptModals/productCorrector/productcorrector.component";
import { overLappingDealsComponent } from "../contract/overLappingDeals/overLappingDeals.component";
import { contractHistoryComponent } from "../contract/contractHistory/contractHistory.component";
import { missingCAPComponent } from "../contract/missingCAP/missingCAP.component";
import { contractExportComponent } from "../contract/contractExport/contractExport.component";
import { allDealsComponent } from "../contract/allDeals/allDeals.component";
import { GridPopoverComponent } from "../contract/ptModals/productSelector/gridPopover/gridPopover.component";
import { ProductBreakoutComponent } from "../contract/ptModals/productSelector/productBreakout/productBreakout.component";
import { OverlappingCheckComponent } from "../contract/ptModals/overlappingCheckDeals/overlappingCheckDeals.component";
import { actionSummaryModal } from "../contract/contractManager/actionSummaryModal/actionSummaryModal.component";
import { dealProductsModalComponent } from "../contract/ptModals/dealProductsModal/dealProductsModal.component"
import {meetCompDealDetailModalComponent} from "../contract/meetComp/meetCompDealDetailModal.component"
import { emailModal } from "../contract/contractManager/emailModal/emailModal.component";
import { messageBoardModal } from "../contract/contractManager/messageBoard/messageBoard.component";
import { FlexOverlappingCheckComponent } from "../contract/ptModals/flexOverlappingDealsCheck/flexOverlappingDealsCheck.component";
import { pctOverrideReasonModal } from "../contract/managerPct/pctOverrideReasonModal/pctOverrideReasonModal.component";
import { kendoCalendarComponent } from "../contract/ptModals/kendoCalenderModal/kendoCalendar.component";
import { pctGroupModal } from "../contract/managerPct/pctGroupModal/pctGroupModal.component";
import { tenderMCTPCTModalComponent } from "../contract/ptModals/tenderDashboardModals/tenderMCTPCTModal.component";
import { tenderGroupExclusionModalComponent } from "../contract/ptModals/tenderDashboardModals/tenderGroupExclusionModal.component";
import { missingCapCostInfoModalComponent } from "../contract/ptModals/dealEditorModals/missingCapCostInfoModal.component";
import { dropDownModalComponent } from '../contract/ptModals/dropDownModal/dropDownModal.component';
import { performanceBarsComponent } from "../contract/performanceBars/performanceBar.component";
import { goToComponent } from "../contract/goTo.component";
import { ComplexStackingModalComponent } from "../contract/contractManager/complexStackingModal/complexStackingModal.component";

export let contractComponents = [
    ContractDetailsComponent,
    LnavComponent,
    pricingTableComponent,
    PricingTableEditorComponent,
    TenderFolioComponent,
    TenderManagerComponent,
    publishTenderComponent,
    ProductSelectorComponent,
    GeoSelectorComponent,
    multiSelectModalComponent,
    MeetCompContractComponent,
    dealEditorComponent,
    contractManagerComponent,
    AutoFillComponent,
    dealEditorCellTemplateComponent,
    dealEditorEditTemplateComponent,
    dealEditorHeaderTemplateComponent,
    ManagerPctComponent,
    pctChildGridComponent,
    systemPricePointModalComponent,
    endCustomerRetailModalComponent,
    RenameTitleComponent,
    managerExcludeGroupsComponent,
    excludeDealGroupModalDialog,
    ProductCorrectorComponent,
    overLappingDealsComponent,
    contractHistoryComponent,
    missingCAPComponent,
    contractExportComponent,
    allDealsComponent,
    GridPopoverComponent,
    ProductBreakoutComponent,
    OverlappingCheckComponent,
    actionSummaryModal,
    dealProductsModalComponent,
    meetCompDealDetailModalComponent,
    messageBoardModal,
    emailModal,
    FlexOverlappingCheckComponent,
    pctOverrideReasonModal,
    kendoCalendarComponent,
    pctGroupModal,
    missingCapCostInfoModalComponent,
    tenderMCTPCTModalComponent,
    tenderGroupExclusionModalComponent,
    dropDownModalComponent,
    performanceBarsComponent,
    goToComponent,
    ComplexStackingModalComponent
]