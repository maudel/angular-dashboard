import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.scss']
})
export class SigninPageComponent implements OnInit {
  public authService: any;
  public selectedValue: any;
  languages = [
    {value: 'english', viewValue: 'English'},
    {value: 'deutsch', viewValue: 'Deutsch'},
    {value: 'español', viewValue: 'Español'}
  ];
  constructor($authService: AuthService) {
    this.authService = $authService;
    this.selectedValue = this.languages[0];
  }
  ngOnInit() {

  }

  loginUser(){
    this.authService.signIn();
  }
  onSignInGoogle() {
    // this.loading = true;
    this.authService.signInWithGoogle();
    // this.alertService.showToaster('Google login succesful');
  }

  onSignInTwitter() {
    // this.loading = true;
    this.authService.signInWithTwitter();
    // this.alertService.showToaster('Twitter login succesful');
  }

  onSignInFacebook() {
    // this.loading = true;
    this.authService.signInWithFacebook();
    // this.alertService.showToaster('Facebook login succesful');
  }

  onSignInGithub() {
    // this.loading = true;
    this.authService.signInWithGithub();
    // this.alertService.showToaster('Github login succesful');
  }

}
