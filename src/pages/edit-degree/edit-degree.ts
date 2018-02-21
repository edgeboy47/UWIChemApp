import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

/**
 * Generated class for the EditDegreePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit-degree',
  templateUrl: 'edit-degree.html',
})
export class EditDegreePage implements OnDestroy{
  degree:string = "";
  credits;
  degreeSub;
  coursesSubscription;
  courses = [];
  allcourses = [];

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public fb:AngularFireDatabase,
              public toasty:ToastController) {
    
  }

  ngOnDestroy(){
    if(this.coursesSubscription)
      this.coursesSubscription.unsubscribe();
    if(this.degreeSub)
      this.degreeSub.unsubscribe();
  }

  ionViewDidLoad() {
    this.degree = this.navParams.get('degreeName');

    this.degreeSub = this.fb.object('/Degrees/'+this.degree).valueChanges().subscribe(degree=>{
      this.credits = degree['credits'];
      this.courses = degree['Courses'];

      this.coursesSubscription = this.fb.object('/Courses').valueChanges().subscribe(courses=>{      //Subscribe to the Courses object 
        this.allcourses = [];                                                                        //Reset courses
        if(courses){                       //If there is data in the courses object then store it in the global courses list.
          for(let key in courses){
            let d = courses[key];
            d['courseID'] = key;    //Insert courseID in the object stored for ease of use.
            if(this.courses)
              d['Chosen'] = this.courses[key];           
            this.allcourses.push(d);
          }
        }
      });
    });
  }

  save(){
    let c = {};
    for(let degree of this.allcourses){
      if(degree['Chosen']){
        c[degree['courseID']] = true;
        this.fb.database.ref('/Courses/'+degree['courseID']+'/Degrees').child(this.degree).set(true);
      }else{
        this.fb.object('/Courses/'+degree['courseID']+'/Degrees/'+this.degree).remove();      
      }
    }

    let obj = {
      credits: this.credits,                                        //Create an object with the data returned.
      Courses: c
    }
    this.fb.database.ref('/Degrees/').child(this.degree).set(obj);      //Add the new degree to the database.

    let toast = this.toasty.create({
      message: "Degree Saved",
      duration: 1000,
      showCloseButton: true,
      position: 'bottom'
    });

    //Display notification:
    toast.present();
  }
}
