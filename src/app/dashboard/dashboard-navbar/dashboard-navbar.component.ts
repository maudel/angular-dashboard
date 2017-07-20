import { Component, OnInit, Output , EventEmitter  } from '@angular/core';
const SMALL_WIDTH_BREAKPOINT = 840;


@Component({
  selector: 'app-dashboard-navbar',
  templateUrl: './dashboard-navbar.component.html',
  styleUrls: ['./dashboard-navbar.component.scss']
})
export class DashboardNavbarComponent implements OnInit {
  @Output() toggleSidenav : EventEmitter<void> = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {
  }
  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

}
