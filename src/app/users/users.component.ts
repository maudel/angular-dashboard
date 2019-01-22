import {Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort} from "@angular/material";
import {UsersDataSource} from "./users-datasource";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  dataSource: UsersDataSource;

  /** Columns displayed in the table. Columns IDs can be added, removed, or reordered. */
  displayedColumns = ['actions', 'name', 'creationDate','active'];

  ngOnInit() {
    this.dataSource = new UsersDataSource(this.paginator, this.sort);
  }
}
