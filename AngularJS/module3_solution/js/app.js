(function () {
'use strict';

angular.module('NarrowItDownApp', [])
.controller('NarrowItDownController', NarrowItDownController)
.service('MenuSearchService', MenuSearchService)
.directive('foundItems', FoundItemsDirective);

function FoundItemsDirective() {
  var ddo = {
    templateUrl: 'foundItems.html',
    scope: {
      items: '<',
      on-remove: '&'
    },
  };

  return ddo;
}


NarrowItDownController.$inject = ['MenuSearchService'];
function NarrowItDownController(MenuSearchService) {
  var menu = this;

  var promise = MenuSearchService.getMatchedMenuItems();

  promise.then(function (response) {
    menu.found = response.data;
  })
  .catch(function (error) {
    console.log("Something went terribly wrong.");
  });

  menu.onRemove = function (index) {
    menu.found.splice(index, 1);
  }
}


MenuSearchService.$inject = ['$http'];
function MenuSearchService($http) {
  var service = this;

  service.getMatchedMenuItems = function (searchTerm) {
    return $http({
      method: "GET",
      url: "https://davids-restaurant.herokuapp.com/menu_items.json"})
      .then(function (result) {
      // process result and only keep items that match
      var foundItems = result.data;

      for(var index=0; i < foundItems.length ; index++){
        if (foundItems[index] !== searchTerm){
          foundItems.splice(index,1);
        }
      };

      // return processed items
      return foundItems;
    });
  };

}

})();
