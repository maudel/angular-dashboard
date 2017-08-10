import { Component, OnInit, Output , EventEmitter } from '@angular/core';
const SMALL_WIDTH_BREAKPOINT = 840;
import {MdDialog, MdDialogRef} from '@angular/material';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  selectedOption: string;
  isDarkTheme = false;
  @Output() isDarkThemeSelected: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public dialog: MdDialog, public  authService: AuthService) { }

  ngOnInit() {
  }
  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }


}
@Component({
  selector: 'app-user-settings-dialog',
  templateUrl: './user-settings-dialog.html',
})
export class UserSettingsDialogComponent {
}
