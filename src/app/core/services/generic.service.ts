import { Injectable } from '@angular/core';
import {Http, Response} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { config } from '../../config';

// export interface IAppOptions {
//   skipLoadingMask?: boolean;
// }
const newUrl = url => `${config.URL}${url}`;
@Injectable()
export class GenericService {

  constructor(private $http: Http) {

  }

  request(request: any): Observable<any> {
    // NOTE: `encode: false` is required to stop the stringify module from
    // encoding both the keys and the values
    // request.search = (<any>stringify)(request.search || {}, { encode: false });
    // console.log(request)
    // const search = nilToEmptyStr(request.search || {});

    // const queryParams = new URLSearchParams();
    request.url = newUrl(request.url);
    // console.log((<any>stringify)(search, { encode: false }));
    // request.search =  nilToEmptyStr(request.search || {})
    // send two parameters so that the `request` object
    // gets merged with the default request options
    return this.$http.request(request.url, request)
    // check `response >= 200 && response < 300`
    //   .map(res => {
    //     if (!res.ok) {
    //       const error: any = new Error(res.statusText);
    //       error.response = res;
    //       throw error;
    //     }
    //     return res;
    //   })
      .map(res => {
        // console.log(request)
        return res; })
      // as json
      .map((res: Response) => res.json())
      // check response panama statusCode
      .map(res => {
        if (!res.success) {
          // const error: any = new PanamaErrorService(res.message);
          // error.response = res;
          // throw error;
        }
        return res;
      });
  }
}
