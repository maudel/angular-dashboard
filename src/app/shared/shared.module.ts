import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MdToolbarModule,MdMenuModule, MdButtonModule,MdIconModule, MdInputModule, MdDialogModule } from '@angular/material';
import { NavbarComponent, UserSettingsDialogComponent } from './navbar/navbar.component';
// import { MaterialModule , MdDialog  } from '@angular/material';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms'
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    // MaterialModule.forRoot(),
    MdToolbarModule,
    RouterModule,
    MdMenuModule,
    MdButtonModule,
    MdIconModule,
    FlexLayoutModule,
    MdInputModule,
    MdDialogModule,
    FormsModule
  ],
  declarations: [
    NavbarComponent,
    UserSettingsDialogComponent
  ],
  entryComponents: [
    UserSettingsDialogComponent
  ],
  exports: [
    NavbarComponent
  ]
})
export class SharedModule { }
