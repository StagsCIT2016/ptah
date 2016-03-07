(function(){
  angular.module("jobSearch")
  .factory("getService", getService)
  .factory('postService', postService)
  ;
  function getService($http){
    // var baseUrl = 'http://172.16.106.20:3000/positions';
    var baseUrl = 'http://127.0.0.1:8080/api/v1/positions';
    var jobList = [];

    var service = {
      getJobList: getJobList,
      getJob: getJob
    };
    return service;

    function getJobList(description, location, isFullTime, page) {
      var newUrl = baseUrl + "?description=" + description + "&location=" + location;
      if (isFullTime) {
        newUrl = newUrl  + "&type=Full%20Time";
      }
      if(page > 0){
        newUrl += "&page=" + page;
      }
      return $http.get(newUrl, {cache:true})
        .then(function(response) {
          return response.data.list;
        });
    }

    function getJob(key) {
      return $http.get(baseUrl + "/" + key, {cache:true})
        .then(function(response) {
          return response.data;
        });
    }

  }

  function postService($http){
      var baseUrl = 'http://127.0.0.1:8080/api/v1/positions';

      var service = {
        postJob: postJob
      };
      return service;

      function postJob(newJob){
        return $http.post(baseUrl, newJob)
          .then(function(){
            alert("Job submitted! :D");
          });
      }
  }

}())
