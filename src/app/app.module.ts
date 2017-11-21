import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import {AngularFireAuthModule} from 'angularfire2/auth';
import {AngularFireModule} from 'angularfire2';
import {AngularFireDatabaseModule} from 'angularfire2/database';

import {NgCalendarModule} from 'ionic2-calendar';
import { ToastService } from '../providers/toast-service/toast-service';

export const fbConfig = {
  apiKey: "AIzaSyDjGvGArBLdrMu2-KPKuUBtonz4QnNw-xM",
  authDomain: "chemappuwi.firebaseapp.com",
  databaseURL: "https://chemappuwi.firebaseio.com",
  projectId: "chemappuwi",
  storageBucket: "chemappuwi.appspot.com",
  messagingSenderId: "977963203864"
};

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    NgCalendarModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(fbConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ToastService
  ]
})
export class AppModule {}
