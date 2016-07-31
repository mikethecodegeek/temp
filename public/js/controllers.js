'use strict';
var app = angular.module('angularApp');


app.controller('mainCtrl', function ($scope, $rootScope,  $state,  $window, $location, userService, deviceService) {
  $rootScope.$on('$stateChangeStart', function() { $window.scrollTo(0,0) });

  $scope.isActive = function(viewLocation) {
       return viewLocation === $location.path();
   };

    var currentUser = userService.getProfile()
        .then(user => {
            if(user) {
                $rootScope.loggedin=true;
                if (user.data.admin === true) {
                    $scope.admin = true;
                }
                else {
                    $scope.admin = false;
                }
            }
            else {$rootScope.loggedin = false; }

        });

    $scope.logout = function () {
        userService.logout()
            .then(user => {
                  $rootScope.loggedin = false;
                  $scope.admin = false;
                $state.go('landing');
            });
    };

    $scope.loginUser=function() {
        $('#myModal').modal('show');
    };

    $scope.login = function() {
        var thisuser = {
            email: $scope.email,
            password: $scope.password
        };
        userService.login(thisuser)
            .then( (user) => {
                userService.setProfile(user);
                $state.go('landing');
            })
            .then( function() {
                $rootScope.loggedin=true;
                $('#email').val('');
                $('#password').val('');
                $('#myModal').modal('hide');
                userService.getProfile()
                    .then( user =>{
                      if (user.data.admin) {
                          $scope.admin = true;
                      }

                    });
            }, function() {swal('Please be sure you are registered and use a valid email and password.')});
    };


});

var currentQuote ={};
app.controller('homeCtrl', function(selectedItemService, userService, brandService, $stateParams, $scope, $state) {
    $scope.one = true;
    $scope.two = false;
    $scope.three = false;
    var modelselect = false;
    var versionselect = false;
    $scope.devices = [];
    var type=$state.params;
    console.log('params', $state.params.devicetype);
    brandService.getByType($state.params.devicetype)
        .then(function(res) {
            console.log('res', res)
            var devices = res.data;
            $scope.devices = devices;
            console.log('devices:', $scope.devices.name);
        })

    $scope.showModels = function(models) {
        $scope.one = false;
        console.log('models', models);
        $scope.selectedModels = models;
        modelselect = true;
        $scope.two = true;

    }
    $scope.showBrands = function(brands) {
        $scope.one = true;
        console.log('brands', brands);
        $scope.selectedBrands = brands;
        $scope.two = false;
        $scope.three = false;
        $scope.four = false;
    }

    $scope.showModelsAgain = function() {
        $scope.one = false;
        $scope.two = true;
        $scope.three = false;
        $scope.four = false;
    }

    $scope.showCapacitiesAgain = function() {
        $scope.one = false;
        $scope.two = false;
        $scope.three = true;
        $scope.four = false;
    }

    $scope.showDevices = function(model) {
        console.log('model.devices:', model.devices);
        $scope.currentDevices = model.devices;
        $scope.two = false;
        $scope.three = true;
    }

    // $scope.showVersions = function(versions) {
    //     console.log('versions: ',versions);
    //     $scope.two = false;
    //     $scope.three = true;
    //     $scope.selectedVersions = versions;
    //     versionselect = true;
    //     currentQuote.deviceType = versions.type;
    //     currentQuote.brand = versions.brand;
    //     currentQuote.deviceName = versions.devicename;
    // }

    $scope.showCapacities = function(device) {

        console.log(device.capacities);
        $scope.iNeedADevice = device;
        console.log('where is CAPACITY?', device);
        $scope.one = false;
        $scope.two = false;
        $scope.three = false;
        $scope.four = true;
        // console.log('capacities:', $scope.models.devices.capacities);
        $scope.selectedCapacities = device.capacities;
        console.log('capacities', $scope.selectedCapacities);
    }
    $scope.getQuote = function(capacity) {
        // console.log('capacity: ',capacity)
        // console.log('version: ',capacityVersion)
         selectedItemService.setItem(capacity, $scope.iNeedADevice);
         $state.go('details');
    };


});


app.controller('newListing', function(listingService, $scope, $state) {
    console.log('listing Ctrl');

});


app.controller('landingCtrl', function(landingService, $scope, $state) {
//console.log(devices);


});

app.controller('sellCtrl', function(landingService, $scope, $state, devices) {
//console.log(devices);
    $scope.devicetypes = devices.data;

});

