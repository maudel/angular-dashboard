import { AppComponent } from './app.component';
import 'hammerjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from 'angularfire2';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
// modules

import { CoreModule } from './core/core.module';
import { SharedModule } from  './shared/shared.module';
import { AuthModule } from './auth/auth.module';
import { HomeModule } from './home/home.module'
import { DashboardModule } from './dashboard/dashboard.module'

import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule , MdDialog  } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';


// components
import { NavbarComponent, UserSettingsDialog } from './navbar/navbar.component';
import { ComponentNavbarComponent } from './component-navbar/component-navbar.component';
import { StarflexUpgradeComponent } from './starflex-upgrade/starflex-upgrade.component';
import { SaveRestoreComponent } from './save-restore/save-restore.component';




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

    NavbarComponent,
    ComponentNavbarComponent,
    UserSettingsDialog,
    StarflexUpgradeComponent,
    SaveRestoreComponent,
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
    AuthModule,
    // routing module

    AppRoutingModule,


    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    UserSettingsDialog
  ]
})
export class AppModule {
  constructor(public dialog: MdDialog){

  }


}
