import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';


@IonicPage()
@Component({
  selector: 'page-all-courses',
  templateUrl: 'all-courses.html',
})
export class AllCoursesPage implements OnDestroy{
  coursesSubscription;
  courses:any = [];
  dCourses=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public db: AngularFireDatabase) {
    
  }

  ngOnDestroy(){
    if(this.coursesSubscription)
      this.coursesSubscription.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllCoursesPage');
    this.coursesSubscription = this.db.object('/Courses').valueChanges().subscribe(data=>{
      if(data){
        for(let key in data){
          let d = data[key];
          d['courseID'] = key+" ";
          this.courses.push(d);
        }
        this.dCourses = this.courses;
      }
    });
  }

  navigateToDetails(courseID:string){
    courseID = courseID.replace(/^\s+|\s+$/g, "");
    this.navCtrl.push('CourseDetailsPage',{courseID});
  }

  getItems(ev: any) {
    this.dCourses = this.courses;
    let val = ev.target.value;

    if (val && val.trim() != '') {
      this.dCourses = this.courses.filter((item) => {
        return (item['Name'].toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }
}
