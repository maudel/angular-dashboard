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
        name: 'Configuration',
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
        name: 'View',
        summary: 'See views',
        items: [
          {id: 'view/tag-viewer', name: 'Tag Viewer', examples: ['menu-icons']},
          {id: 'view/report-viewer', name: 'Report Viewer', examples: ['sidenav-fab']}]
      },
      {
        id: 'status',
        name: 'Status',
        summary: 'See Status',
        items: [
          {id: 'status/reader-statistics', name: 'Reader Statistics ', examples: ['list-sections']},
          {id: 'status/eNodes-component', name: 'eNode Statistics ', examples: ['list-sections']},
          {id: 'status/sensors-statistics', name: 'Sensor Statistics ', examples: ['list-sections']},
          {id: 'status/ale-statistics', name: 'ale Statistics ', examples: ['list-sections']},
        ]
      },
      {
        id: 'saveRestore',
        name: 'Save/Restore',
        summary: 'Buttons, button toggles, icons, progress spinners, progress bars',
        items: [
          {id: 'save-restore', name: 'MCON save/restore', examples: ['button-types']},
        ]
      }, {
        id: 'help',
        name: 'Help',
        summary: 'Dialogs, tooltips, snackbars',
        items: [
          {id: 'help/about', name: 'About', examples: ['dialog-result']},
          {id: 'help/star-3000-upgrade', name: 'STAR 3000 Upgrade', examples: ['tooltip-position']},
          {id: 'help/starflex-upgrade', name: 'StarFlex Upgrade', examples: ['snack-bar-component']},
          {id: 'help/mcon-upgrade', name: 'MCON Upgrade', examples: ['snack-bar-component']},
        ]
      },
    ];
  }
  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

}
