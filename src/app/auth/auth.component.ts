import { Component, OnInit,Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router'
@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  isDarkTheme = false;
  @Output() isDarkThemeSelected1: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(private router: Router) {

  }
  public changeTheme (event){
    console.log(event)

    this.isDarkThemeSelected1.emit(event);
  }
  ngOnInit() {
    this.router.navigate(['auth/signIn'], {});

  }

}
