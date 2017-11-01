import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule, MatMenuModule, MatButtonModule, MatIconModule, MatInputModule, MatDialogModule } from '@angular/material';
import { NavbarComponent, UserSettingsDialogComponent } from './navbar/navbar.component';
// import { MaterialModule , MdDialog  } from '@angular/material';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

@NgModule({
  imports: [
    CommonModule,
    // MaterialModule.forRoot(),
    MatToolbarModule,
    RouterModule,
    MatMenuModule,
    MatButtonModule,
    MatIconModule,
    FlexLayoutModule,
    MatInputModule,
    MatDialogModule,
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
