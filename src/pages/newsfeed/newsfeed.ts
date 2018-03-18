import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController } from 'ionic-angular';
import {AngularFireDatabase} from 'angularfire2/database';
import { AngularFireAuth } from 'angularfire2/auth';        //Import AngularFireAuth Modular for authentication.
import * as moment from 'moment';

import {File} from '@ionic-native/file';
import {FileChooser} from '@ionic-native/file-chooser';
import {FilePath} from '@ionic-native/file-path';

import * as firebase2 from 'firebase';


/**
 * Generated class for the NewsfeedPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-newsfeed',
  templateUrl: 'newsfeed.html',
})
export class NewsfeedPage {
  news=[];
  newsSub;

  showButtons = false;                              //Boolean indicating whether certain buttons should be shown based on user type.
  userSub;
  typeSub;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public db: AngularFireDatabase,
              public modalCtrl: ModalController,
              public auth: AngularFireAuth,        //Various constructor declarations
              public fileChooser:FileChooser,
              public file:File,
              public filePath:FilePath,
            ) {
  }

  ionViewDidLoad() {
    this.userSub = this.auth.authState.subscribe(data=>{
      if(data){
        this.typeSub = this.db.object('/Users/'+data.uid+'/type/').valueChanges().subscribe(d2=>{
          if(d2=='Admin'){
            this.showButtons = true;              //Get the user type and set the showButtons variable according to the type of user. Admin users are allowed to add courses.
          }
        });
      }
    });
    this.newsSub = this.db.object('/News/').valueChanges().subscribe(data=>{
      if (data){
        this.news=[];
        for(let key in data){
          let d = data[key];
          d['id'] = key;
          d['displayDate'] = moment(new Date(d['date'])).format('DD/MM/YY');
          console.log(d['id']);
          this.news.push(d); 
        }
      }
    });
  }

  addNews(){
    let modal = this.modalCtrl.create('AddNewsModalPage',{});     //Create modal for user to enter relevant info
    modal.present();                                                                        //Present that modal
    let cost = "";
    modal.onDidDismiss(data=>{
      if(data){

        if(!data.cost || data.cost==="")
          cost = "free";
        else 
          cost = data.cost;

        let obj = {
          title:data.title,
          description:data.description,
          cost:cost,
          type:data.type,
          location:data.location,
          date:data.date,
        }

        this.db.database.ref('/News/').push(obj);
        
      }
    });
  }

  removeNews(news_Event){
    this.news.splice(this.news.indexOf(news_Event),1);
    this.db.object('/News/'+news_Event.id).remove(); // only using title until id gets sorted out.

  }// end removeNews()

  navigateToDetails(id:string){                 //Simply navigate to CourseDetails page with the course id passed as an argument
    this.navCtrl.push('NewsDetailsPage',{id});
  }

  addImage(id:string){
    this.fileChooser.open().then(uri=>{
      //this.file.resolveLocalFilesystemUrl(uri).then(newUrl=>{

      this.filePath.resolveNativePath(uri).then(newUrl=>{
        //let dirPath = newUrl.nativeURL;
        let dirPath = newUrl;
        let segs = dirPath.split('/');
        let name = segs.pop();
        dirPath = segs.join('/');

        this.file.readAsArrayBuffer(dirPath,name).then(async (buffer)=>{
          await this.upload(id,buffer,name);
        }).catch(error=>{
          alert(JSON.stringify(error)+"madness");
        });


      }).catch(error=>{
        alert(JSON.stringify(error)+"hellicopter");
      })
    }).catch(error=>{
      alert(JSON.stringify(error)+"herp");
    })
  }

  async upload(id,buffer,name){
    let blob = new Blob([buffer],{type: "image/jpeg" });   

    let storage = firebase2.storage();   
    
    storage.ref('NewsImages/'+id).put(blob).then(d=>{
      storage.ref('NewsImages/'+id).getDownloadURL().then(url=>{
        this.db.database.ref('/News/'+id).child("image").set(url);
      })
      alert("Done");
    }).catch(error=>{
      alert(JSON.stringify(error)+"derp");
    })
  }
}
