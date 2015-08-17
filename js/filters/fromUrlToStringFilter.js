angular.module("myApp")
    .filter("fromUrlToString", fromUrlToStringFtr);

/*
* Данный фильтр преобразует название вида bla-super в bla super,
* Противоположность ему - фильтр urlLikeFilter
* */
function fromUrlToStringFtr() {

    "use strict";

    return function(value) {
        if(value) {
            var newValue = value.toLowerCase();
            newValue = newValue.replace(/\-/i, ' ');
            return decodeURIComponent(newValue);
        }
    };

}