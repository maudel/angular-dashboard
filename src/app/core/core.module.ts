import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';

// services

import { AiaConfigService} from './services/aia-config.service';
import { AuthService} from './services/auth.service'
import { GenericService } from './services/generic.service'
// http related

import { HttpModule, RequestOptions } from '@angular/http';

import { StoreModule } from '@ngrx/store';

// Must export the config
export const firebaseConfig = {
  apiKey: "AIzaSyAW6_gady9XHegVN94Cs8oTpOzM978BJ04",
  authDomain: "angularmcon.firebaseapp.com",
  databaseURL: "https://angularmcon.firebaseio.com",
  storageBucket: "angularmcon.appspot.com",
  messagingSenderId: "850875400239"
};

@NgModule({
  imports: [
    CommonModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule
  ],
  declarations: [

  ],
  providers: [
    AiaConfigService,
    GenericService,
    AuthService
  ]
})
export class CoreModule { }
