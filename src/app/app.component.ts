import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { ToastService } from '../providers/toast-service/toast-service';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:string = "DepartmentsPage";

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen, private fcm : FCM, private toast: ToastService) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.fcm.onNotification().subscribe( data => {
        this.toast.show(String(data.message))
      })
    });
  }
}
