import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-all-courses',
  templateUrl: 'all-courses.html',
})
export class AllCoursesPage {

  courses:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase) {
    
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllCoursesPage');
    this.db.object('/Courses').valueChanges().subscribe(data=>{
      for(let key in data){
        let d = data[key];
        d['courseID'] = key;
        this.courses.push(d);
      }
    });
  }

  navigateToDetails(courseID:string){
    this.navCtrl.push('CourseDetailsPage',{courseID});
  }

}
