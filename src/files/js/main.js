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

function fetch_album(a, $http, cb) {
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
  $scope.showingAlbum = false;
  $scope.albumLoaded = false;
  $scope.albumName = '';
  $scope.albumImgs = [];
  $scope.currentImg = '';
  $scope.currentCaption = '';
  $scope.showControls = true;
  var mvmtTimer = null;
  var mouvement_timeout = 5000;  // 5 second movement timer

  // Keep track of the currently displayed image index
  var index = 0;

  $scope.loadAlbum = function(a) {
    // Load a new album and show modal etc
    console.log('Loading album', a);
    $scope.showingAlbum = true;

    fetch_album(a, $http, function(title, imgs) {
      $scope.albumName = title;
      $scope.albumLoaded = true;
      // TODO albumCaption?

      for (var i in imgs) {
        $scope.albumImgs.push({ path: a+i, caption: imgs[i] });
      }
      $scope.currentImg = $scope.albumImgs[0];

      // Set a timer for detecting mouse movement
      // mvmtTimer = $timeout(function() {
      //   $scope.showControls = false;
      // }, mouvement_timeout);
    });
  };

  $scope.closeAlbum = function() {
    // close the modal
    console.log('Closing album');
    $scope.showingAlbum = false;
    $scope.albumLoaded = false;
    $scope.albumImgs = [];
  };

  $scope.mouseMoved = function() {
    // Reset the timer
    $scope.showControls = true;
    $timeout.cancel(mvmtTimer);

    // mvmtTimer = $timeout(function() {
    //   $scope.showControls = false;
    // }, mouvement_timeout);
  };

  $scope.showImg = function(i) {
    // load a pic into the big area
    $scope.currentImg = i;
    index = $scope.albumImgs.indexOf(i);
  };

  $scope.nextPic = function() {
    if (index < $scope.albumImgs.length-1) {
      index += 1;
      $scope.currentImg = $scope.albumImgs[index];
    }
  };

  $scope.prevPic = function() {
    if (index > 0) {
      index -= 1;
      $scope.currentImg = $scope.albumImgs[index];
    }
  };
}