angular.module("myApp")
    .animation(".dlc-slide-animation", dlcSlideAnimation);

//для использования данной анимации jQuery обязателен
function dlcSlideAnimation() {

    "use strict";

    var baseSlideTime = 500;

    function prepareData(element) {
        var slideTime = +element.attr("data-slide-time"),
            delay = +element.attr("data-delay"),
            buttons = element.find("button");
        if(isNaN(slideTime)) {
            slideTime = baseSlideTime;
        }
        return {
            slideTime: slideTime,
            delay: delay,
            buttons: buttons.length ? buttons : undefined
        };
    }

    return {

        addClass: function(element, className, done) {
            if(className === "ng-hide") {
                var data = prepareData(element);
                if(data.buttons) {
                    data.buttons.prop("disabled", true);
                }
                isNaN(data.delay) ? jQuery(element).slideUp(data.slideTime, done)
                    : setTimeout(function() { jQuery(element).slideUp(data.slideTime, done); }, data.delay);
            }
        },

        removeClass: function(element, className, done) {
            if(className === "ng-hide") {
                var data = prepareData(element);
                if(data.buttons) {
                    data.buttons.prop("disabled", false);
                }
                isNaN(data.delay) ? jQuery(element).slideDown(data.slideTime, done)
                    : setTimeout(function() { jQuery(element).slideDown(data.slideTime, done); }, data.delay);
            }
        }

    };
}