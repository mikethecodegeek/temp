'use strict';

var app = angular.module('angularApp');

app.factory("authService", function(){
    return {
        getUser: function(){
            return $http.get('./api/users/profile');
        }
    };
});

app.service("quoteRegister", function(){
    var thisQuote = false;
    this.setQuote = function(quote) {
       thisQuote = quote;
     };
     this.getQuote = function() {
        return thisQuote;
     };
});

app.service("selectedItemService", function () {
    var item = {};
    this.setItem = function (capacity, version) {
        item.capacity = capacity;
        item.version = version;
    };
    this.getItem = function () {
        return item;
    };
});

app.service('userService', function($q,$http) {
    var profile = {loggedin: false};
    this.setProfile = function(myprofile) {
        profile = myprofile
    };
    this.getProfile = () => {
        return $http.get('./api/users/profile');
    };
    this.getAll = () => {
        return $http.get('./api/users');
    };

    this.getById = (id) => {
        return $http.get(`./api/users/id/${id}`);
    };

    this.getByUsername = (username) => {
        return $http.get(`./api/users/${username}`);
    }

    this.register = (newPost) => {
       return $http.post('./api/users/register', {user: newPost});
    };

    this.deleteById = id => {
        return $http.delete(`./api/users/${id}`);
    };

    this.editById = (id, newUser) => {
        return $http.put(`./api/users/${id}`, {user: newUser});
    };

    this.login = (user) => {
        return $http.post('./api/users/login/', {email: user.email, password: user.password});
    };
    this.logout = () => {
        return $http.delete('./api/users/logout/');
    };

    this.admin = () => {
        return $http.get('./api/users/admin/');
    };
    this.adminPassword = (user,newpass) => {
        return $http.post('./api/users/admin/password',{user:user, password: newpass});
    };
    this.changeAdminEmail = (user, newemail) => {
        return $http.post('./api/users/admin/changeemail',{user:user, email:newemail});
    };

});


app.service('landingService',function($http) {
    this.getAll = () => {
        return $http.get('./api/devicetypes');
    };
    this.addDeviceType = (item) => {
        return $http.post('./api/devicetypes/newdevice', {device: item}
        );
    };

    this.deleteById = id => {
        return $http.delete(`./api/devicetypes/${id}`);
    };

    this.editById = (id, device) => {
        return $http.put(`./api/devicetypes/${id}`,{device: device});
    };


});

app.service('brandService',function($http) {
    this.getAll = () => {
        return $http.get('./api/brands');
    };
    this.getByType = (searchType) => {
        return $http.post('./api/brands/type',{type:searchType});
    };
    this.addBrand = (item, type) => {
       // console.log(type)
       return $http.post('./api/brands/newbrand', {brand: item, devicetype: type}
       );
    };

    this.deleteById = id => {
        return $http.delete(`./api/brands/${id}`);
    };
    this.editById = (id, device) => {
        return $http.put(`./api/brands/${id}`,{device: device});
    }


});

app.service('modelService',function($http) {
    this.getAll = () => {
        return $http.get('./api/models');
    };
    this.addModel = (item,brand, type) => {
        return $http.post('./api/models/newmodel', {model: item, brand: brand, type: type}
        );
    };

    this.deleteById = id => {
        return $http.delete(`./api/models/${id}`);
    };
    this.editById = (id, device) => {
        return $http.put(`./api/models/${id}`,{device: device});
    }


});

app.service('capacityService',function($http) {
    this.getAll = () => {
        return $http.get('./api/capacities');
    };
    this.addCapacity = (capacity) => {
       // console.log(item)
       return $http.post('./api/capacities/newcapacity', {capacity: capacity}
       );
    };

    this.deleteById = id => {
        return $http.delete(`./api/capacities/${id}`);
    };

    this.editById = (id, device) => {
        return $http.put(`./api/capacities/${id}`,{device: device});
    }


});

app.service('quoteService',function($http) {
    this.getAll = () => {
        return $http.get('./api/quotes');
    };

    this.getById = (id) => {
        return $http.get(`./api/quotes/${id}`);
    };
    this.orderKit = (id, address, user) => {
        return $http.post(`./api/quotes/order/${id}`, {shippingaddress: address, user:user});
    };
    this.addQuote = (transaction,user) => {
        return $http.post('./api/quotes/newquote', {transaction: transaction, user: user});
    }
    this.deleteById = id => {
        return $http.delete(`./api/quotes/${id}`);
    };
    this.deleteFromAdminById = id => {
        return $http.delete(`./api/quotes/admin/${id}`);
    };
    this.editById = (id, newPost) => {
        return $http.put(`./api/quotes/${id}`, {item: newPost});
    }

});

app.service('transactionService',function($http) {
    this.addTransaction = (transaction,user) => {
        return $http.post('./api/users/transactions/new', {transaction: transaction, user: user});
    }

});


app.service('messageService',function($http) {
    this.getAll = () => {
        return $http.get('./api/inbox');
    };
    this.sendToAdmin = (newMessage) => {
        return $http.post('./api/inbox/newmessage',{message: newMessage});
    };
    this.sendTestimonial = (newMessage) => {
        return $http.post('./api/mail/newtestimonial',{message: newMessage});
    };
    this.sendBusinessContact = (newMessage) => {
        return $http.post('./api/mail/newbusinesscontact',{message: newMessage});
    };
    this.sendContact = (newMessage) => {
        return $http.post('./api/mail/newcontact',{message: newMessage});
    };
    this.saveTemplate = (newMessage) => {
        return $http.post('./api/mail/savetemplate',{message: newMessage});
    };
    this.getTemplate = () => {
        return $http.get('./api/mail/firsttemplate');
    };
    this.emailAdmin = (newMessage) => {
        return $http.post('./api/mail/inquiry',{message: newMessage});
    };
    this.sendConfirm = (newMessage) => {
        return $http.post('./api/mail/sendmail',{user: newMessage});
    };
    this.deleteById = id => {
        return $http.delete(`./api/inbox/${id}`);
    };
    this.editById = (id, newPost) => {
        return $http.put(`./api/inbox/${id}`, {item: newPost});
    }


});

app.service('deviceService',function($http) {
    this.getAll = () => {
        return $http.get('./api/devices');
    };
    this.getByType = (searchType) => {
        return $http.post('./api/devices/type',{type:searchType});
    };
    this.addDevice = (device, model) => {
        return $http.post('./api/devices/newdevice', {device: device, model});
    };

    this.deleteById = id => {
        return $http.delete(`./api/devices/${id}`);
    };
    this.editById = (id, newPost) => {
        return $http.put(`./api/devices/${id}`, {item: newPost});
    }


});
