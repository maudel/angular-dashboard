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
          {id: 'configuration/hardware', name: 'Hardware', examples: ['autocomplete-overview']},
          {id: 'configuration/software', name: 'Software', examples: ['checkbox-configurable']},
          {id: 'configuration/system', name: 'System', examples: ['input-form']},
          {id: 'configuration/admin', name: 'Admin', examples: ['input-form']},
        ]
      },
      {
        id: 'view',
        name: 'Germany',
        summary: 'See views',
        items: [
          {id: 'view/tag-viewer', name: 'Tag Viewer', examples: ['menu-icons']},
          {id: 'view/report-viewer', name: 'Report Viewer', examples: ['sidenav-fab']}]
      }
    ];
  }
  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

}
