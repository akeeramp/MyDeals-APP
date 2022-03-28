
import { DashboardComponent } from "../dashboard/dashboard/dashboard.component";
import { addWidgetComponent } from "../dashboard/addWidget/addWidget.component";
import { DashboardWidgetComponent } from "../dashboard/dashboardWidget.component";
import { NewContractWidgetComponent } from "../dashboard/newContractWidget.component";
import { openContractWidgetComponent } from "../dashboard/opencontract/openContractWidget.component";
import { RecentsUrlWidgetComponent } from "../dashboard/recentURL/recentsUrlWidget.component";
import { SearchContractWidgetComponent } from "../dashboard/searchContractWidget.component";
import { widgetSettingsComponent } from '../dashboard/widgetSettings/widgetSettings.component';
import {DealDeskWidgetComponent} from  "../dashboard/dealDeskWidget/dealDeskWidget.component"

export let dashboardComponents =[
    DashboardComponent,
    addWidgetComponent,
    DashboardWidgetComponent,
    NewContractWidgetComponent,
    openContractWidgetComponent,
    RecentsUrlWidgetComponent,
    SearchContractWidgetComponent,
    widgetSettingsComponent,
    DealDeskWidgetComponent
]