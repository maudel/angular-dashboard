import { Component, OnInit, ViewChild } from '@angular/core';
import { AiaConfigService } from '../core/services/aia-config.service'
const SMALL_WIDTH_BREAKPOINT = 840;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  constructor( private $aiaconfigservice: AiaConfigService) {

  }
  rows = [
    { name: 'Austin', gender: 'Male', company: 'Swimlane' },
    { name: 'Dany', gender: 'Male', company: 'KFC' },
    { name: 'Molly', gender: 'Female', company: 'Burger King' },
  ];
  columns = [
    { prop: 'name' },
    { name: 'Gender' },
    { name: 'Company' }
  ];
  rows1 = [];

  ngOnInit() {
    this.$aiaconfigservice.getInfoNew().then
    (dealers => {
        this.rows1 = dealers.scopedDealers;
        console.log(this.rows1);
      }
    );
  }
  isScreenSmall(): boolean {
    return window.matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`).matches;
  }
  getRowClass(row) {
    return {
      'age-is-ten': (row.age % 10) === 0
    };
  }
}
