import { Injectable } from '@angular/core';
import { GenericService } from './generic.service'
import { Headers, RequestMethod, URLSearchParams } from '@angular/http';
import { Aiaconfig } from '../models/aiaconfig';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/map';
@Injectable()
export class AiaConfigService {
  constructor(
    private $genericservice: GenericService
  ) { }

  getReadersData(): Promise<Aiaconfig[]> {
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
      .toPromise().then(response => response as Aiaconfig[]);
  }

}
