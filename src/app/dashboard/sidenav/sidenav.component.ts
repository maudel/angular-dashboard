import { Component, OnInit, EventEmitter, Output } from '@angular/core';
const SMALL_WIDTH_BREAKPOINT = 840;

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  sideElems = [];

  constructor() { }

  ngOnInit() {
    this.sideElems = [
      {
        id: 'config',
        name: 'CN',
        summary: 'See Configuration pages ',
        items: [
          {id: 'configuration/hardware', name: 'Germany', examples: ['autocomplete-overview']},
          {id: 'configuration/software', name: 'RegionA', examples: ['checkbox-configurable']},
          {id: 'configuration/system', name: 'RegionB', examples: ['input-form']},
          {id: 'configuration/admin', name: 'RegionC', examples: ['input-form']},
        ]
      },
      {
        id: 'view',
        name: 'Germany',
        summary: 'See views',
        items: [
          {id: 'view/tag-viewer', name: 'Ulm', examples: ['menu-icons']},
          {id: 'view/report-viewer', name: 'Test City', examples: ['sidenav-fab']}]
      }
    ];
  }
  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

}
