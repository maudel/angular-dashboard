import { Component, OnInit, Output ,EventEmitter } from '@angular/core';
const SMALL_WIDTH_BREAKPOINT = 840;
import {MdDialog, MdDialogRef} from '@angular/material';
import {AuthService} from '../core/services/auth.service'

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();
  selectedOption: string;
  isDarkTheme = false;
  @Output() isDarkThemeSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public dialog: MdDialog, public  authService: AuthService) { }

  ngOnInit() {
  }
  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }
  openDialog() {
    this.dialog.open(UserSettingsDialog);
  }
  pickTheme(){
    this.isDarkTheme = !this.isDarkTheme;
    this.isDarkThemeSelected.emit(this.isDarkTheme);
  }
  logout(){
    this.authService.signOut()
  }

}
@Component({
  selector: 'user-settings-dialog',
  templateUrl: './user-settings-dialog.html',
})
export class UserSettingsDialog {
}
