webpackJsonp([2],{

/***/ 465:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UsertabsPageModule", function() { return UsertabsPageModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(31);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__usertabs__ = __webpack_require__(594);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};



var UsertabsPageModule = (function () {
    function UsertabsPageModule() {
    }
    UsertabsPageModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_2__usertabs__["a" /* UsertabsPage */],
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["e" /* IonicPageModule */].forChild(__WEBPACK_IMPORTED_MODULE_2__usertabs__["a" /* UsertabsPage */]),
            ],
        })
    ], UsertabsPageModule);
    return UsertabsPageModule;
}());

//# sourceMappingURL=usertabs.module.js.map

/***/ }),

/***/ 594:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return UsertabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(31);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


/**
 * Generated class for the UsertabsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var UsertabsPage = (function () {
    function UsertabsPage(navCtrl, navParams) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.UserCoursesPage = "UserCoursesPage";
        this.AllCoursesPage = "AllCoursesPage";
        this.NoticesPage = "NoticesPage";
    }
    UsertabsPage.prototype.ionViewDidLoad = function () {
        console.log('ionViewDidLoad UsertabsPage');
    };
    UsertabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-usertabs',template:/*ion-inline-start:"/home/gideon/Desktop/UWIChemApp/src/pages/usertabs/usertabs.html"*/'<ion-tabs>\n  <ion-tab [root]="UserCoursesPage" tabTitle="My Courses" tabIcon="albums"></ion-tab>\n  <ion-tab [root]="AllCoursesPage" tabTitle="All Courses" tabIcon="archive"></ion-tab>\n  <ion-tab [root]="NoticesPage" tabTitle="Notices" tabIcon="notifications"></ion-tab>\n</ion-tabs>\n'/*ion-inline-end:"/home/gideon/Desktop/UWIChemApp/src/pages/usertabs/usertabs.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavParams */]])
    ], UsertabsPage);
    return UsertabsPage;
}());

//# sourceMappingURL=usertabs.js.map

/***/ })

});
//# sourceMappingURL=2.js.map