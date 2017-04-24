import { Component, OnInit, ViewChild} from '@angular/core';
import { DatatableComponent } from "@swimlane/ngx-datatable";

@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss']
})
export class ZonesComponent implements OnInit {

  rows = [];
  temp = [];
  sideElems = [];
  @ViewChild(DatatableComponent) table: DatatableComponent;
  ngAfterViewInit() {
    this.table.bodyHeight = 400;
  }
  constructor() {

  }
  columns = [
    { name: 'aiaName' },
    { name: 'aiaDottedIP' },
    { name: 'macAddress' },
    { name: 'aiaDottedIP' }
  ];
  allColumns = [
    { name: 'aiaName' },
    { name: 'aiaDottedIP' },
    { name: 'macAddress' },
    { name: 'aiaDottedIP' }
  ];
  ngOnInit() {
    this.fetch((data) => {
      this.rows = data;
      this.temp = [...data];
      console.log(this.temp);

    });


  }
  fetch(cb) {
    const req = new XMLHttpRequest();
    req.open('GET', `assets/zones.json`);

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
