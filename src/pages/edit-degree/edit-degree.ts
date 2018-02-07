import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
              public fb:AngularFireDatabase) {
    
  }

  ngOnDestroy(){
    if(this.coursesSubscription)
      this.coursesSubscription.unsubscribe();
    if(this.degreeSub)
      this.degreeSub.unsubscribe();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditDegreePage');
    this.degree = this.navParams.get('degreeName');

    this.degreeSub = this.fb.object('/Degrees/'+this.degree).valueChanges().subscribe(data=>{
      this.credits = data['credits'];
      this.courses = data['Courses'];
      console.log(this.courses)

      this.coursesSubscription = this.fb.object('/Courses').valueChanges().subscribe(data2=>{      //Subscribe to the Courses object 
        this.allcourses = [];                                                                        //Reset courses
        if(data2){                       //If there is data in the courses object then store it in the global courses list.
          for(let key in data2){
            let d = data2[key];
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
    for(let key in this.allcourses){
      if(this.allcourses[key]['Chosen'])
        c[this.allcourses[key]['courseID']] = true;
    }

    let obj = {
      credits: this.credits,                                        //Create an object with the data returned.
      Courses: c
    }
    this.fb.database.ref('/Degrees/').child(this.degree).set(obj);      //Add the new degree to the database.
  }
}
