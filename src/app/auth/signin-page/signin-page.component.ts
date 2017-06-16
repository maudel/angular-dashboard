import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-signin-page',
  templateUrl: './signin-page.component.html',
  styleUrls: ['./signin-page.component.scss']
})
export class SigninPageComponent implements OnInit {
  public authService: any;

  constructor($authService: AuthService) {
    this.authService = $authService;
  }
  ngOnInit() {
  }
  loginUser(){
    this.authService.signIn();
  }

}
