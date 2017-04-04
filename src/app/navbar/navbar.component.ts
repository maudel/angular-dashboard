import { Component, OnInit, Output ,EventEmitter } from '@angular/core';
const SMALL_WIDTH_BREAKPOINT = 840;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  @Output() toggleSidenav = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }
  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

  openDialog(){

  }

}
