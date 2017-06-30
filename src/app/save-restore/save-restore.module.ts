import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaveRestoreRoutingModule } from './save-restore-routing.module';
import { SaveRestoreComponent } from './save-restore.component';

@NgModule({
  imports: [
    CommonModule,
    SaveRestoreRoutingModule
  ],
  declarations: [SaveRestoreComponent]
})
export class SaveRestoreModule { }
