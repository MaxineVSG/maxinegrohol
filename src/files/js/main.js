/**
 * Main application
 */



//  var max = angular.module('max', [
//    'max.controllers'
//  ]);

//  var maxControllers = angular.module('max.controllers', []);



// maxControllers.controller('MainCtrl', ['scope', '$location',
//   function($scope, $location) {
//     console.log('Loaded Main controller');
//   }]);


// maxControllers.controller('AlbumCtrl', ['scope', '$location',
//   function($scope, $location) {
//     console.log('Album controller loaded');

//     showAlbum = false;

//     $scope.loadAlbum = function(a) {
//       console.log('Loading album', a);
//     };
//   }]);

// Cache for downloaded albums (url => data) TODO
var album_cache = {};

function fetch_album(a, $http, cb) {
    // Check for cache first TODO
    
    // Load an album
    $http.get(a).
        success(function(data) {
            console.log('got album:', data);

            cb(data.title, data.images);
        }).
        error(function(err) {
            console.log('error getting songs.json');
        });
}


function AlbumCtrl($scope, $http, $timeout) {
    console.log('Album ctrl loaded');
    // $scope.showingAlbum = false;
    // $scope.albumLoaded = false;
    // $scope.albumName = '';
    // $scope.albumImgs = [];
    // $scope.currentImg = '';
    // $scope.currentCaption = '';
    // $scope.showControls = true;
    // var mvmtTimer = null;
    // var mouvement_timeout = 5000;  // 5 second movement timer

    // Keep track of the currently displayed image index
    // var index = 0;

    /////////////////////////////////////////////////////////////
    // Scope functions
    
    $scope.loadAlbum = function(a) {
        // Load a new album and show modal etc
        console.log('Loading album', a);
        // $scope.showingAlbum = true;

        fetch_album(a, $http, function(title, imgs) {
            // $scope.albumName = title;
            // $scope.albumLoaded = true;
            // TODO albumCaption?

            var galleria_data = [];

            for (var i in imgs) {
                // $scope.albumImgs.push({ path: a+i, caption: imgs[i] });
                galleria_data.push({ image: a+i, description: imgs[i] });
            }
            // $scope.currentImg = $scope.albumImgs[0];

            window.location.hash = 'album-modal';

            // Change Galleria data
            var bla = window.Galleria.get(0);
            bla.load(galleria_data);
            console.log('Done setting up gallery source', galleria_data);

            // Set a timer for detecting mouse movement
            // mvmtTimer = $timeout(function() {
            //   $scope.showControls = false;
            // }, mouvement_timeout);
        });
    };

    // $scope.closeAlbum = function() {
    //     // close the modal
    //     console.log('Closing album');
    //     $scope.showingAlbum = false;
    //     $scope.albumLoaded = false;
    //     // $scope.albumImgs = [];
    // };

    // $scope.mouseMoved = function() {
    //   // Reset the timer
    //   $scope.showControls = true;
    //   $timeout.cancel(mvmtTimer);

    //   // mvmtTimer = $timeout(function() {
    //   //   $scope.showControls = false;
    //   // }, mouvement_timeout);
    // };

    // $scope.showImg = function(i) {
    //   // load a pic into the big area
    //   $scope.currentImg = i;
    //   index = $scope.albumImgs.indexOf(i);
    // };

    // $scope.nextPic = function() {
    //   if (index < $scope.albumImgs.length-1) {
    //     index += 1;
    //     $scope.currentImg = $scope.albumImgs[index];
    //   }
    // };

    // $scope.prevPic = function() {
    //   if (index > 0) {
    //     index -= 1;
    //     $scope.currentImg = $scope.albumImgs[index];
    //   }
    // };

    var initG = function() {
        console.log('Initialising Galleria');
        
        // Load Galleria theme
        window.Galleria.loadTheme("/js/vendor/galleria/src/themes/classic/galleria.classic.js")

        window.Galleria.ready(function (options) {
            console.log('Galleria ready');
            $scope.gallery = this;
        });
        
        // Bootstrap galleria
        // TODO: option debug: false
        window.Galleria.run('.galleria', {
            // wait: true,
            // transition: 'fade',
            dataSource: [],
            height: 0.5625
        });        
    };

    initG();
}




/*
Needs to:
 set width of images ul to max width of current image

 footer > ul
   overflow-y: hidden;
   height: 100px;
   white-space: nowrap;
   overflow-x: scroll;
   width: 790px;
   margin: 0;

 Adapt resize script for this. Also, need no float

 modal-content-list > li
   float: none
   display: inline-block

 OR, re-style the thumbnails to be position absolute... somehow?

for ul:
 position: absolute;
 display: block;
 white-space: nowrap;
 overflow-x: scroll;
 overflow-y: hidden;
 right: 5px;
 left: 5px;
 top: -10px;
 margin: 0;


and for footer:
 height: 100px;
 position: relative;
 padding: 0;
 border-radius: 0;
 */
