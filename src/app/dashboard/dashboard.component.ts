import { Component, OnInit, ViewChild,AfterViewInit } from '@angular/core';
import { AiaConfigService } from '../core/services/aia-config.service'
const SMALL_WIDTH_BREAKPOINT = 840;
import { DatatableComponent } from "@swimlane/ngx-datatable";
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
export class DashboardComponent implements OnInit,AfterViewInit {
  rows = [];
  temp = [];
  sideElems = [];
    @ViewChild(DatatableComponent) table: DatatableComponent;
  ngAfterViewInit() {
    this.table.bodyHeight = 400;
  }
  constructor( private $aiaconfigservice: AiaConfigService) {

  }

  ngOnInit() {
    this.fetch((data) => {
      this.rows = data;
      this.temp = [...data];
      console.log(this.temp);

    });
    this.sideElems = [
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

  }
  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }
  getRowClass(row) {
    return {
      'age-is-ten': (row.age % 10) === 0
    };
  }
  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/aiaConfig.json`);

    req.onload = () => {
      cb(JSON.parse(req.response));
    };

    req.send();
  }
  updateFilter(event) {
    const val = event.target.value;

    // filter our data
    const temp = this.temp.filter(function(d) {
      return d.starType.toLowerCase().indexOf(val) !== -1 || !val;
    });

    // update the rows
    this.rows = temp;
    // Whenever the filter changes, always go back to the first page
    this.table.offset = 0;
  }

}
