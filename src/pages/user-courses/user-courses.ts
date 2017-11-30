import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';
import { ToastController } from 'ionic-angular';

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
  constructor(private fbAuth: AngularFireAuth, 
              public navCtrl: NavController, 
              public navParams: NavParams, 
              public db: AngularFireDatabase,
              public toasty: ToastController) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserCoursesPage');
    this.fbAuth.authState.subscribe(data=>{
      this.db.object('/UserCourses/'+data.uid).valueChanges().subscribe(data=>{
        this.courses = [];
        for(let key in data){
          let course = {courseID:key,Name:data[key]};
          this.courses.push(course);
        }
      });
    });
  }

  navigateToCalendar(courseID:string){
    this.navCtrl.push('CalendarPage',{courseID});
  }

  removeCourse(courseID:string){
    this.fbAuth.authState.subscribe(data=>{
      this.db.object('/UserCourses/'+data.uid+'/'+courseID+'/').remove()
    });

    let toast = this.toasty.create({
      message: "Removed "+courseID,
      duration: 1000,
      position: 'middle'
    });
  
    toast.present();
  }
}
