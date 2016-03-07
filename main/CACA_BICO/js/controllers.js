angular.module('jobSearch')
  .controller('SearchCtrl', SearchCtrl)
  .controller('JobCtrl', JobCtrl)
  .controller('PostJobCtrl', PostJobCtrl)
  ;

function SearchCtrl(getService, moment) {
  var vm = this;

  vm.jobDescription = "";
  vm.location = "";
  vm.fullTimeOnly = false;
  vm.jobList = [];
  vm.page = 0;
  vm.getPrevPage = function(){
    if (vm.page > 0 ){
      vm.page--;
      vm.searchJobs();
    };
  };
  vm.getNextPage = function(){
    vm.page++;
    vm.searchJobs();
  };

  vm.searchJobs = function () {
    getService.getJobList(vm.jobDescription, vm.location, vm.fullTimeOnly, vm.page)
    .then(function(jobList) {
      vm.jobList = jobList;
    });
  };
  vm.searchJobs();

  vm.createdAt = function(date)  {
    return moment(date).startOf('day').fromNow();
  }
}

function JobCtrl($routeParams, getService) {

  var vm = this;

  vm.jobInfo = {"type_" : ""};


  getService.getJob($routeParams.id)
  .then(function(jobInfo) {
    vm.jobInfo = jobInfo;
  });
}

function PostJobCtrl(postService) {
  var vm = this;

  vm.newJob = {};
  //type_ por compatibilidade com servidor python
  vm.newJob.type_ = "Full Time";
  vm.newJob.location = "";
  vm.newJob.title = "";
  vm.newJob.description ="";
  vm.newJob.company = "";
  vm.newJob.company_url = "";
  vm.newJob.company_logo = "";
  vm.newJob.how_to_apply = "";

  vm.previewSource = "";
  vm.previewJob = false;

  vm.previewClick = function(){
    if (vm.newJob.title == "" || vm.newJob.description == "" || vm.newJob.company == "" || vm.newJob.how_to_apply == "" ){
      alert("Preencha todos os campos!");
    } else {
      vm.previewJob = !vm.previewJob;
    }
  };

  vm.submitJob = function() {
    postService.postJob(vm.newJob);
  };
}
