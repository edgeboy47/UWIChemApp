import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, ModalController,  NavParams, AlertController } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';


@IonicPage()
@Component({
  selector: 'page-all-courses',
  templateUrl: 'all-courses.html',
})
export class AllCoursesPage implements OnDestroy{
  coursesSubscription;
  userSub;
  typeSub;
  courses:any = [];
  dCourses=[];
  showButtons = false;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public db: AngularFireDatabase,
              public auth: AngularFireAuth,
              public modalCtrl: ModalController,
              public alertCtrl: AlertController) {
    
  }

  ngOnDestroy(){
    if(this.coursesSubscription)
      this.coursesSubscription.unsubscribe();
    if(this.typeSub)
      this.typeSub.unsubscribe();
    if(this.userSub)
      this.userSub.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AllCoursesPage');
    this.coursesSubscription = this.db.object('/Courses').valueChanges().subscribe(data=>{
      this.courses = [];
      if(data){
        for(let key in data){
          let d = data[key];
          d['courseID'] = key+" ";
          this.courses.push(d);
        }
        this.dCourses = this.courses;
      }
    });


    this.userSub = this.auth.authState.subscribe(data=>{
      this.typeSub = this.db.object('/Users/'+data.uid+'/type/').valueChanges().subscribe(d2=>{
        if(d2=='Admin'){
          this.showButtons = true;
        }
      });
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
        return ((item['Name'].toLowerCase().indexOf(val.toLowerCase()) > -1)||
                (item['courseID'].toLowerCase().indexOf(val.toLowerCase()) > -1));
      })
    }
  }

  addCourse(){
    let modal = this.modalCtrl.create('AddCourseModalPage');
    modal.present();
    modal.onDidDismiss(data=>{
      if(data){
        let obj = {
          Available: data.Available,
          Name: data.Name,
          Credits: data.Credits,
          Outline: data.Outline,
        }

        this.db.database.ref('/Courses/').child(data.courseID).set(obj);

        let newCourses = this.courses;
        data.courseID = data.courseID+" ";
        newCourses.push(data);
        
        this.courses = [];
        setTimeout(()=>{
          this.courses = newCourses;
        });
      }
    });
  }

  removeCourse(courseID:string){
    courseID = courseID.replace(/^\s+|\s+$/g, "");

    let alert = this.alertCtrl.create({
      title: 'Are You Sure?',
      subTitle: 'This cannot be undone',
      message: 'This cannot be undone',
      buttons: [
        {
          text: 'Cancel',
        },
        {
          text: 'Remove',
          handler: ()=>{
            this.db.object('/Courses/'+courseID).remove();
            this.db.object('/Events/'+courseID).remove();
          }
        }
      ]
    });
    alert.present();
  }
}
