import { AppComponent } from './app.component';
import { FlexLayoutModule } from '@angular/flex-layout';
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
import {MdDialogModule, MdMenuModule, MdDialog, MdToolbarModule, MdButtonModule, MdInputModule, MdIconModule} from '@angular/material';


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
    // NavbarComponent,
    // UserSettingsDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MdToolbarModule,
    MdMenuModule,
    MdInputModule,
    MdDialogModule,
    MdButtonModule,
    MdIconModule,
    FlexLayoutModule,
    CoreModule,
    // SharedModule,
    // routing module
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [
    // UserSettingsDialog
  ]
})
export class AppModule {
  constructor(public dialog: MdDialog){

  }


}

