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

export let contractComponents = [
    contractDetailsComponent,
    lnavComponent,
    pricingTableComponent,
    pricingTableEditorComponent,
    TenderFolioComponent,
    tenderManagerComponent,
    ProductSelectorComponent,
    GeoSelectorComponent,
    marketSegComponent
]