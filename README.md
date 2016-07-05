# LegoForm

[![Build Status](https://travis-ci.org/mafengwo/LegoForm.svg?branch=master)](https://travis-ci.org/mafengwo/LegoForm)

Legoform is a simple tool that makes it easy to build form in angular apps. 
It designed to reduce the work of writing duplicated form elements in HTML and duplicated validation logic in controllers.
Instead of writing duplicated elements in HTML, LegoForm uses a JSON-based Lego configuration as a form definition.
##Usage:   
**HTML:**

```html
<!-- Dependencies for LegoForm -->
<link rel="stylesheet" href="bootstrap.css">
<script src="angular.min.js"></script>
  
<!-- LegoForm -->
<script src="LegoForm-0.0.1.js"></script>
  
...
  
<!-- Use LegoForm -->
<lego-form lego-def="config.legoDef" ng-model="passenger"></lego-form>
```

**Javascript:**
```javascript
angular.module('app', ['LegoForm'])
    .controller('PassengerController', ['$scope', '$http', function ($scope, $http) {

        $scope.config = {};
        
        $scope.passenger = {};
  
        /**
        * Fetch Lego configuration
        */
        $http.get('/api/legoDef').success(function (res) {
            $scope.config.legoDef = res;
        });
  
        /**
        * Sumbit event triggered.
        */
        $scope.$on('lf.event.submit', function (event, data) {
            // Your submit logic goes here.
        });

    }]);
```

