angular.module("myApp")
    .service("arrayHelperService", arrayHelperService);

function arrayHelperService() {

    "use strict";

    this.deleteOneByProperty = function(arr, property, value) {
        if(value !== undefined) {
            for (var i = 0, lh = arr.length; i < lh; i++) {
                if (arr[i][property] === value) {
                    arr.splice(i, 1);
                    break;
                }
            }
        }
    };

    this.changeOneByPropertyAndSort = function(arr, newElemValue, property, sortProp) {
        for(var i = 0, lh = arr.length; i < lh; i++) {
            if(arr[i][property] === newElemValue[property]) {
                angular.copy(newElemValue, arr[i]);
                break;
            }
        }
        arr.sort(function(a, b) {
            return b[sortProp]- a[sortProp];
        });
    };

    this.addByProperty = function(arr, newElem, property) {
        var lh = arr.length;
        if(!lh || newElem[property] <= arr[lh-1][property]) {
            arr.push(newElem);
        }
        else {
            for(var i = 0; i < lh; i++) {
                if(newElem[property] > arr[i][property]) {
                    arr.splice(i, 0, newElem);
                    break;
                }
            }
        }
    };

    this.createGroupsFromArray = function(items, groupedBy) {
        if (items) {
            var newItems = [],
                nit = [],
                ct = 0;
            for(var i=0; i<items.length; i++) {
                if(i%groupedBy === 0 && i !== 0) {
                    newItems[ct] = angular.copy(nit);
                    ct++;
                    nit = [];
                }
                nit.push(items[i]);
            }
            newItems[ct] = angular.copy(nit);
            return newItems;
        }
    };

    this.groupByProperty = function(data, property) {
        var newData = [],
            lh = data.length,
            i = 0;
        while(i < lh) {
            var group = {
                propertyName: property,
                propertyValue: data[i][property],
                data: [data[i++]],
            };
            newData.push(group);
            while(i < lh && data[i][property] === data[i-1][property]) {
                group.data.push(data[i]);
                i++;
            }
        }
        return newData;
    };

}