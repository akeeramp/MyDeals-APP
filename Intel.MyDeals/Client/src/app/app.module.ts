//angular changes
import './app.main';
import './app.routes';
import './shared';
import * as $ from 'jquery';
//importing reporting to app module


import { NgModule,ElementRef } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
//added for kendo chart to support animation and logging
import { ChartsModule } from '@progress/kendo-angular-charts';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
// application component
import { LoaderComponent } from './shared/loader/loader.component';
import { ReportingComponent } from './reporting/reporting.component';
import { EmployeeComponent } from './admin/employee/admin.employee.component';
import { PingComponent } from './shared/core/ping/ping.component'
//kendo component POC
import { PopupModule, POPUP_CONTAINER } from '@progress/kendo-angular-popup';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { GridModule,ExcelModule } from '@progress/kendo-angular-grid';
import { DialogModule,WindowModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule,DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { MultiCheckFilterComponent } from "./shared/kendo/multichecker.component";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { EditorModule } from "@progress/kendo-angular-editor";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { MenusModule } from '@progress/kendo-angular-menu';
import { OrderModule } from 'ngx-order-pipe';
import { OrderByPipe } from 'ngx-pipes'
import {KendoControlComponent} from './shared/kendo_controls/kendocontrol.component';

//*********************admin modules starts here *********************
import { CacheComponent } from './admin/cache/admin.cache.component';
import { adminCustomerComponent } from './admin/customer/admin.customer.component';
import { adminCustomerVendorsComponent } from './admin/CustomerVendors/admin.customerVendors.component';
import { OpLogComponent } from './admin/oplog/admin.oplog.component';
import { batchTimingComponent } from './admin/batchTiming/admin.batchTiming.component';
import { adminVistexCustomerMappingComponent } from './admin/vistexCustomerMapping/admin.vistexCustomerMapping.component';
import { adminPrimeCustomersComponent } from './admin/PrimeCustomers/admin.primeCustomers.component';

//*********************admin modules ends here *********************

//Authentication purpose for token
import { AuthInterceptor } from './shared/authorization/auth.interceptor';
//Added angular material version 11.2.13 to support button toggle
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
//spreadsheet component
import { HotTableModule } from '@handsontable/angular';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {SpreadComponent} from './shared/handsone/spreadsheet.component.handson';
import {DialogOverviewExampleDialog} from './shared/modalPopUp/modal.component';
//Added angular material for popup toggle
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        UpgradeModule,
        HttpClientModule,
        Ng2SearchPipeModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        ChartsModule,
        TooltipModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatDialogModule,
        DialogModule,
        WindowModule,
        DropDownListModule,
        DropDownsModule,
        InputsModule,
        GridModule,
        ExcelModule,
        MatFormFieldModule,
        MatInputModule,
        HotTableModule,
        NgbModule,
        DateInputsModule,
        EditorModule,
        LayoutModule,
        MenusModule,
        DateInputsModule,
        OrderModule
     ],
     providers: [
        {
          provide : HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi   : true,
        },
        {
            provide: POPUP_CONTAINER,
            useFactory: () => {
               //return the container ElementRef, where the popup will be injected
               return { nativeElement: document.body } as ElementRef;
            }
        }
    ],
    declarations: [
        LoaderComponent,
        ReportingComponent,
        EmployeeComponent,
        CacheComponent,
        adminCustomerComponent,
        adminCustomerVendorsComponent,
        MultiCheckFilterComponent,
        PingComponent,
        SpreadComponent,
        DialogOverviewExampleDialog,
        OpLogComponent,
        OrderByPipe,
        batchTimingComponent,
        KendoControlComponent,
        adminVistexCustomerMappingComponent,
        adminPrimeCustomersComponent
    ],
    entryComponents: [
        LoaderComponent,
        ReportingComponent,
        EmployeeComponent,
        CacheComponent,
        CacheComponent,
        adminCustomerComponent,
        adminCustomerVendorsComponent,
        PingComponent,
        SpreadComponent,
        DialogOverviewExampleDialog,
        OpLogComponent,
        batchTimingComponent,
        KendoControlComponent,
        adminVistexCustomerMappingComponent,
        adminPrimeCustomersComponent
    ]
})

export class AppModule {
    // Override Angular bootstrap so it doesn't do anything
    ngDoBootstrap() {
    }
}