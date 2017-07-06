import { Component, OnInit } from '@angular/core';
import { SaveRestoreService } from '../core/services/save-restore.service';
import { Backup} from './../models/backup'

@Component({
  selector: 'app-save-restore',
  templateUrl: './save-restore.component.html',
  styleUrls: ['./save-restore.component.scss']
})
export class SaveRestoreComponent implements OnInit {
  rows: Backup[] ;
  constructor( private $saveRestoreService: SaveRestoreService) {

  }

  ngOnInit() {
    this.$saveRestoreService.getBackups().then(
      response => {
        this.rows = response;
      }
    ).catch(

    );
  }

}
