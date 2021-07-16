//angular changes
import './app.main';
import './app.routes';
//importing reporting to app module
//import './reporting';
import './shared';

import { NgModule,ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
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
//Authentication purpose for token
import { AuthInterceptor } from './shared/authorization/auth.interceptor';
//Added angular material version 11.2.13 to support button toggle
import { MatButtonToggleModule } from '@angular/material/button-toggle';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        BrowserModule,
        UpgradeModule,
        HttpClientModule,
        Ng2SearchPipeModule,
        BrowserAnimationsModule,
        ChartsModule,
        TooltipModule,
        MatButtonToggleModule
     ],
     providers: [
        {
          provide : HTTP_INTERCEPTORS,
          useClass: AuthInterceptor,
          multi   : true,
        },
    ],
    declarations: [
        LoaderComponent,
        ReportingComponent,
        EmployeeComponent
    ],
    entryComponents: [
        LoaderComponent,
        ReportingComponent,
        EmployeeComponent
    ]
})

export class AppModule {
    // Override Angular bootstrap so it doesn't do anything
    ngDoBootstrap() {
    }
}