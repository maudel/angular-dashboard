import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup-page',
  templateUrl: './signup-page.component.html',
  styleUrls: ['./signup-page.component.scss']
})
export class SignupPageComponent implements OnInit {
  authService: any;
  constructor($autService: AuthService) {
    this.authService = $autService;
  }

  ngOnInit() {
  }
  RegisterUser(){

  }

}
