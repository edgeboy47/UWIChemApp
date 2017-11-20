import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';

/**
 * Generated class for the UserCoursesPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-user-courses',
  templateUrl: 'user-courses.html',
})
export class UserCoursesPage {
  courses:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserCoursesPage');
    this.db.object('/Courses').valueChanges().subscribe(data=>{
      for(let key in data){
        let d = data[key];
        d['courseID'] = key;
        this.courses.push(d);
      }
    });
  }

  navigateToCalendar(courseID:string){
    this.navCtrl.push('CalendarPage',{courseID});
  }
}
