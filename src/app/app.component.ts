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
      statusBar.styleDefault();
      splashScreen.hide();
      this.acceptNotification()
    });

    // If the user is signed in, navigate to the Usertabs page, else navigate to the departments page
    this.fbAuth.authState.subscribe(data=>{
      if(data){
        this.rootPage="UsertabsPage";
      }else{
        this.rootPage="DepartmentsPage"
      }
    })
  }

  // Function to handle firebase notifications while the app is running
  async acceptNotification() {
    try{
      // If the user agent is not a desktop browser
      if(!this.pltCheck.contains('core')) {
        // Allow the user to give permission to display notifications
        await this.localNotifications.registerPermission()
        // Whenever a notification from firebase is received
        this.fcm.onNotification().subscribe( data => {
          // Create a local notification that displays the firebase notification's data
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
