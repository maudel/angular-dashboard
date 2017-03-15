import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';

import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginComponent } from './login/login.component';
import 'hammerjs';
import { FlexLayoutModule } from '@angular/flex-layout';
import { AngularFireModule } from 'angularfire2';
import { ReadersComponent } from './readers/readers.component';




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
    LoginComponent,
    ReadersComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    FlexLayoutModule,
    AngularFireModule.initializeApp(firebaseConfig)

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
