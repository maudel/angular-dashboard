import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AiaConfigService } from '../core/services/aia-config.service';
const SMALL_WIDTH_BREAKPOINT = 840;
const MENU = [
  {
    id: 'config',
    name: 'Configuration',
    summary: 'See Configuration pages ',
    items: [
      {id: 'hardware', name: 'Hardware', examples: ['autocomplete-overview']},
      {id: 'software', name: 'Software', examples: ['checkbox-configurable']},
      {id: 'system', name: 'System', examples: ['input-form']}
    ]
  },
  {
    id: 'view',
    name: 'View',
    summary: 'See views',
    items: [
      {id: 'tagViewer', name: 'Tag Viewer', examples: ['menu-icons']},
      {id: 'reportViewer', name: 'Report Viewer', examples: ['sidenav-fab']}]
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
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  settings = {
    columns: {
      id: {
        title: 'ID'
      },
      name: {
        title: 'Full Name'
      },
      username: {
        title: 'User Name'
      },
      email: {
        title: 'Email'
      }
    }
  };
  data = [
    {
      id: 1,
      name: "Leanne Graham",
      username: "Bret",
      email: "Sincere@april.biz"
    },
    {
      id: 2,
      name: "Ervin Howell",
      username: "Antonette",
      email: "Shanna@melissa.tv"
    },

    // ... list of items

    {
      id: 11,
      name: "Nicholas DuBuque",
      username: "Nicholas.Stanton",
      email: "Rey.Padberg@rosamond.biz"
    }
  ];
  constructor( private $aiaconfigservice: AiaConfigService) {
  }

  ngOnInit() {

  }
  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }

}
