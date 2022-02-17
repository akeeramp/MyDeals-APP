import * as angular from 'angular';
import { Input,Output, Component, OnInit,EventEmitter } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";
import { NgIf } from '@angular/common';

@Component({
  selector: 'ccLoader',
  template: `
  <div class="fullHeight" *ngIf="isLoading=='true'">
    <div class="jumbotron ng-scope">
        <div class="container">
            <h1><strong>My</strong> Deals </h1>
            <p class="lead">
                {{ module }}
            </p>
            <p *ngIf="isInitializing=='true'"> <small>Initializing...</small></p>
            <p>{{ message }}</p>
        </div>
    </div>
  </div>`
})
export class LoaderComponent  {
  constructor() {

   }
  // Where ever loader is using the booler values are also giving in string format ,
  //  for some reason the values are not identifying as expected thats the reason conditiong with 
  //  NgIf

    @Input() private isLoading: string;
    @Input() private message: string;
    @Input() private module: string;
    @Input() private isInitializing: string;
    
 }
angular
.module('app')
.directive("ccLoader", downgradeComponent({
  component: LoaderComponent,
    inputs: ['isLoading', 'message', 'module', 'isInitializing']
}));