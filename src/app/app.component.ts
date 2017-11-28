import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PlatformCheckProvider } from '../providers/platform-check/platform-check';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:string = "DepartmentsPage";

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen, 
              private fcm : FCM, 
              private localNotifications: LocalNotifications,
              private pltCheck: PlatformCheckProvider) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.acceptNotification()
    });
  }

  async acceptNotification() {
    try{
      if(!this.pltCheck.contains('core')) {
        await this.localNotifications.registerPermission()
        this.fcm.onNotification().subscribe( data => {
          this.localNotifications.schedule({
            title: data.title,
            text: data.message,
          })
        })
      }
    }
    catch(err) {
      console.error(err)
    } 
  }
}
