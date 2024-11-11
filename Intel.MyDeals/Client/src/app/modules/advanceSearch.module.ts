import { GlobalSearchComponent } from '../advanceSearch/globalSearch/globalSearch.component';
import { GlobalSearchResultsComponent } from '../advanceSearch/globalSearchResults/globalSearchResults.component';
import { TenderDashboardComponent } from '../advanceSearch/tenderDashboard/tenderDashboard.component';
import { AdvancedSearchComponent } from '../advanceSearch/advancedSearch.component';
import { goToComponent } from '../contract/goTo.component';
import { InActiveCustomerSearchComponent } from '../advanceSearch/inactiveCustomerSearch/inactiveCustomerSearch.component'; 

export let advanceSearchComponents = [
    GlobalSearchComponent,
    GlobalSearchResultsComponent,
    TenderDashboardComponent,
    AdvancedSearchComponent,
    goToComponent,
    InActiveCustomerSearchComponent
]