app.controller('settingsCtrl', function(messageService, $scope, $state, userLoggedIn, userService) {
    console.log(userLoggedIn);
    $scope.role = userLoggedIn.data.superadmin;
    $scope.email = userLoggedIn.data.email;
    messageService.getTemplate()
        .then(message => {
            console.log('template: ',message)
        $scope.primaryEmail = message.data.sentfrom;
            $scope.firstSubject = message.data.subject;
            $scope.firstEmail = message.data.body;
    })
    $scope.changePassword = function() {
        //console.log($scope.password)
        if ($scope.newpassword === $scope.confirmPassword) {
            var currentUser = userLoggedIn.data;
            var newpass = $scope.newpassword;
            userService.adminPassword(currentUser, newpass)
                .then(data => {
                    swal('Your password has been succesfully changed!')
                });
        }
        else {
            swal('Passwords do not match! Please try again');
        }

    };
    $scope.changeEmail = function() {
        var currentUser = userLoggedIn.data;
        var newemail=$scope.email;
        userService.changeAdminEmail(currentUser, newemail)
            .then(data => {
                console.log(data);
                swal('Your email has been succesfully changed!')
            });
    };
    $scope.registerAdmin = function() {
       var newAdmin = {
           name: $scope.newAdminName,
           email: $scope.newAdminEmail,
           username: $scope.newAdminUser,
           password: $scope.newAdminPassword,
           admin: true,
           authType: "admin"
       };

       if ($scope.newAdminPassword === $scope.newAdminConfirmPassword) {
           //console.log('hello')
           userService.register(newAdmin)
               .then(data => {
                   console.log(data);
                   swal('New admin registered')
               });
       }
   };

    $scope.firstTemplate = function() {
        var emailTemplate = {
            status: 'confirm',
            from: $scope.primaryEmail,
            subject: $scope.firstSubject,
            body: $scope.firstEmail
        }
        console.log(emailTemplate);
        messageService.saveTemplate(emailTemplate)
            .then(email => {
                console.log(email);
                swal('Your email information has been saved. You\'re email system is active!')
            });
    }

});

