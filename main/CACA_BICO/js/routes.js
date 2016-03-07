(function(){
  angular.module("jobSearch")
    .config(config);

  function config($routeProvider) {
    $routeProvider
      .when('/search', {
        templateUrl: "templates/search.html",
        controller: "SearchCtrl as vm"
      })
      .when('/job/:id',{
        templateUrl: "templates/job.html",
        controller: "JobCtrl as vm"
      }).when('/post-job', {
        templateUrl: "templates/post-job.html",
        controller: "PostJobCtrl as vm"
      }).otherwise({
        redirectTo: "/search"
      });

  }
}())
