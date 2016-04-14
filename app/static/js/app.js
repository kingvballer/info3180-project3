// window.onload = function() {
//     var images = document.getElementsByTagName('img');
//     console.log(images);
    
//     for (var i=0; i < images.length; i++) {
//         images[i].onclick = function(elem) {
//             console.log(elem.target.src);
//             image_url = elem.target.src;
//             var xhr = new XMLHttpRequest();
//             xhr.open('POST', '/api/thumbnail/add');
//             xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
//             xhr.send('image_url=' + encodeURIComponent(image_url) + "&item_id=16");
//             return false;
//         }
//     }
// }

var myApp = angular.module('myApp',[]);

myApp.controller('appController', function($scope)
{
    $scope.imgclick = "";
    
    var images = document.getElementsByTagName('img')
    {
        
        
    }
    
}




)