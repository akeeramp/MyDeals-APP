//angular changes
import './app.main';
import './app.routes';
//importing reporting to app module
import './reporting';
import './directives';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { UpgradeModule } from '@angular/upgrade/static';

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule
    ]
})

export class AppModule {
    // Override Angular bootstrap so it doesn't do anything
    ngDoBootstrap() {
    }
}