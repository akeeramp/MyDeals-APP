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
    PingComponent
]