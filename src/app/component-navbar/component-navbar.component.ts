import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-component-navbar',
  templateUrl: './component-navbar.component.html',
  styleUrls: ['./component-navbar.component.scss']
})
export class ComponentNavbarComponent implements OnInit {
  tabElems = [];
  constructor() { }

  ngOnInit() {
    this.tabElems = [
      {
        id: 'hardware',
        name: 'hardware',
        summary: 'See hardware tabs ',
        items: [
          {id: 'readers', name: 'Readers', summary: 'here you can config your readers'},
          {id: 'zones ', name: 'Zones', summary: 'here you can config your zones'},
          {id: 'antennas ', name: 'Antennas', summary: 'here you can config your zones'},
          {id: 'inventoryWizard ', name: 'Inventory Wizard', summary: 'here you can config your zones'},
        ]
      },
      {
        id: 'view',
        name: 'View',
        summary: 'See views',
        items: [
          {id: 'tagViewer', name: 'Tag Viewer', summary: 'here you can config your readers'},
          {id: 'reportViewer', name: 'Report Viewer', summary: 'here you can config your reports'}]
      },
      {
        id: 'status',
        name: 'Status',
        summary: 'See Status',
        items: [
          {id: 'statusList', name: 'ALE Report Statistics', examples: ['list-sections']},
        ]
      },
      {
        id: 'saveRestore',
        name: 'Save/Restore',
        summary: 'Buttons, button toggles, icons, progress spinners, progress bars',
        items: [
          {id: 'button', name: 'Button', examples: ['button-types']},
        ]
      },
      {
        id: 'starStop',
        name: 'Start',
        summary: 'Dialogs, tooltips, snackbars',
        items: [
          {id: 'check', name: 'Check', examples: ['dialog-result']},
          {id: 'startStopHandler', name: 'Stop', examples: ['dialog-result']},
        ]
      },{
        id: 'help',
        name: 'Help',
        summary: 'Dialogs, tooltips, snackbars',
        items: [
          {id: 'about', name: 'Dialog', examples: ['dialog-result']},
          {id: 'starUpgrade', name: 'STAR 3000 Upgrade', examples: ['tooltip-position']},
          {id: 'mconUpgrade', name: 'MCON Upgrade', examples: ['snack-bar-component']},
        ]
      },
    ];

  }

}
