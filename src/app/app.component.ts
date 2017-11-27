import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:string = "DepartmentsPage";

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private fcm : FCM, private localNotifications: LocalNotifications) {
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
      await this.localNotifications.registerPermission()
      this.fcm.onNotification().subscribe( data => {
        this.localNotifications.schedule({
          title: data.title,
          text: data.message,
        })
      })
    }
    catch(err) {
      console.error(err)
    } 
  }
}
