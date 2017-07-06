import { Injectable } from '@angular/core';
import { GenericService } from './generic.service'
import { Backup} from './../models/backup'
import { Headers, RequestMethod, URLSearchParams } from '@angular/http';

@Injectable()
export class SaveRestoreService {

  constructor( private $genericservice: GenericService) { }

  getBackups(): Promise<Backup[]> {
    const url = 'backups';

    const request = {
      method: RequestMethod.Get,
      url: url,
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
    };

    return this.$genericservice.request(request)
      .toPromise().then(response => response as Backup);
  }


}
