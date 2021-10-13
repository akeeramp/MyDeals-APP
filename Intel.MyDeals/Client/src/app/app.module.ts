//angular changes
import './app.main';
import './app.routes';
import './shared';
//importing reporting to app module


import { NgModule,ElementRef } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { Ng2SearchPipeModule } from 'ng2-search-filter';
//added for kendo chart to support animation
import { ChartsModule } from '@progress/kendo-angular-charts';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// application component
import { LoaderComponent } from './shared/loader/loader.component';
import { ReportingComponent } from './reporting/reporting.component';
import { EmployeeComponent } from './admin/employee/admin.employee.component';
import { PingComponent } from './shared/core/ping/ping.component'
//kendo component POC
import { PopupModule, POPUP_CONTAINER } from '@progress/kendo-angular-popup';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule,DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { MultiCheckFilterComponent } from "./shared/kendo/multichecker.component";
import {KendoComponent} from './shared/kendo/kendo.component';

//*********************admin modules starts here *********************
import { CacheComponent } from './admin/cache/cache.component';
import { adminCustomerComponent } from './admin/customer/admin.customer.component';
import { adminCustomerVendorsComponent } from './admin/CustomerVendors/admin.customerVendors.component';
//*********************admin modules ends here *********************

//Authentication purpose for token
import { AuthInterceptor } from './shared/authorization/auth.interceptor';
//Added angular material version 11.2.13 to support button toggle
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
//spreadsheet component
import { HotTableModule } from '@handsontable/angular';
import {SpreadComponent} from './shared/kendo/spreadsheet.component';
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
        ChartsModule,
        TooltipModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatDialogModule,
        DialogModule,
        DropDownListModule,
        DropDownsModule,
        GridModule,
        HotTableModule,
        MatFormFieldModule,
        MatInputModule
        
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
        KendoComponent,
        EmployeeComponent,
        CacheComponent,
        adminCustomerComponent,
        adminCustomerVendorsComponent,
        MultiCheckFilterComponent,
        SpreadComponent,
        PingComponent,
    ],
    entryComponents: [
        LoaderComponent,
        ReportingComponent,
        KendoComponent,
        EmployeeComponent,
        CacheComponent,
        CacheComponent,
        adminCustomerComponent,
        adminCustomerVendorsComponent,
        SpreadComponent,
        PingComponent,
    ]
})

export class AppModule {
    // Override Angular bootstrap so it doesn't do anything
    ngDoBootstrap() {
    }
}