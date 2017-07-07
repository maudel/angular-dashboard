import { Injectable } from '@angular/core';
import { Zone } from '../models/zone';
import { RequestMethod} from '@angular/http';
import { GenericService} from './generic.service';
@Injectable()
export class ZoneService {

  constructor(private $genericservice: GenericService) { }
  getZones(): Promise<Zone[]> {
    const url = 'zones';

    const request = {
      method: RequestMethod.Get,
      url: url,
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
    };

    return this.$genericservice.request(request)
      .toPromise().then(response => response as Zone[]);
  }
}
