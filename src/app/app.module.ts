import { AppComponent } from './app.component';
import 'hammerjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from 'angularfire2';

// modules

import { CoreModule } from './core/core.module';
import { SharedModule } from   './shared/shared.module';
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
import { HomepageComponent } from './homepage/homepage.component';
import { ZonesComponent } from './zones/zones.component';
import { ReaderConfigurationComponent } from './reader-configuration/reader-configuration.component';
import { ItemComponent } from './item/item.component';
import { AttendantComponent } from './attendant/attendant.component';



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
    SidenavComponent,
    NavbarComponent,
    HomepageComponent,
    DialogOverviewExampleDialog,
    ZonesComponent,
    ReaderConfigurationComponent,
    ItemComponent,
    AttendantComponent,
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
