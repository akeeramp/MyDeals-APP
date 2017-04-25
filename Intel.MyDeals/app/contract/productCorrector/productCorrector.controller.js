angular
    .module('app.admin')
    .controller('ProductCorrectorModalController', ProductCorrectorModalController);

ProductCorrectorModalController.$inject = ['$filter'];

function ProductCorrectorModalController($filter) {
    var vm = this;
    vm.selectedPathParts = [];
    vm.tree = [
    ];
    vm.items = [];
    
    var getItems = function (item) {
        if (vm.selectedPathParts.length == 0) {
            var markLevel1 = $filter('unique')(vm.tree, 'MarkLevel1');
            vm.items = markLevel1.map((i) => {
                return {
                    name: i.MarkLevel1,
                    path: i.MarkLevel1
                }
            });
            return;
        }
        if (vm.selectedPathParts.length == 1) {
            var markLevel2 = $filter('where')(vm.tree, { 'MarkLevel1': item.name });
            markLevel2 = $filter('unique')(markLevel2, 'MarkLevel2')
            vm.items = markLevel2.map((i) => {
                return {
                    name: i.MarkLevel2,
                    path: i.MarkLevel2
                }
            });
            return;
        }

        if (vm.selectedPathParts.length == 2) {
            var markLevel2 = $filter('where')(vm.tree, { 'MarkLevel1': vm.selectedPathParts[0], 'MarkLevel2': item.name, DSPLY_LVL_NM: 'Brand' });
            markLevel2 = $filter('unique')(markLevel2, 'BRND_NM');
            vm.items = markLevel2.map((i) => {
                return {
                    name: i.BRND_NM,
                    path: i.FULL_NAME_HASH
                }
            });
            return;
        }

        if (vm.selectedPathParts.length == 3) {
            var brandName = vm.tree.filter((i) => {
                return i.FULL_NAME_HASH.startsWith(item.path + ' / ') && i.DSPLY_LVL_NM == 'Family';
            });
            brandName = $filter('unique')(brandName, 'FMLY_NM');
            vm.items = brandName.map((i) => {
                return {
                    name: i.FMLY_NM,
                    path: i.FULL_NAME_HASH
                }
            });
            return;
        }
    }

    vm.selectItem = function (item) {
        vm.selectedPathParts.push(item.name);
        getItems(item);
    }

    vm.selectPath = function (index) {
        vm.selectedPathParts.splice(index, vm.selectedPathParts.length);
        var item = {
            'name': vm.selectedPathParts[vm.selectedPathParts.length - 1],
            'path': vm.selectedPathParts.join(' / ')
        }
        getItems(item);
    }

    getItems();

    vm.closeModal = function () {
        dialog.close();
    }
    
}