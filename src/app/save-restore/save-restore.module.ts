import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaveRestoreRoutingModule } from './save-restore-routing.module';
import { SaveRestoreComponent } from './save-restore.component';
import {MatToolbarModule, MatButtonModule, MatListModule, MatInputModule, MatSliderModule, MatSlideToggleModule, MatTabsModule, MatIconModule, MatSidenavModule, MatMenuModule} from '@angular/material';
@NgModule({
  imports: [
    CommonModule,
    SaveRestoreRoutingModule,
    MatListModule
  ],
  declarations: [SaveRestoreComponent]
})
export class SaveRestoreModule { }
