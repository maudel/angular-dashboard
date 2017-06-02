import { Component, OnInit, EventEmitter, Output } from '@angular/core';
const SMALL_WIDTH_BREAKPOINT = 840;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  sideElems = [];
  activeLinkIndex = 0;
  activeTabIndex = 0;
  addTabPosition = 0;
  tabLinks = [
    {label: 'Attendants', link: 'configuration/attendants'},
    {label: 'Zones', link: 'configuration/zones'},

  ];
  constructor() { }
  ngOnInit() {
  }
  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

}
