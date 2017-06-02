import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import 'hammerjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from 'angularfire2';
import { ReadersComponent } from './readers/readers.component';

// modules

import { CoreModule } from './core/core.module';
import { SharedModule } from  './shared/shared.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule , MdDialog  } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// 3rd Party
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { SidenavComponent } from './sidenav/sidenav.component';
import { NavbarComponent, DialogOverviewExampleDialog } from './navbar/navbar.component';
import { ComponentNavbarComponent } from './component-navbar/component-navbar.component';
import { HomepageComponent } from './homepage/homepage.component';
import { ZonesComponent } from './zones/zones.component';



// feature/shared modules
// NOTE: lazy loaded modules MUST NOT be imported
// they must be referenced through the router, see `app-routing.module.ts`


// Login Dialog

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyAW6_gady9XHegVN94Cs8oTpOzM978BJ04",
  authDomain: "angularmcon.firebaseapp.com",
  databaseURL: "https://angularmcon.firebaseio.com",
  storageBucket: "angularmcon.appspot.com",
  messagingSenderId: "850875400239"
};
@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    ReadersComponent,
    SidenavComponent,
    NavbarComponent,
    ComponentNavbarComponent,
    HomepageComponent,
    DialogOverviewExampleDialog,
    ZonesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    FlexLayoutModule,
    AngularFireModule.initializeApp(firebaseConfig),
    CoreModule,
    SharedModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    Ng2SmartTableModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    DialogOverviewExampleDialog
  ]
})
export class AppModule {
  constructor(public dialog: MdDialog){
  }
}
