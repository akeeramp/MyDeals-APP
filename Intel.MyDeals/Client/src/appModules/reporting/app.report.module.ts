
import { NgModule, ElementRef, ApplicationRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';

//Added angular material for popup toggle
import { MatDialogModule } from '@angular/material/dialog';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ScrollingModule } from '@angular/cdk/scrolling';
//Added angular material version 11.2.13 to support button toggle
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
//Helper and utility modules
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgPipesModule } from 'ngx-pipes';
//Authentication purpose for token
import { AuthInterceptor } from '../../app/shared/authorization/auth.interceptor';
//kendo components
import { ChartsModule } from '@progress/kendo-angular-charts';
import { GridModule } from '@progress/kendo-angular-grid';
import { DialogModule, WindowModule } from '@progress/kendo-angular-dialog';
import { DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
// Moment Injection
import { MomentService } from '../../app/shared/moment/moment.service';
//*********************Reporting components *********************
import { ReportingComponent } from '../../app/reporting/reporting.component';
//*********************dashboard util components *********************
import { ReportUtilComponents } from './report-util.module';
import { broadCastService } from '../../app/core/dealPopup/broadcast.service';
//*********************Angular single boot files *********************
import { routesReport } from './app.route-report.component';
import { SecurityResolver } from '../../app/shared/security.resolve';
import { AppRootComponent } from '../../app/app-root.component';
import { FooterComponent } from '../../app/shared/footer/footer.component';
import { notificationDockComponent } from '../../app/core/notification/notificationDock.component';
import { AdminBannerComponent } from '../../app/core/adminBanner/adminBanner.component';
import { dealPopupDockComponent } from '../../app/core/dealPopup/dealPopupDock.component';
import { GlobalSearchComponent } from '../../app/advanceSearch/globalSearch/globalSearch.component';
import { LoadingSpinnerComponent } from '../../app/shared/loadingSpinner/loadingSpinner.component';
import { POPUP_CONTAINER } from '@progress/kendo-angular-popup';
import { SearchFilterModule } from '../shared/searchFilter.module';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        HttpClientModule,
        BrowserAnimationsModule,
        ToastrModule.forRoot(),
        ChartsModule,
        MatButtonToggleModule,
        MatSlideToggleModule,
        MatDialogModule,
        MatListModule,
        DialogModule,
        WindowModule,
        DropDownsModule,
        InputsModule,
        GridModule,
        NgbModule,
        DateInputsModule,
        NgPipesModule,
        DragDropModule,
        ScrollingModule,
        SearchFilterModule,
        RouterModule.forRoot(routesReport, { useHash: true })
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        {
            provide: POPUP_CONTAINER,
            useFactory: () => {
                //return the container ElementRef, where the popup will be injected
                return { nativeElement: document.body } as ElementRef;
            }
        },
        broadCastService,
        SecurityResolver,
        MomentService
    ],
    declarations: [
        AppRootComponent,
        ReportingComponent,
        ReportUtilComponents
    ],
  
    entryComponents:[
        AppRootComponent,
        ReportingComponent,
        ReportUtilComponents
    ],
})

export class AppReportModule {
    ngDoBootstrap(appRef: ApplicationRef) {
        appRef.bootstrap(AppRootComponent);
        appRef.bootstrap(FooterComponent);
        appRef.bootstrap(notificationDockComponent);
        appRef.bootstrap(AdminBannerComponent);
        appRef.bootstrap(dealPopupDockComponent);
        appRef.bootstrap(GlobalSearchComponent);
        appRef.bootstrap(LoadingSpinnerComponent);
      }
}