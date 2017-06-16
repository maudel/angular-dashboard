import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import { AngularFireAuth,  } from 'angularfire2/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router'
@Injectable()
export class AuthService {
  user: Observable<firebase.User>;
  isAuth: boolean;
  rout: any;
  constructor(public afAuth: AngularFireAuth, public router: Router) {
    this.user = afAuth.authState;
    this.isAuth = false;
    this.rout = router;
  }
  loginGoogle() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
      .catch(function (error){
        alert('${error.message} Please try again')
      })
  }
  loginFacebook() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider())
      .catch(function (error){
        alert('${error.message} Please try again')
      })
  }
  signUp(email: string, password: string) {
    // this.afAuth.auth.createUserWithEmailAndPassword(email, password)
    //   .then(value => {
    //     console.log('Success!', value);
    //   })
    //   .catch(err => {
    //     console.log('Something went wrong:',err.message);
    //   });
  }
  signIn() {
    this.isAuth = true;
    this.rout.navigate([''])
    // this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  openAuthDialog (){
    // authDialog.openAuthDialog();
  }
  logout() {
    this.afAuth.auth.signOut();
  }
  isAuthenticated() {
    return  this.isAuth;
  }


}
