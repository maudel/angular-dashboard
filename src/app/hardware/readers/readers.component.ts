import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { AiaConfigService } from '../../core/services/aia-config.service';
const SMALL_WIDTH_BREAKPOINT = 840;
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Aiaconfig } from '../../core/models/aiaconfig';

@Component({
  selector: 'app-readers',
  templateUrl: './readers.component.html',
  styleUrls: ['./readers.component.scss']
})
export class ReadersComponent implements OnInit, AfterViewInit{
  rows: Aiaconfig[] ;
  temp = [];
  sideElems = [];
  columns = [
    { name: 'aiaName' },
    { name: 'aiaDottedIP' },
    { name: 'macAddress' },
    { name: 'aiaDottedIP' }
  ];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  ngAfterViewInit() {
    this.table.bodyHeight = 400;
  }
  constructor( private $aiaconfigservice: AiaConfigService) {

  }
  ngOnInit() {
    this.$aiaconfigservice.getReadersData().then(
       response => {
         this.rows = response;
       }
    ).catch(

    );

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
          {id: 'reader-statistics', name: 'Reader Statistics ', examples: ['list-sections']},
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
  toggle(col) {
    const isChecked = this.isChecked(col);

    if(isChecked) {
      this.columns = this.columns.filter(c => {
        return c.name !== col.name;
      });
    } else {
      this.columns = [...this.columns, col];
    }
  }
  isChecked(col) {
    return this.columns.find(c => {
      return c.name === col.name;
    });
  }

}
