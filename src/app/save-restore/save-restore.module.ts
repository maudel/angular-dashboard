import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaveRestoreRoutingModule } from './save-restore-routing.module';
import { SaveRestoreComponent } from './save-restore.component';
import {MdToolbarModule,MdButtonModule, MdListModule,MdInputModule, MdSliderModule, MdSlideToggleModule, MdTabsModule, MdIconModule, MdSidenavModule, MdMenuModule} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    SaveRestoreRoutingModule,
    MdListModule
  ],
  declarations: [SaveRestoreComponent]
})
export class SaveRestoreModule { }
