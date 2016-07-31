
'use strict';

var app = angular.module('angularApp', ['ui.router', 'satellizer', 'ngPassword', 'ngAnimate']);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('landing', {
            url: '/',
            templateUrl: '/html/landingpage.html',
            controller: 'landingCtrl'

        })
        .state('sell', {
            url: '/sell',
            templateUrl: '/html/sell.html',
            controller: 'sellCtrl',
            resolve: {
                devices: function(landingService) {
                    return landingService.getAll()
                        .then(devices => {
                            return devices
                        });
                }
            }

        })
        .state('home', {
            url: '/home:devicetype',
            templateUrl: '/html/home.html',
            controller: 'homeCtrl'
        })
        .state('businesscontact', {
            url: '/contact/wholesale',
            templateUrl: '/html/businesscontactform.html',
            controller: 'wholesaleCtrl'
        })
        .state('edituser', {
            url: '/users/edit/:userid',
            templateUrl: '/html/edituser.html',
            controller: 'editUserCtrl'
        })
        .state('editorder', {
            url: '/orders/edit/:orderid',
            templateUrl: '/html/editorder.html',
            controller: 'editOrderCtrl'
        })
        .state('loggedin', {
            url: '/',
            templateUrl: '/html/home.html',
            controller: 'mainCtrl'
        })
        .state('newlisting', {
            url: '/listing/new',
            templateUrl: '/html/newlisting.html',
            controller: 'newItemCtrl'
        })
        .state('login', {
            url: '/login/',
            templateUrl: '/html/login.html',
            controller: 'loginCtrl'
        })

        .state('register', {
            url: '/newuser/',
            templateUrl: '/html/register.html',
            controller: 'registerCtrl'
        })
        .state('settings', {
            url: '/admin/settings',
            templateUrl: '/html/settings.html',
            controller: 'settingsCtrl',
            resolve: {
                userLoggedIn: function(userService) {
                    return userService.admin()
                        .then(user => {
                            return user
                        });
                }
            }
        })
        .state('users', {
            url: '/admin/users',
            templateUrl: '/html/manageUsers.html',
            controller: 'manageUsersCtrl',
            resolve: {
                userList: function(userService) {
                    return userService.getAll()
                        .then(users => {
                            return users
                        });
                }
            }
        })

        .state('dashboard', {
            url: '/admin/dashboard',
            templateUrl: '/html/dashboard.html',
            controller: 'dashboardCtrl',
            resolve: {
                userLoggedIn: function(userService) {
                    return userService.admin()
                        .then(user => {
                            return user
                        });
                }
            }
        })
        .state('devices', {
            url: '/admin/devices',
            templateUrl: '/html/devices.html',
            controller: 'devicesCtrl',
            resolve: {
                devices: function(landingService) {
                    return landingService.getAll()
                        .then(devices => {
                            return devices
                        });
                }
            }
        })
        .state('inbox', {
            url: '/admin/inbox',
            templateUrl: '/html/inbox.html',
            controller: 'inboxCtrl'
        })
        .state('details', {
            url: '/details/:id',
            templateUrl: '/html/details.html',
            controller: 'detailsCtlr'
        })
        .state('testimonials', {
            url: '/testimonials',
            templateUrl: '/html/testimonials.html',
            controller: 'testimonialsCtlr'
        })
        .state('contact', {
            url: '/contact',
            templateUrl: '/html/contact.html',
            controller: 'contactCtlr'
        })
        .state('privacy', {
            url: '/privacy',
            templateUrl: '/html/privacy.html',
            controller: 'privacyCtlr'
        })
        .state('faq', {
            url: '/faq',
            templateUrl: '/html/faq.html',
            controller: 'faqCtlr'
        })
        .state('about', {
            url: '/about',
            templateUrl: '/html/about.html'
        })
        .state('profile', {
            url: '/profile/',
            templateUrl: '/html/profile.html',
            controller: 'profileCtlr'
        })
        .state('legal', {
            url: '/legal',
            templateUrl: '/html/legal.html'
        })
        .state('businesscontactform', {
            url: '/businesscontactform',
            templateUrl: '/html/businesscontactform.html',
            controller: 'businessCtlr'
        })
        .state('userupdate', {
            url: '/profile/update',
            templateUrl: '/html/edituserprofile.html',
            controller: 'userUpdateCtrl',
            resolve: {
                userLoggedIn: function(userService) {
                    return userService.getProfile()
                        .then(user => {
                            return user
                        });
                }
            }
        });


    $urlRouterProvider.otherwise('/');

})
