import { Component, OnDestroy } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController } from 'ionic-angular';
import * as moment from 'moment';

import {File} from '@ionic-native/file';
import {FileChooser} from '@ionic-native/file-chooser';
import {FilePath} from '@ionic-native/file-path';

import * as firebase2 from 'firebase';


import { ImageResizer, ImageResizerOptions } from '@ionic-native/image-resizer';

import {ToastService} from '../../providers/toast-service/toast-service';
import {DatabaseProvider} from '../../providers/database/database';

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
export class NewsfeedPage implements OnDestroy{
  upcomingNews=[];
  pastNews = [];
  newsSub;


  showButtons = false;                              //Boolean indicating whether certain buttons should be shown based on user type.
  typeSub;

  newsType = 'upcoming';

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public modalCtrl: ModalController,        //Various constructor declarations
              public fileChooser:FileChooser,
              public file:File,
              public filePath:FilePath,
              public loadingCtrl:LoadingController,
              public imageResizer: ImageResizer,
              public toasty: ToastService,
              public dbProv: DatabaseProvider
            ) {
  }

  ngOnDestroy(){
    if(this.newsSub)
      this.newsSub.unsubscribe();
    if(this.typeSub)
      this.typeSub.unsubscribe();
  }

  ionViewDidLoad() {
    
    this.typeSub = this.dbProv.getUserType().subscribe(d2=>{
      if(d2=='Admin'){
        this.showButtons = true;              //Get the user type and set the showButtons variable according to the type of user. Admin users are allowed to add courses.
      }
    });

    this.newsSub = this.dbProv.readObject('/News/').subscribe(data=>{
      if (data){
        this.upcomingNews=[];
        this.pastNews = [];

        for(let key in data){
          let d = data[key];
          d['id'] = key;

          let tempDate = new Date(d['date'])
          d['displayDate'] = moment(tempDate).format('DD/MM/YY');

          if(tempDate>=new Date())
            this.upcomingNews.push(d); 
          else
            this.pastNews.push(d);
        }

        this.pastNews.sort(function(a, b) {
          a = new Date(a.date);
          b = new Date(b.date);
          return a>b ? -1 : a<b ? 1 : 0;
        });

        this.upcomingNews.sort(function(a, b) {
          a = new Date(a.date);
          b = new Date(b.date);
          return a<b ? -1 : a>b ? 1 : 0;
        });
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
          image:"https://firebasestorage.googleapis.com/v0/b/chemappuwi.appspot.com/o/NewsImages%2Fdo_not_remove.jpg?alt=media&token=e93d929a-21e3-40c3-909e-aaea84c0b267",
        }

        this.dbProv.push('/News/',obj);
        
      }
    });
  }

  removeNews(news_Event){
    this.dbProv.removeObject('/News/'+news_Event.id);
    firebase2.storage().ref('NewsImages/'+news_Event.id).delete();
    this.toasty.show("Item Removed",1000);
  }// end removeNews()

  navigateToDetails(id:string){                 //Simply navigate to CourseDetails page with the course id passed as an argument
    this.navCtrl.push('NewsDetailsPage',{id});
  }

  addImage(id:string){
    this.fileChooser.open().then(uri=>{
      this.filePath.resolveNativePath(uri).then(newUrl=>{
        let options = {
          uri: newUrl,
          folderName: "Temp",
          quality: 85,
          width: 1280,
          height: 800,
        } as ImageResizerOptions;

        this.imageResizer.resize(options).then(async resizedURI=>{
          let dirPath = resizedURI;
          let segs = dirPath.split('/');
          let name = segs.pop();
          dirPath = segs.join('/');
          
          this.file.readAsArrayBuffer(dirPath,name).then(async buffer=>{
            await this.upload(id,buffer,name);
          }).catch(error=>{
            alert(JSON.stringify(error)+"sadness");
          })
          
        }).catch(
          e=>alert(JSON.stringify(e)+"dasheen")
        )
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

    let loading = this.loadingCtrl.create({
      content: 'Uploading...'
    });
  
    loading.present();
    
    storage.ref('NewsImages/'+id).put(blob).then(d=>{
      storage.ref('NewsImages/'+id).getDownloadURL().then(url=>{
       // this.db.database.ref('/News/'+id).child("image").set(url);
        this.dbProv.updateObject('/News/'+id,{"image":url})
      })
      loading.dismiss();
      this.toasty.show("Image Uploaded",1000);
    }).catch(error=>{
      loading.dismiss();            
      alert(JSON.stringify(error)+"derp");
    })
  }
}
