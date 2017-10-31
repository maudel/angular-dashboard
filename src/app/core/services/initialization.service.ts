import { Injectable } from '@angular/core';
import { AiaConfigService } from './aia-config.service';
@Injectable()
export class InitializationService {

  constructor( private $aiaconfigservice: AiaConfigService) {

  }
  private systemLanguageChain() {
    return this.$aiaconfigservice.getSupportedLanguages().then(data => {

        return data;
      });
  }

  private doLoad(): Promise<any> {
    const languageChain = this.systemLanguageChain();
    return languageChain
  }
    load(): Promise<any> {
    return this.doLoad();
  }
}
