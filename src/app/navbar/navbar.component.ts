import { Component, OnInit, Output ,EventEmitter } from '@angular/core';
const SMALL_WIDTH_BREAKPOINT = 840;
import {MdDialog, MdDialogRef} from '@angular/material';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();
  selectedOption: string;

  constructor(public dialog: MdDialog) { }

  ngOnInit() {
  }
  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

  openDialog() {
    this.dialog.open(DialogOverviewExampleDialog);
  }

}
@Component({
  selector: 'dialog-result-example-dialog',
  templateUrl: './dialog-user-settings.html',
})
export class DialogOverviewExampleDialog {
}
