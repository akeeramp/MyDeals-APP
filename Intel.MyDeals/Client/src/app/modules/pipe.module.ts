import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import { SanitizeHtmlPipe } from '../contract/dealEditor/sanitizepipe.component';

@NgModule({
  declarations:[SanitizeHtmlPipe], // <---
  imports:[CommonModule],
  exports:[SanitizeHtmlPipe] // <---
})

export class MainPipe{}