import * as $ from 'jquery';

import { NgModule, ElementRef, ApplicationRef } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//Gridster component
import { GridsterModule } from 'angular-gridster2';
//Added angular material for popup toggle
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DragDropModule } from '@angular/cdk/drag-drop';
//Added angular material version 11.2.13 to support button toggle
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatListModule } from '@angular/material/list';
//Helper and utility modules
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { OrderModule } from 'ngx-order-pipe';
import { NgPipesModule } from 'ngx-pipes';
//spreadsheet component
import { HotTableModule } from '@handsontable/angular';
//Authentication purpose for token
import { AuthInterceptor } from '../../app/shared/authorization/auth.interceptor';
//kendo components
import { ChartsModule } from '@progress/kendo-angular-charts';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import { GridModule, ExcelModule } from '@progress/kendo-angular-grid';
import { DialogModule, WindowModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule, DropDownsModule } from "@progress/kendo-angular-dropdowns";
import { InputsModule } from "@progress/kendo-angular-inputs";
import { DateInputsModule } from "@progress/kendo-angular-dateinputs";
import { EditorModule } from "@progress/kendo-angular-editor";
import { LayoutModule } from "@progress/kendo-angular-layout";
import { MenusModule } from '@progress/kendo-angular-menu';
import { UploadModule } from '@progress/kendo-angular-upload';
import { ButtonsModule } from "@progress/kendo-angular-buttons";
import { DecimalPipe, CurrencyPipe, DatePipe } from '@angular/common';
// Moment Injection
import { MomentService, StaticMomentService } from '../../app/shared/moment/moment.service';

//*********************admin components *********************
import { AdminComponents } from '../../app/modules/admin.module';
//*********************dashboard components *********************
//pipe module
import { MainPipe } from '../../app/modules/pipe.module';
import { broadCastService } from '../../app/core/dealPopup/broadcast.service';
import { RouterModule } from '@angular/router';
//*********************Angular single boot files *********************
//import { routes } from './app.route.component';
import { routesAdmin } from './app.route-admin.component';
import { SecurityResolver } from '../../app/shared/security.resolve';
import { AppRootComponent } from '../../app/app-root.component';
import { FooterComponent } from '../../app/shared/footer/footer.component';
import { notificationDockComponent } from '../../app/core/notification/notificationDock.component';
import { AdminBannerComponent } from '../../app/core/adminBanner/adminBanner.component';
import { dealPopupDockComponent } from '../../app/core/dealPopup/dealPopupDock.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { GlobalSearchComponent } from '../../app/advanceSearch/globalSearch/globalSearch.component';
import { LoadingSpinnerComponent } from '../../app/shared/loadingSpinner/loadingSpinner.component';
import { POPUP_CONTAINER } from '@progress/kendo-angular-popup';
import { registerAllModules } from 'handsontable/registry';
import { AdminUtilComponents } from './admin-util.module';
import { PendingChangesGuard } from "./../../app/shared/util/gaurdprotectionDeactivate";

// register Handsontable's modules
registerAllModules();

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
        MatListModule,
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
        NgPipesModule,
        OrderModule,
        GridsterModule,
        UploadModule,
        ButtonsModule,
        DragDropModule,
        ScrollingModule,
        MainPipe,
        RouterModule.forRoot(routesAdmin, { useHash: true })
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
        DecimalPipe,
        CurrencyPipe,
        DatePipe,
        broadCastService,
        SecurityResolver,
        MomentService,
        StaticMomentService,
        PendingChangesGuard
    ],
    declarations: [
        AppRootComponent,
        AdminComponents,
        AdminUtilComponents

    ],
    entryComponents:[
        AppRootComponent,
        AdminComponents,
        AdminUtilComponents
    ],
})

export class AppAdminModule {
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