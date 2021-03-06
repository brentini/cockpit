(function($){

    App.module.controller("gallery", function($scope, $rootScope, $http){

        var id = $("[data-ng-controller='gallery']").data("id");


        if(id) {

            $http.post(App.route("/api/galleries/findOne"), {filter: {"_id":id}}, {responseType:"json"}).success(function(data){

                if(data && Object.keys(data).length) {
                    $scope.gallery = data;
                }

            }).error(App.module.callbacks.error.http);

        } else {

            $scope.gallery = {
                name: "",
                images: []
            };
        }

        $scope.save = function() {

            var gallery = angular.copy($scope.gallery);

            $http.post(App.route("/api/galleries/save"), {"gallery": gallery}).success(function(data){

                if(data && Object.keys(data).length) {
                    $scope.gallery = data;
                    App.notify(App.i18n.get("Gallery saved!"));
                }

            }).error(App.module.callbacks.error.http);
        };

        $scope.importFromFolder = function(){

            new PathPicker(function(path){

                if(String(path).match(/\.(jpg|png|gif)$/i)){
                    $scope.$apply(function(){
                        $scope.gallery.images.push({"path":path, data:{}});
                    });
                } else {

                    $.post(App.route('/mediamanager/api'), {"cmd":"ls", "path": String(path).replace("site:", "")}, function(data){

                        if (data && data.files && data.files.length) {

                            data.files.forEach(function(file) {
                                if(file.name.match(/\.(jpg|png|gif)$/i)) {
                                    $scope.gallery.images.push({"path":"site:"+file.path, data:{}});
                                }
                            });

                            $scope.$apply();
                        }

                    }, "json");
                }

            }, "*");
        };

        $scope.selectImage = function(){

            new PathPicker(function(path){
                $scope.$apply(function(){
                    $scope.gallery.images.push({"path":path, data:{}});
                });
            }, "*.(jpg|png|gif)");
        };

        $scope.removeImage = function(index) {

            if(confirm(App.i18n.get("Are you sure?"))){
                $scope.gallery.images.splice(index, 1);
            }
        };

        $scope.imgurl = function(image) {
            return image.path.replace('site:', window.COCKPIT_SITE_BASE_URL);
        };

        var imglist = $("#images-list");

        imglist.on("dragend", "[draggable]",function(){

            var images = [];

            imglist.children().each(function(){
                images.push(angular.copy($(this).scope().image));
            });

            $scope.$apply(function(){
                $scope.gallery.images = images;
            });
        });

        nativesortable(imglist[0]);
    });

})(jQuery);