import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { PlatformCheckProvider } from '../providers/platform-check/platform-check';
import { AngularFireAuth } from 'angularfire2/auth';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:string = "";

  constructor(platform: Platform, 
              statusBar: StatusBar, 
              splashScreen: SplashScreen, 
              private fcm : FCM, 
              private localNotifications: LocalNotifications,
              private pltCheck: PlatformCheckProvider,
              public fbAuth:AngularFireAuth) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
      this.acceptNotification()
    });

    this.fbAuth.authState.subscribe(data=>{
      if(data){
        this.rootPage="UsertabsPage";
      }else{
        this.rootPage="DepartmentsPage"
      }
    })
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
