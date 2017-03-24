import { Injectable } from '@angular/core';
import { GenericService } from './generic.service'
import { Headers, RequestMethod, URLSearchParams } from '@angular/http';
// import { stringify } from 'query-string';
import {Aiaconfig} from  '../models/aiaconfig'
@Injectable()
export class AiaConfigService {

  constructor(
    private $genericservice: GenericService,
  ) { }

  getInfoNew(): Promise<any> {
    const url = 'aiaConfig';

    const request = {
      method: RequestMethod.Get,
      url: url,
      headers: new Headers({
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded'
      }),
    };

    return this.$genericservice.request(request)
      .toPromise().then(res => new Aiaconfig(res));
  }
}
