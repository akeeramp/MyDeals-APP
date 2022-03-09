import { LoaderComponent } from '../shared/loader/loader.component';
import { MultiCheckFilterComponent } from "../shared/kendo/multichecker.component";
import {KendoControlComponent} from '../shared/kendo_controls/kendocontrol.component';
import {SpreadComponent} from '../shared/handsone/spreadsheet.component.handson';
import {DialogOverviewExampleDialog} from '../shared/modalPopUp/modal.component';
import { CustomDateFilterComponent } from '../shared/kendo/customDateFilter.component';
import { FooterComponent } from '../shared/footer/footer.component';
import {LoadingSpinnerComponent} from '../shared/loadingSpinner/loadingspinner.component';
import {nestedLoaderComponent} from '../shared/kendo_controls/kendonested.component';
import {nestedGridComponent} from '../shared/kendo_controls/kendonestedgrid.component';

export let sharedComponents =[
    LoaderComponent,
    MultiCheckFilterComponent,
    KendoControlComponent,
    SpreadComponent,
    DialogOverviewExampleDialog,
    CustomDateFilterComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    nestedLoaderComponent,
    nestedGridComponent
]