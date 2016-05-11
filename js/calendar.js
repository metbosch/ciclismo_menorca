angular.module("materialExample", ["ngMaterial", "materialCalendar"]);
angular.module("materialExample").controller("calendarCtrl", function($scope, $filter, $http, $q) {

    $scope.downloadedEvents = {};

    $scope.dayFormat = "d";

    // To select a single date, make sure the ngModel is not an array.
    $scope.selectedDate = new Date();
    $scope.selectedDateKey = "";

    $scope.firstDayOfWeek = 1; // First day of the week, 0 for Sunday, 1 for Monday, etc.
    $scope.setDirection = function(direction) {
      $scope.direction = direction;
      $scope.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
    };

    $scope.dayClick = function(date) {
        $scope.selectedDateKey = [(date.getDate()), (date.getMonth()+1), date.getFullYear()].join("-");
    };

    $scope.prevMonth = function(data) {
    };

    $scope.nextMonth = function(data) {
    };

    $scope.tooltips = false;
    $scope.setDayContent = function(date) {
        var key = [(date.getDate()), (date.getMonth()+1), date.getFullYear()].join("-");
        var baseUrl = "data/" + date.getFullYear() + "/" + (date.getMonth() + 1) + "/" + (date.getDate());
        var url = baseUrl + "/events.json";

        if ($scope.downloadedEvents[key] == []) return "<p></p>";

        // You would inject any HTML you wanted for
        // that particular date here.
        //return "<p></p>";

        // You could also use an $http function directly.
        // return $http.get("/some/external/api");

        // You could also use a promise.
        var deferred = $q.defer();
        $http.get(url)
        .success(function successCallback(data, status, headers, config) {
            $scope.downloadedEvents[key] = data;
            var str = "";
            data.forEach(function(ev, idx) {
                str += "<p>" + ev.nom + "</p>";
                if (!ev.img) {
                   $scope.downloadedEvents[key][idx].img = baseUrl + "/event" + idx + ".png";
                } else {
                   $scope.downloadedEvents[key][idx].img = baseUrl + "/" + ev.img;
                }
                $scope.downloadedEvents[key][idx].link = "event" + idx;
                if (ev.archivos) {
                   ev.archivos.forEach(function(file, fileIdx) {
                       if (file.link.indexOf("http") === -1 && file.link.indexOf("https") === -1 &&
                           file.link.indexOf("HTTP") === -1 && file.link.indexOf("HTTPS") === -1) {
                          $scope.downloadedEvents[key][idx].archivos[fileIdx].link = baseUrl + "/" + file.link;
                       }
                   });
                }
            });
            deferred.resolve(str);
        })
        .error(function errorCallback(data, status, headers, config) {
            deferred.resolve("<p></p>");
            $scope.downloadedEvents[key] = [];
        });
        return deferred.promise;

    };

    $scope.downloadEvents = function(month, year) {
        var daysInMonth = new Date(year, month, 0).getDate();
        if ($scope.downloadedEvents[month + "-" + year] === daysInMonth) return;
        $scope.downloadedEvents[month + "-" + year] = 0;
        for (var day = 1; day <= daysInMonth; ++day) {
            $http.get(url)
            .success(function successCallback(data, status, headers, config) {
                $scope.downloadedEvents[month + "-" + year] += 1;
                console.log(config.url + "->" + data);
            })
            .error(function errorCallback(data, status, headers, config) {
                $scope.downloadedEvents[month + "-" + year] += 1;
            });
        }
    };
});
