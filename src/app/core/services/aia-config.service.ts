import { Injectable } from '@angular/core';
import { GenericService } from './generic.service'
import { Headers, RequestMethod, URLSearchParams } from '@angular/http';
// import { stringify } from 'query-string';
import {Aiaconfig} from  '../models/aiaconfig';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/toPromise';
import { Http} from '@angular/http';
@Injectable()
export class AiaConfigService {
  constructor(
    private $genericservice: GenericService, private $http: Http
  ) { }

  getReadersData(): Promise<any> {
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
      .toPromise();
  }
}
