import { Component, OnInit, ViewChild} from '@angular/core';
// import { DatatableComponent } from "@swimlane/ngx-datatable";
import { ZoneService} from '../../core/services/zone.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import {Http} from '@angular/http'
@Component({
  selector: 'app-zones',
  templateUrl: './zones.component.html',
  styleUrls: ['./zones.component.scss']
})
export class ZonesComponent implements OnInit {

  dataSource = [];
  temp = [];
  displayedColumns = ['aiaName', 'aiaDottedIP'];

  sideElems = [];
  constructor(private  $zoneService: ZoneService) {

  }

  ngOnInit() {
  //   this.$zoneService.getZones().then(
  //     response => {
  //       this.dataSource = response;
  //     }
  // ).catch(
  //   );
  }

}


export interface Zones {
  number: string;
  state: string;
  title: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ZonesHttpDatabase {
  // private issuesUrl = 'https://api.github.com/repos/angular/material2/issues';  // URL to web API
  // exampleDatabase: ExampleHttpDatabase | null;
  // dataSource: ExampleDataSource | null;
  // getRepoIssues(): Observable<Zones[]> {
  //   return this.http.get(this.issuesUrl)
  //     .map(this.extractData)
  // }

  extractData(result: Response): Zones[] {
    return result.json().map(issue => {
      return {
        number: issue.number,
        state: issue.state,
        title: issue.title,
      }
    });
  }

  constructor(private http: Http) {}
}
