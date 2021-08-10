import * as angular from 'angular';
import { Input, Component, OnInit } from "@angular/core";
import { downgradeComponent } from "@angular/upgrade/static";

@Component({
  selector: 'ccLoader',
  templateUrl: 'Client/src/app/shared/loader/loader.html'
})
export class LoaderComponent implements OnInit  {
  constructor() { }

    @Input() public isLoading: boolean;
    @Input() public message: string;
    @Input() public module: string;
    @Input() public isInitializing: boolean;

  ngOnInit() {
    console.log('loader***************',this.message,this.module,this.isLoading,this.isInitializing);
  }
}

angular
.module('app')
.directive("ccLoader", downgradeComponent({
  component: LoaderComponent,
    inputs: ['isLoading', 'message', 'module', 'isInitializing']
}));