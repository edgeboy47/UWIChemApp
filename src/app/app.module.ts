import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {File} from '@ionic-native/file';
import {FileChooser} from '@ionic-native/file-chooser';
import {FilePath} from '@ionic-native/file-path';

//Import AngularFire related modules
import {AngularFireAuthModule} from 'angularfire2/auth';          //Module for authentication
import {AngularFireModule} from 'angularfire2';                   //General angularfire module
import {AngularFireDatabaseModule} from 'angularfire2/database';  //Module for accessing the database

import {NgCalendarModule} from 'ionic2-calendar';                 //Module for calendar.
import { FCM } from '@ionic-native/fcm';                                              //Firebase Cloud messaging provider used to facilitate notifications
import { LocalNotifications } from '@ionic-native/local-notifications';               //Local Notifications provider to allow scheduling of notifications for users.
import { ToastService } from '../providers/toast-service/toast-service';  
import { PlatformCheckProvider } from '../providers/platform-check/platform-check';
import { DatabaseProvider } from '../providers/database/database';
import { AuthProvider } from '../providers/auth/auth';   //PlatformCheck provider imported to check the current platform that the user is on.

export const fbConfig = {
  apiKey: "AIzaSyDjGvGArBLdrMu2-KPKuUBtonz4QnNw-xM",
  authDomain: "chemappuwi.firebaseapp.com",
  databaseURL: "https://chemappuwi.firebaseio.com",                 //Firebase config object
  projectId: "chemappuwi",
  storageBucket: "gs://chemappuwi.appspot.com/",
  messagingSenderId: "977963203864"
};

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    NgCalendarModule,
    BrowserModule,                                              //Various modules imported
    IonicModule.forRoot(MyApp),                                 //MyApp class set as root of app
    AngularFireModule.initializeApp(fbConfig),                  //Firebase module initialized with config object specified
    AngularFireDatabaseModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ToastService,
    FCM,
    LocalNotifications,
    PlatformCheckProvider,
    DatabaseProvider,
    AuthProvider,
    File,
    FileChooser,
    FilePath
  ]
})
export class AppModule {}
