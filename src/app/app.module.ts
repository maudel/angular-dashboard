import { AppComponent } from './app.component';
// import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// modules
import { CoreModule } from './core/core.module';
// import { SharedModule } from  './shared/shared.module';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
// import { MaterialModule , MdDialog  } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatDialogModule, MatMenuModule, MatDialog, MatToolbarModule, MatButtonModule, MatInputModule, MatIconModule,
  MatProgressSpinnerModule, MatGridListModule, MatCardModule, MatTableModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { TestDashboradComponent } from './test-dashborad/test-dashborad.component';
import { LayoutModule } from '@angular/cdk/layout';
import { TestTableComponent } from './test-table/test-table.component';

// components
// import { NavbarComponent, UserSettingsDialog } from './navbar/navbar.component';
// import { StartStopDirective } from './start-stop.directive';
// feature/shared modules
// NOTE: lazy loaded modules MUST NOT be imported
// they must be referenced through the router, see `app-routing.module.ts`


// Login Dialog

// // Must export the config
// export const firebaseConfig = {
//   apiKey: "AIzaSyAW6_gady9XHegVN94Cs8oTpOzM978BJ04",
//   authDomain: "angularmcon.firebaseapp.com",
//   databaseURL: "https://angularmcon.firebaseio.com",
//   storageBucket: "angularmcon.appspot.com",
//   messagingSenderId: "850875400239"
// };
@NgModule({
  declarations: [
    AppComponent,
    TestDashboradComponent,
    TestTableComponent,
    // NavbarComponent,
    // UserSettingsDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MatToolbarModule,
    MatMenuModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    // FlexLayoutModule,
    MatProgressSpinnerModule,
    CoreModule,
    // SharedModule,
    // routing module
    AppRoutingModule,
    BrowserAnimationsModule,
    MatGridListModule,
    MatCardModule,
    LayoutModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    // UserSettingsDialog
  ]
})
export class AppModule {
  constructor(public dialog: MatDialog){

  }


}

