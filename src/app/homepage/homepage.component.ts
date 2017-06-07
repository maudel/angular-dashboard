import { Component, OnInit } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss']
})
export class HomepageComponent implements OnInit {
  email: string;
  password: string;
  authService: any;
  constructor(authService: AuthService) {
    // this.authService = authService;
  }

  // signUp(){
  //   this.authService.signUp(this.email, this.password);
  //   this.email = this.password = '';
  // }
  // signIn(){
  //   this.authService.signUp(this.email, this.password);
  //   this.email = this.password = '';
  // }
  // signOut(){
  //   this.authService.signUp(this.email, this.password);
  //   this.email = this.password = '';
  // }
  ngOnInit() {
  }

}
