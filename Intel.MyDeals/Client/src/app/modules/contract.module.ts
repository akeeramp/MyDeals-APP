//import { contractComponent } from "../contract/contract.component";
import { contractDetailsComponent } from "../contract/contractDetails/contractDetails.component";
import { lnavComponent } from "../contract/lnav/lnav.component";
import { pricingTableComponent } from "../contract/pricingTable/pricingTable.component";
import { pricingTableEditorComponent } from "../contract/pricingTableEditor/pricingTableEditor.component";
import { TenderFolioComponent } from "../contract/tenderFolio/tenderFolio.component"
import { tenderManagerComponent } from "../contract/tenderManager/tenderManager.component"
import { ProductSelectorComponent } from "../contract/ptModals/productSelector/productselector.component";
import { GeoSelectorComponent } from "../contract/ptModals/geo/geo.component";
import { marketSegComponent } from "../contract/ptModals/marketSegment/marketSeg.component";
import { meetCompContractComponent } from "../contract/meetComp/meetComp.component";
import { dealEditorComponent } from "../contract/dealEditor/dealEditor.component";
import { contractManagerComponent } from "../contract/contractManager/contractManager.component";
import { AutoFillComponent } from "../contract/ptModals/autofillsettings/autofillsettings.component";
import { dealEditorHeaderTemplateComponent } from "../contract/dealEditor/dealEditorHeaderTemplate.component";
import { dealEditorCellTemplateComponent } from "../contract/dealEditor/dealEditorCellTemplate.component";
import { dealEditorEditTemplateComponent } from "../contract/dealEditor/dealEditorEditTemplate.component";
import { managerPctComponent } from "../contract/managerPct/managerPct.component";
import { pctChildGridComponent } from "../contract/managerPct/pctChildGrid.component";
import { systemPricePointModalComponent } from "../contract/ptModals/dealEditorModals/systemPricePointModal.component";
import { endCustomerRetailModalComponent } from "../contract/ptModals/dealEditorModals/endCustomerRetailModal.component";

export let contractComponents = [
    contractDetailsComponent,
    lnavComponent,
    pricingTableComponent,
    pricingTableEditorComponent,
    TenderFolioComponent,
    tenderManagerComponent,
    ProductSelectorComponent,
    GeoSelectorComponent,
    marketSegComponent,
    meetCompContractComponent,
    dealEditorComponent,
    contractManagerComponent,
    AutoFillComponent,
    dealEditorCellTemplateComponent,
    dealEditorEditTemplateComponent,
    dealEditorHeaderTemplateComponent,
    managerPctComponent,
    pctChildGridComponent,
    systemPricePointModalComponent,
    endCustomerRetailModalComponent
]