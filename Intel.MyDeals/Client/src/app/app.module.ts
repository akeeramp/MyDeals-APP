//angular changes
import './app.main';
import './app.routes';
import './core';
import './advanceSearch';
import * as $ from 'jquery';

import { NgModule,ElementRef } from '@angular/core';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { HTTP_INTERCEPTORS,HttpClientModule } from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
//Added angular material for popup toggle
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
//Added angular material version 11.2.13 to support button toggle
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
//Helper and utility modules
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { OrderModule } from 'ngx-order-pipe';
import { OrderByPipe } from 'ngx-pipes';
//spreadsheet component
import { HotTableModule } from '@handsontable/angular';
//******************shared components**************************
import {sharedComponents} from './modules/shared.module';
//Authentication purpose for token
import { AuthInterceptor } from './shared/authorization/auth.interceptor';
//reporting component
import { ReportingComponent } from './reporting/reporting.component';
//core component
import { PingComponent } from './core/ping/ping.component';
//kendo components
import { ChartsModule } from '@progress/kendo-angular-charts';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { PopupModule, POPUP_CONTAINER } from '@progress/kendo-angular-popup';
import { GridModule,ExcelModule } from '@progress/kendo-angular-grid';
import { DialogModule,WindowModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule,DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { EditorModule } from "@progress/kendo-angular-editor";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { MenusModule } from '@progress/kendo-angular-menu';
//*********************admin components *********************
import { adminComponents } from './modules/admin.module';

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
        OrderModule,
        
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
        OrderByPipe,
        ReportingComponent,
        PingComponent,
        sharedComponents,
        adminComponents,
    ],
    entryComponents: [
        
        ReportingComponent,
        PingComponent,
        sharedComponents,
        adminComponents
    ]
})

export class AppModule {
    // Override Angular bootstrap so it doesn't do anything
    ngDoBootstrap() {
    }
}