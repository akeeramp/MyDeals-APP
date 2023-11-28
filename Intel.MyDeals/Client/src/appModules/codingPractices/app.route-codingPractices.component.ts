import { Routes } from "@angular/router";

//added for security check
import { CodingPracticesComponent } from "../../app/codingPractices/codingPractices.component";

//added for security check
import { SecurityResolver } from "../../app/shared/security.resolve";
import { authGuard } from "./../../app/shared/util/guardProtection";
import { CicdPipelineComponent } from "../../app/codingPractices/cicdPipeline/cicdPipeline.component";
import { ProjectFlowComponent } from "../../app/codingPractices/projectFlow/projectFlow.component";
import { BusinessProcessComponent } from "../../app/codingPractices/businessProcess/businessProcess.component";
import { CodingToolsComponent } from "../../app/codingPractices/codingTools/codingTools.component";
import { CodeQualityComponent } from "../../app/codingPractices/codeQuality/codeQuality.component";
import { ScopeDecisionComponent } from "../../app/codingPractices/scopeDecision/scopeDecision.component";


export const routesCodingPractices: Routes = [
    { path: 'Home', component: CodingPracticesComponent, data: { title: 'CodingPractices', BaseHref: 'CodingPractices' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'BusinessDesign', component: BusinessProcessComponent, data: { title: 'CodingPractices', BaseHref: 'CodingPractices' }, resolve: { security: SecurityResolver }, canActivate: [authGuard]},
    { path: 'CodingTools', component: CodingToolsComponent, data: { title: 'CodingPractices', BaseHref: 'CodingPractices' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'CodeQuality', component: CodeQualityComponent, data: { title: 'CodingPractices', BaseHref: 'CodingPractices' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'Project', component: ProjectFlowComponent, data: { title: 'CodingPractices', BaseHref: 'CodingPractices' }, resolve: { security: SecurityResolver },canActivate: [authGuard]},
    { path: 'Flows', component: ScopeDecisionComponent, data: { title: 'CodingPractices', BaseHref: 'CodingPractices' }, resolve: { security: SecurityResolver }, canActivate: [authGuard] },
    { path: 'CiCdPipeline', component: CicdPipelineComponent, data: { title: 'CodingPractices', BaseHref: 'CodingPractices' }, resolve: { security: SecurityResolver }, canActivate: [authGuard]},
    ];