/**
 * @class angularModule.core
 * @memberOf angularModule
 */

 var applicationModuleVendorDependencies = [
     'ngAnimate',
     'ngMessages',
     'restangular',
     'ui.router',
     'noCAPTCHA',
     'ngMaterial',
     'lrInfiniteScroll',
     'angulartics',
     'angulartics.google.analytics'
 ];
AppConfig.registerModule('core', applicationModuleVendorDependencies);
