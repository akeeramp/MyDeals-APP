(function () {
    'use strict';

    angular
        .module('app.core')
        .directive('moveablemodal', moveablemodal);

    moveablemodal.$inject = ['$document'];

    function moveablemodal($document) {
        return function (scope, element) {
            var startX = 0,
              startY = 0,
              x = 0,
              y = 0;
            element = angular.element(document.getElementsByClassName("modal"));

            // listen to mouse events only on cursor area, else it will be a snake game.
            var cursorArea = angular.element(document.getElementsByClassName("cursorArea"));

            element.css({
                position: 'fixed',
            });

            cursorArea.css({
                cursor: "move"
            });

            cursorArea.on('mousedown', function (event) {
                // Prevent default dragging of selected content
                event.preventDefault();
                startX = event.screenX - x;
                startY = event.screenY - y;
                $document.on('mousemove', mousemove);
                $document.on('mouseup', mouseup);
            });

            function mousemove(event) {
                y = event.screenY - startY;
                x = event.screenX - startX;
                if (x == 0 && y == 0) return;
                element.css({
                    top: y + 'px',
                    left: x + 'px',
                });
            }

            function mouseup() {
                $document.unbind('mousemove', mousemove);
                $document.unbind('mouseup', mouseup);
            }
        };
    }
})();