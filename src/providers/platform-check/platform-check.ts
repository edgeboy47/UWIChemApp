import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular/platform/platform';

/*
  Generated class for the PlatformCheckProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class PlatformCheckProvider {

  constructor(private platform: Platform) {
  }

  // Returns true if the platform is of type plt
  contains(plt) {
    return this.platform._platforms.some(el => el === plt)
  }
}
