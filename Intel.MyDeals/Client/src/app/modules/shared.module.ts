import { LoaderComponent } from '../shared/loader/loader.component';
import { MultiCheckFilterComponent } from "../shared/kendo/multichecker.component";
import {KendoControlComponent} from '../shared/kendo_controls/kendocontrol.component';
import { CustomDateFilterComponent } from '../shared/kendo/customDateFilter.component';
import { FooterComponent } from '../shared/footer/footer.component';
import {LoadingSpinnerComponent} from '../shared/loadingSpinner/loadingspinner.component';
import {nestedLoaderComponent} from '../shared/kendo_controls/kendonested.component';
import {nestedGridComponent} from '../shared/kendo_controls/kendonestedgrid.component';
import { HeaderComponent } from '../shared/header/header.component';
import { CustomDropDownFilterComponent } from '../shared/kendo/customDropDownFilter.component';

export let sharedComponents =[
    HeaderComponent,
    LoaderComponent,
    MultiCheckFilterComponent,
    KendoControlComponent,
    CustomDateFilterComponent,
    FooterComponent,
    LoadingSpinnerComponent,
    nestedLoaderComponent,
    nestedGridComponent,
    CustomDropDownFilterComponent
]