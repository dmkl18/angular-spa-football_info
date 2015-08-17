angular.module("myApp")
    .filter("urlLike", urlLikeFtr);

function urlLikeFtr() {

    "use strict";

    return function(value) {
        if(value) {
            var newValue = value.toLowerCase();
            newValue = newValue.replace(/\s/i, '-');
            return encodeURIComponent(newValue);
        }
    };

}