app.controller('manageUsersCtrl', function($scope, $state, userList, userService) {

    $scope.userArr = userList.data;
    //console.log(userList);
    $scope.deleteUser= function(selectedUser) {
        swal({ title: "Are you sure?",
                text: "User will be deleted from system!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false },
            function() {
                userService.deleteById(selectedUser)
                    .then(users => {
                        swal("Deleted!", "User has been deleted.",
                            "success");
                        $scope.userArr = users.data;
                    })
            }
        );
    }

});

app.controller('dashboardCtrl', function($scope, $state, userLoggedIn) {
 //   console.log('dash Control')
    if (userLoggedIn){
     //   console.log(userLoggedIn);
    }
    else {
        console.log('Not Logged In');
        $state.go('home');
    }


});

app.controller('inboxCtrl', function(messageService, $scope, $state) {
    messageService.getAll()
        .then(stuff => {
            $scope.messages = stuff.data;
        });
    $scope.deleteMessage = function(message) {
        console.log(message);
        messageService.deleteById(message)
            .then(stuff => {
                console.log(stuff)
                $scope.messages = stuff.data;
            });
    }


});
app.controller('devicesCtrl', function($scope, $state, devices, deviceService, landingService, brandService, modelService, capacityService) {
    console.log('devices 1:', devices);

    var devicetype = false;
    $scope.adding = false;
    $scope.branding = true;
    $scope.modeling = true;
    $scope.capacitying = true;

    $scope.toggleAddDevice = function() {
        if (!$scope.adding) {
            $scope.adding = true;
        }
        else {
            $scope.adding=false;
        }
    };

    deviceService.getAll()
        .then(stuff => {
            $scope.devices =stuff.data;
            console.log('devices:', $scope.devices)
        });
    landingService.getAll()
        .then(deviceTypes => {
            $scope.devicetypes = deviceTypes.data;
           // console.log('deviceTypes:', deviceTypes.data);
            $scope.currentDevices = deviceTypes.data[0].brands[0].models[0].devices;
        });
    modelService.getAll()
        .then(deviceModels => {
            $scope.devicemodels = deviceModels.data;
           // console.log('models:', deviceModels.data);
        });
    brandService.getAll()
        .then(brands => {
            $scope.brands = brands.data;
            //console.log('brands: ', $scope.brands);
        });
    capacityService.getAll()
        .then(capacities => {
            $scope.capacities = capacities.data;
         //   console.log('capacities:', capacities.data);
        })


    $scope.setDeviceType= function(type) {
        devicetype = type.devicetype;
        console.log('clicked Category:',type)
        $scope.finalDevice= devicetype;
      //  console.log('devicetype', devicetype);
        $scope.filteredBrands = $scope.brands.filter(brand => brand.refId=== type._id);
        $scope.deviceId = type._id;
     //   console.log('filtered brands: ',$scope.filteredBrands);
        $scope.branding = false;
        $scope.adding = false;
     //   console.log('brands:', $scope.brands);
    };

    $scope.setBrand = function(brand) {
        console.log('clicked brand:',brand)
        name = brand.name;
        $scope.finalBrand = brand.name;
       console.log('models:', $scope.devicemodels);
        $scope.filteredModels = $scope.devicemodels.filter(model => model.refId === brand._id);
     //   console.log($scope.filteredModels)
        $scope.brandId = brand._id;
        $scope.branding = true;
        $scope.modeling = false;
    }

    $scope.addBrand = function() {
        var brand = {
            name: $scope.newBrand,
            imgurl: $scope.newBrandImage,
            devicetype: $scope.finalDevice,
            models:[]
        };
        var device = $scope.newBrandType;
      //  console.log('brand:', brand)
        brandService.addBrand(brand, device)
            //.then(data => $scope.brands = data.data);
            .then(data => {
                $scope.brands.push(data.data)
                $scope.filteredBrands.push(data.data)
                swal({   title: "Congrats!",   text: `You have added the ${brand.name} brand to your site.`,
                type: "success",  closeOnConfirm: true }
              );

    }, function(err) {
      console.log(err)
    })      //   = data.data.filter(brand => brand.devicetype === devicetype))
    };

    $scope.setModel = function(model) {
        console.log('clicked model:',model)
        name = model.name;
        $scope.finalModel=model.name;
        $scope.finalImage=model.imgurl;
        $scope.modelId = model._id;
        $scope.filteredDevices = $scope.devices.filter(device => device.refId === model._id);
      //  console.log('Filtered Devices:', $scope.filteredDevices)
        $scope.branding = true;
        $scope.modeling = true;
        $scope.capacitying = false;

    }
    $scope.addNewDeviceModel = function() {
        var model = {
            name: $scope.newDeviceModel,
            imgurl: $scope.newDeviceModelImage,
            brand: $scope.finalBrand,
            devicetype: $scope.finalDevice,
            devices: []
        };
      //  console.log('model', model);
        modelService.addModel(model, $scope.newDeviceBrand, $scope.modelSelectType)
            .then(data => {
            //    console.log(data);
                $scope.devicemodels.push(data.data)
                $scope.filteredModels.push(data.data)   //= data.data.filter(model => model.refId === $scope.brandId);
                swal({   title: "Congrats!",   text: `You have added the ${model.name} model to your site.`,
                type: "success",  closeOnConfirm: true }
              );

            }, function(err) {
                swal(err.data)
            })
    };

    $scope.addDevice = function(capacity,device){

        var newDevice = {
            devicename: capacity.deviceName,
            imgurl: $scope.finalImage,
            devicetype: $scope.finalDevice,
            brand: $scope.finalBrand,
            size: $scope.deviceSize,
            model: $scope.finalModel,
            capacities: []
        };


        deviceService.addDevice(newDevice, $scope.versionSelectModel)
            .then(data => {
           //     console.log(stuff)
                $scope.devices.push(data.data)
                $scope.filteredDevices.push(data.data)
                $scope.currentDevices.push(data.data) //= stuff.data.filter(device => device.refId === $scope.modelId);
                $scope.addCapacity(capacity.deviceName);
                //$scope.devices =stuff.data;
                swal({   title: "Congrats!",   text: `You have added the ${newDevice.devicename} device to your site.`,
                    type: "success",  closeOnConfirm: true }
                    );
              // console.log(stuff);
            });
        $scope.devicemodels.name = "";
        $scope.devicemodels.image = "";
        $scope.new = "";
        $scope.used = "";
        $scope.broken = "";
    }

    $scope.setDevice=function(device){
        $scope.finalDeviceName=device.name;
        $scope.deviceToChoose = device;
      //  console.log('Check my device:', device)
    }

    $scope.addCapacity = function(device){
        var newDevice = {
            size: $scope.newCapacity.name,
            imgurl: $scope.newCapacity.image,
            // type: $scope.capacitySelectType,
            // brand: $scope.capacitySelectBrand,
            // model: $scope.capacitySelectModel,
            // version: $scope.capacitySelectDevice,
            devicename: $scope.newCapacity.deviceName || $scope.setThisDevice,
            new: $scope.new1,
            used: $scope.used1,
            broken: $scope.broken1,
            modelname: $scope.finalModel,
            devicetype: $scope.finalDevice
        };
       // console.log('newDevice:', newDevice);
        capacityService.addCapacity(newDevice)
            .then(stuff => {
               // $scope.devices =stuff.data;
                swal({   title: "Congrats!",   text: `You have added the ${newDevice.devicename} device to your site.`,
                    type: "success",  closeOnConfirm: true }
                );
                // console.log(stuff);
            });

    }

    $scope.addNewDeviceType = function() {

        var newDeviceType = {
            devicetype: $scope.newDeviceType,
            imgurl: $scope.newDeviceTypeImage
        };

        landingService.addDeviceType(newDeviceType)
            .then(device => {
                $scope.devicetypes.push(device.data);
                swal({   title: "Congrats!",   text: `You have added the ${newDeviceType.devicetype} device category to your site.`,
                    type: "success",  closeOnConfirm: true }
                    );


             //   console.log(device);
            });
        $scope.newDeviceType = "";
        $scope.newDeviceTypeImage= "";
    };
    $scope.setDeviceInput = function(device) {
        console.log(device);
        $('#setThisDevice').val(device)
        $scope.setThisDevice = device;
    }

    $scope.removeDevice = function(device) {
        console.log('device:', device)

                //console.log('stuff:', stuff);
                swal({ title: "Are you sure?",
                        text: "You will not be able to recover this device!",
                        type: "warning",
                        showCancelButton: true,
                        confirmButtonColor: "#DD6B55",
                        confirmButtonText: "Yes, delete it!",
                        closeOnConfirm: false },
                        function() {
                            deviceService.deleteById(device._id)
                                .then(dev => {
                                    swal("Deleted!", "Your device has been deleted.",
                                        "success");
                                    $scope.devices = $scope.devices.filter(devices2 => devices2._id !== device._id);
                                    $scope.filteredDevices = $scope.filteredDevices.filter(dev => dev._id !== device._id);
                                    $scope.currentDevices = $scope.currentDevices.filter(dev => dev._id !== device._id)
                                })
                        }
                    );
        }

    $scope.removeCategory = function(categoryId) {
        swal({ title: "Are you sure?",
                text: "This category and all brands, models and devices associated with it will be deleted",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false },
            function() {
                landingService.deleteById(categoryId)
                    .then(data => {
                        swal("Deleted!", "Category has been deleted.",
                            "success");
                        $scope.devicetypes = data.data;
                    })
            }
        );


    }
    $scope.removeBrand = function(brandId) {
        swal({ title: "Are you sure?",
                text: "This brand and all devices associated with it will be deleted!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false },
            function() {
                brandService.deleteById(brandId)
                    .then(data => {
                        swal("Deleted!", "Brand has been deleted.",
                            "success");

                        $scope.brands = $scope.brands.filter(brand => brand._id !== brandId);
                        $scope.filteredBrands = data.data.filter(brand => brand.refId === $scope.deviceId);
                    })
            }
        );

    }

    $scope.removeModel = function(modelId) {
        swal({ title: "Are you sure?",
                text: "All devices associated with this model will be deleted!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false },
            function() {
                modelService.deleteById(modelId)
                    .then(data => {
                        swal("Deleted!", "Model has been deleted.",
                            "success");
                        $scope.devicemodels = $scope.devicemodels.filter(model => model._id !== modelId);
                        $scope.filteredModels = data.data.filter(model => model.refId === $scope.brandId);
                    })
            }
        );
    }

});

app.controller('dashboardCtrl', function(quoteService, $scope, $state) {
    quoteService.getAll()
        .then(stuff => {
            console.log(stuff)
            $scope.myOrders = stuff.data;
        });
    $scope.editModal = function(order){
        $scope.userName = order.username;
        $scope.quoteAmount = order.amount;
        $scope.device = order.device;
        $scope.date = order.date;
        $scope.description = order.description;
        $scope.condition = order.condition;
        $scope.status = order.status;
        $('#ordersModal').modal('show');
    };

    $scope.deleteOrder = function(order){
        swal({ title: "Are you sure?",
                text: "This quote will be deleted forever!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                closeOnConfirm: false },
            function() {
                quoteService.deleteFromAdminById(order._id)
                    .then(stuff => {
                        swal("Deleted!", "Order has been deleted.",
                            "success");
                        $scope.myOrders = stuff.data;
                    })
            }
        );
    };


});

app.controller('detailsCtlr', function(messageService, selectedItemService, quoteRegister,userService, quoteService, transactionService, deviceService, $rootScope, $stateParams, $scope, $state, $auth) {
    $scope.optionsRadios = "top-notch";
    $scope.carrierModel = "Verizon";

    $scope.showDecent = function() {
        $scope.topCondition = true;
        $scope.decentCondition = false;
        $scope.bustedCondition = true;
    };

    $scope.showBusted = function() {
        $scope.topCondition = true;
        $scope.decentCondition = true;
        $scope.bustedCondition = false;
    };
    $scope.showTop = function() {
        $scope.topCondition = false;
        $scope.decentCondition = true;
        $scope.bustedCondition = true;
    };


        if($scope.optionsRadios === "top-notch") {
            $scope.topCondition = false;
            $scope.decentCondition = true;
            $scope.bustedCondition = true;
        } else if($scope.optionsRadios === "Decent") {

        } else if($scope.optionsRadios === "Busted") {
            $scope.topCondition = true;
            $scope.decentCondition = true;
            $scope.bustedCondition = false;
        }


    $scope.quoteAllowed=false;
    var currentUser = userService.getProfile()
        .then(stuff => {
            $scope.user =stuff;
            if(stuff) {
                $scope.quoteAllowed=true;
            }
        });

    $scope.device = selectedItemService.getItem();
    console.log($scope.device);



    $scope.openModal = function() {
        console.log('current: ',$scope.device.version);
        if($('#new').is(':checked')) {
           $scope.customQuote =  $scope.device.capacity.new;
       }
       else if($('#used').is(':checked')) {
           $scope.customQuote =  $scope.device.capacity.used;
       }
       else if($('#broken').is(':checked')) {
           $scope.customQuote =  $scope.device.capacity.broken;
       }

        $scope.currentBrand = $scope.device.version.brand;
        $scope.currentModel = $scope.device.version.model;
        $scope.currentCapacity = $scope.device.capacity.size;
        $scope.condition = $scope.optionsRadios;
        $scope.carrier = $scope.carrierModel;
        $scope.locked = $('#radio1').is(':checked');

        $('#myModal1').modal('show');
        }
    $scope.addTransaction = function() {

        if($('#paypal').is(':checked')) {
            $scope.payment = "paypal";
        } else if($('#check').is(':checked')) {
            $scope.payment = "check";
        }
        else if($('#ach').is(':checked')) {
            $scope.payment = "ach";
        }
    //    console.log($scope.payment);

    var transaction = {
        devicetype: $scope.device.capacity.devicetype,
        brand: $scope.device.capacity.brand,
        device: $scope.device.version.devicename,
        capacity: $scope.device.capacity.size,
        condition: $scope.condition,
        carrier: $scope.carrier,
        locked: $scope.locked,
        payment: $scope.payment,
        status: 'Kit not ordered',
        quote: $scope.customQuote,
        paymentmethod: $scope.payment
    };
   // console.log('transaction', transaction);
    transaction.date = moment().format();
    //transaction.name = ;
    $scope.thisTransaction = transaction;

        quoteService.addQuote(transaction, $scope.user)
            .then( (stuff) => {
                console.log(stuff)
                transactionService.addTransaction(stuff.data, $scope.user)
                    .then( (stuff2) => {
                        swal({   title: "Thank You!",   text: `Time to review your order and get your free shipping kit.`,
                            type: "success",  closeOnConfirm: true }
                        );
                        $('#myModal1').modal('hide');
                        // messageService.sendConfirm($scope.user)
                        //     .then(user => {
                        //         console.log(user);
                        //     })
                        $state.go('profile');
                    });

            });
    }

    $scope.registerWithQuote = function() {
        $('#myModal').modal('hide');
        if($('#paypal').is(':checked')) {
            $scope.payment = "paypal";
        } else if($('#check').is(':checked')) {
            $scope.payment = "check";
        }
        else if($('#ach').is(':checked')) {
            $scope.payment = "ach";
        }
        var transaction = {
            devicetype: $scope.device.version.type,
            brand: $scope.device.version.brand,
            name: $scope.device.version.model,
            condition: $scope.condition,
            capacity: $scope.device.capacity.size,
            carrier: $scope.carrier,
            locked: $scope.locked,
            status: 'pending',
            quote: $scope.customQuote,
            paymentmethod: $scope.payment
        };
        transaction.date = moment().format();
        transaction.device = $scope.device.version.devicename;
        console.log(transaction)
        quoteRegister.setQuote(transaction);
        $state.go('register');
    }

    $scope.cancelTransaction = function(){
        $('#myModal1').modal('hide');
    }


});

app.controller('userUpdateCtrl', function(userLoggedIn, userService, $scope, $state, $auth) {
    console.log(userLoggedIn)
    $scope.userToEdit = userLoggedIn.data;

    $scope.updateUser = function() {
        var updateduser = {
            name: $('#newname').val(),
            email: $('#newemail').val(),
            phone: $('#newphone').val(),
            defaultaddress: {
                city: $('#newcity').val(),
                state: $('#newstate').val(),
                zip: $('#newzip').val(),
                address: $('#newaddress').val()
            }

        };
        console.log(updateduser)
        userService.editById($scope.userToEdit._id, updateduser)
            .then(user => {
                swal('Thanks! Your information has updated successfully.')
            })

    }

    $scope.editDefaultAddress = function() {
        console.log('thing')
        $('#editDefault').modal('show')
    }

    $scope.newAddressModal = function() {
        console.log('thing')
        $('#addAddress').modal('show')
    }

    $scope.saveDefault = function() {
        var updatedDefault = {
            defaultaddress: {
                city: $('#defaultcity').val(),
                state: $('#defaultstate').val(),
                zip: $('#defaultzip').val(),
                address: $('#defaultaddress').val()
            }
        }
       // console.log(updatedDefault)
        userService.editById($scope.userToEdit._id, updatedDefault )
            .then(user => {
                $scope.userToEdit = user.data;
                $('#editDefault').modal('hide');
                swal('Thanks! Your information has updated successfully.')

            })
    }

    $scope.removeAddress = function(a) {
        var c = $scope.userToEdit.addresses.filter(function (b) {
            return a.city !== b.city  && a.state !== b.state && a.zip !== b.zip && a.address !== b.address;
        })
        var updatedAddressList = {
            addresses: c
        }
        userService.editById($scope.userToEdit._id, updatedAddressList )
            .then(user => {
                $scope.userToEdit = user.data;
                $('#addAddress').modal('hide');
                swal('Thanks! Your information has updated successfully.')

            })
    }

    $scope.addNewAddress = function() {
        var addresslist = $scope.userToEdit.addresses;
        addresslist.push($scope.newaddress)
        var updatedAddressList = {
            addresses: addresslist
        }
        userService.editById($scope.userToEdit._id, updatedAddressList )
            .then(user => {
                $scope.userToEdit = user.data;
                $('#addaddress').modal('hide');
                swal('Thanks! Your information has updated successfully.')

            })
    }

    $scope.editAddressList = function(ind, add) {
        $scope.indexToSplice = ind;
        $scope.edit = {
            city: add.city,
            state: add.state,
            zip: add.zip,
            address: add.address
        }
        $('#editAddressList').modal('show')
    }

    $scope.updateAddressList = function(newaddress) {
        var newAddress = {
            city: $('#editcity').val(),
            state: $('#editstate').val(),
            zip: $('#editzip').val(),
            address: $('#editaddress').val()
        }
        var addresslist = $scope.userToEdit.addresses;
        addresslist.splice($scope.indexToSplice,1,newAddress);
        var updatedAddressList = {
            addresses: addresslist
        }
        userService.editById($scope.userToEdit._id, updatedAddressList )
            .then(user => {
                $scope.userToEdit = user.data;
                $('#addaddress').modal('hide');
                swal('Your information has updated successfully');
                $('#editAddressList').modal('hide');
            })
    }

    $scope.changeMailingAddress = function (address) {
        //console.log('chosen address:', address)
        var addresslist = $scope.userToEdit.addresses;
        var newDefaultAddress;
        addresslist.forEach(function(a) {
           a.default = false;
           if(a.state == address.state && a.city == address.city && a.zip == address.zip && a.address == address.address) {
               a.default = true;
               newDefaultAddress = {
                   address: address
               }
           }
        })
        console.log('default ',newDefaultAddress)
        console.log('all: ', addresslist)
        var updatedAddressList = {
            defaultaddress: newDefaultAddress.address,
            addresses: addresslist
        }
        userService.editById($scope.userToEdit._id, updatedAddressList )
            .then(user => {
                $scope.userToEdit = user.data;
                $('#addaddress').modal('hide');
                swal('Your information has updated successfully');
                $('#editAddressList').modal('hide');
            })

    }

});

app.controller('loginCtrl', function(userService, $scope, $state, $auth) {
    $scope.login = function() {
        var thisuser = {
            email: $scope.email,
            password: $scope.password
        };
        userService.login(thisuser)
            .then( (stuff) => {
                userService.setProfile(stuff);
                $state.go('home');
            });
    }

});

app.controller('wholesaleCtrl', function(userService, $scope, $state, $auth) {
   console.log('Wholesale Controller');
   console.log('Functionality will be implemented after email is set up')
    $scope.sendRequest = function(email) {
        console.log(email)
    }
});

app.controller('editUserCtrl', function(userService, $scope, $state, $auth) {
    console.log($state.params.userid);
     userService.getById($state.params.userid)
         .then(userToEdit => {
             console.log('userToEdit:', userToEdit);
             $scope.userToEdit = userToEdit.data;
         });
     $scope.updateUser = function() {
         var updateduser = {
             name: $('#newname').val(),
             email: $('#newemail').val(),
             phone: $('#newphone').val(),
             defaultaddress: {
                 city: $('#newcity').val(),
                 state: $('#newstate').val(),
                 zip: $('#newzip').val(),
                 address: $('#newaddress').val()
             }
         };
         console.log(updateduser)
         userService.editById($scope.userToEdit._id, updateduser)
             .then(user => {
                 swal('User updated successfully')
             })
     }
});

app.controller('editOrderCtrl', function(quoteService, userService, $scope, $state, $auth) {
    console.log('state.params', $state.params);


    quoteService.getById($state.params.orderid)
        .then(order => {
            console.log('order', order);
            $scope.updateOrder = order.data;
            console.log('updateorder:', $scope.updateOrder);
            console.log('scope.username', $scope.updateOrder.username);
            var username = $scope.updateOrder.username
                //get user by username
            userService.getByUsername(username)
                .then(user => {
                    $scope.user = user.data;
                    console.log('user', user);
                })
        })


    $scope.updateQuote = function() {
        var updatedorder = {
            device: $('#orderDevice').val(),
            amount: $('#orderAmount').val(),
            date: $('#orderDate').val(),
            condition: $('#orderCondition option:selected').text(),
            paymentmethod: $('#orderPayment option:selected').text(),
            username: $('#orderUser').val(),
            status: $('#orderStatus option:selected').text()
        };
        console.log('updateorder', updatedorder);
        console.log($state.params.orderid)
        quoteService.editById($state.params.orderid, updatedorder)
            .then(newOrder => {
                console.log(newOrder)
                $scope.updateOrder = newOrder.data;
            })

    }





});


app.controller('registerCtrl', function(transactionService,quoteService, quoteRegister, userService, $scope, $rootScope, $state) {
    $scope.register = function(form) {
       // // console.log(form)
        var re;
        if($scope.pwd1 != "" && $scope.pwd1 == $scope.pwd2) {
            if($scope.pwd1.length < 6) {
                swal("Error: Password must contain at least six characters!");
                return false;
            }
            if($scope.pwd1 == $scope.username) {
                swal("Error: Password must be different from Username!");
                return false;
            }
            re = /[0-9]/;
            if(!re.test($scope.pwd1)) {
                swal("Error: password must contain at least one number (0-9)!");
                return false;
            }
            re = /[a-z]/;
            if(!re.test($scope.pwd1)) {
                swal("Error: password must contain at least one lowercase letter (a-z)!");
                return false;
            }
            re = /[A-Z]/;
            if(!re.test($scope.pwd1)) {
                swal("Error: password must contain at least one uppercase letter (A-Z)!");
                return false;
            }
        } else {
            swal("Error: Please check that you've entered and confirmed your password!");
            return false;
        }


        var thisuser = {
            name: $scope.newName,
            email: $scope.newEmail,
            username: $scope.newUsername,
            password: $scope.pwd1,
            phone: $scope.newPhone,
            defaultaddress: {
                city: $scope.newCity,
                state: $scope.newState,
                zip: $scope.newZip,
                address: $scope.newAddress
            },
            addresses: [
                {
                    city: $scope.newCity,
                    state: $scope.newState,
                    zip: $scope.newZip,
                    address: $scope.newAddress
                }
            ]


        };
        thisuser.joinDate = moment().format();
        thisuser.authType = 'user';
     //   console.log(thisuser);
        var user = {
            data: thisuser
        };
        userService.register(thisuser)
            //console.log(thisuser)
            .then((newuser) => {
                console.log(newuser)
                if (quoteRegister.getQuote()) {
                    quoteService.addQuote(quoteRegister.getQuote(), newuser)
                        .then((stuff2) => {
                            console.log(stuff2)
                            transactionService.addTransaction(stuff2.data, newuser)
                            swal({
                                title: "Thank You for registering!",
                                text: `Login to your profile to review your order and get your free shipping kit!`,
                                type: "success",
                                closeOnConfirm: true
                            }, function() {
                                var thisuser = {
                                    email: $scope.newEmail,
                                    password: $('#pwd1').val()
                                };
                                console.log(thisuser)
                                userService.login(thisuser)
                                    .then( (user) => {
                                        userService.setProfile(user);
                                        //$state.go('landing');
                                    })
                                    .then( (stuff) => {
                                        $rootScope.loggedin=true;
                                        testlog.setlog();
                                        userService.getProfile()
                                            .then( user =>{
                                                if (user.data.admin) {
                                                    $scope.admin = true;
                                                }
                                                $state.go('profile')
                                            });
                                    })
                            });
                        }, function (err) {
                            console.log('failed')
                        })

                }
                else {
                    swal({
                            title: "Thank You for registering", text: `You are ready to start selling!`,
                            type: "success", closeOnConfirm: true
                        }
                    );
                }
                var thisuser = {
                    email: $scope.newEmail,
                    password: $('#pwd1').val()
                };
                console.log(thisuser)
                userService.login(thisuser)
                    .then( (user) => {
                        userService.setProfile(user);
                        //$state.go('landing');
                    })
                    .then( (stuff) => {
                    $rootScope.loggedin=true;
                userService.getProfile()
                    .then( user =>{
                        if (user.data.admin) {
                            $scope.admin = true;
                        }
                        $state.go('profile')
                    });
                })


            }, function(err){
                console.log(err)
                swal(err.data.error)});
    }

});
app.controller('profileCtlr', function(quoteService, userService, $scope, $state, messageService) {
    var currentUser = userService.getProfile()
    .then(user => {
        var latest = user.data.transactions.length - 1;
        var lastTrans = user.data.transactions[latest];
        $scope.lastTransStat = lastTrans.status;
        console.log('status:', $scope.lastTransStat);
        $scope.lastTransDevice = lastTrans.device;
        console.log('Last Transaction Device:', lastTrans.device)
        $scope.lastTransDate = lastTrans.date;
        if (lastTrans.status === 'Kit Not Ordered'){
          $scope.hideProgBar = true;
        }
        if (lastTrans.status === 'Kit Ordered!'){
          $scope.progBar = 'images/progressbar/step1.png';
        }
        if (lastTrans.status === 'Label Shipped'){
          $scope.progBar = 'images/progressbar/step2.png';
        }
        if (lastTrans.status === 'Device Received'){
          $scope.progBar = 'images/progressbar/step3.png';
        }
        if (lastTrans.status === 'Payment Sent'){
          $scope.progBar = 'images/progressbar/step4.png';
        }

        $scope.user=user.data;
            var total = 0;
            var kitsOrdered =0;
            var completedSales = 0;
            for(var i = 0; i < user.data.transactions.length; i++){
                if (user.data.transactions[i].status !== 'Kit Not Ordered' ){
                    kitsOrdered++
                };
                if (user.data.transactions[i].status ==='Payment Sent'){
                    total += user.data.transactions[i].amount;
                    completedSales++;
                }

            }
            $scope.totalIncome= total;
            $scope.kits = kitsOrdered;
            $scope.completedSales= completedSales;

    });
    //console.log('stuff');
    $scope.askAQuestion = function() {
        var userMessage = {
            message: $scope.newMessage,
            user: $scope.user
        }
        var email = {
            useremail: $scope.user.email,
            emailbody: $scope.newMessage
        }
    //    console.log(userMessage);
        messageService.sendToAdmin(userMessage);
        messageService.emailAdmin(email)
            .then(message => console.log(message))
                $scope.newMessage = "";
                swal({   title: "Thank You!",   text: `We will get back to you within 24 hours.`,
                                         type: "success",  closeOnConfirm: true }
                                     );

    }
  // console.log($scope.user.email)

    $scope.shipKit = function(transaction, ind) {
        var home = $scope.user.defaultaddress
        $scope.user.addresses = $scope.user.addresses.filter( (address) => {
          return address.city !== home.city || address.zip !== home.zip || address.state !== home.state || address.address !== home.address
        })

        $scope.shippingaddress = $scope.user.defaultaddress;

        $scope.confirm = transaction
        $('#shippingKit').modal('show')

    }

    function automaticDefault() {
      var $radios = $('input:radio[name=shipOption]');
      if($radios.is(':checked') === false) {
          $radios.filter('[value=defaultaddress]').prop('checked', true);
      }
    }

    $scope.confirmOrder = function(transaction) {
        //console.log(transaction)
        console.log($scope.shippingaddress)
                $('#myModal1').modal('hide');
                quoteService.orderKit(transaction._id, $scope.shippingaddress, $scope.user.name)
                    .then(ordered => {
                        //console.log('index: ',$scope.user.transactions[ind])
                        console.log(ordered);
                        for (var a =0; a < $scope.user.transactions.length; a++) {
                            console.log($scope.user.transactions[a]._id)
                            if ($scope.user.transactions[a]._id === ordered.data._id){
                                console.log('true baby')
                                $scope.user.transactions[a].kitordered = true;
                                $scope.user.transactions[a].status = 'Kit Ordered!'

                            }
                        }
                    })
                messageService.sendConfirm($scope.user)
                    .then(user => {
                        swal({   title: "Thank You!",   text: `Your kit is on the way! Please check your email for confirmation!`,
                                         type: "success",  closeOnConfirm: true }
                                     );
                    })
                $state.go('profile');

    }




    });



app.controller('testimonialsCtlr', function(messageService,userService, $scope, $state) {
 $scope.sendRequest = function(testimonial) {
     messageService.sendTestimonial(testimonial)
         .then(message => swal('Your testimonial has been sent. Thank you!!'))
 }

 });

app.controller('businessCtlr', function(messageService, userService, $scope, $state) {
    $scope.sendRequest = function(business) {
        messageService.sendBusinessContact(business)
            .then(message => swal('Your message has been sent. We will contact you as soon as possible. Thank You.'))
    }

 });

app.controller('contactCtlr', function(messageService, userService, $scope, $state) {
    $scope.sendRequest = function(contact) {
        messageService.sendContact(contact)
            .then(message => swal('Your message has been sent. We will contact you as soon as possible. Thank You.'))
    }

});

app.controller('faqCtlr', function($scope, $state) {
console.log('faqCtrl works!');

});
