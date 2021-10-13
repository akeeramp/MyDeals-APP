export class gridUtils {
    constructor() {
    }

    static cancelChanges (e) {
        $(e.sender.table).closest(".k-grid").data('kendoGrid').dataSource.cancelChanges();
    }
    static clearAllFiltersToolbar = function () {
        return '<a role="button" class="k-button k-button-icontext" href="\\#" onClick="gridUtils.clearAllFilters()"><span class="k-icon intelicon-cancel-filter-solid"></span>CLEAR FILTERS</a>';
    }
    static boolViewer = function (field) {
        return "<toggle size='btn-sm' ng-model='dataItem." + field + "' ng-disabled='true'></toggle>";
    }
    static inLineClearAllFiltersToolbar = function () {
        var rtn = '';
        rtn += '<a role="button" class="k-button k-button-icontext k-grid-add" href="\\#" onClick="gridUtils.clearAllFiltersAndSorts()"><span class="k-icon k-i-plus"></span>Add new record</a> ';
        rtn += '<a role="button" class="k-button k-button-icontext" href="\\#" onClick="gridUtils.clearAllFilters()"><span class="k-icon intelicon-cancel-filter-solid"></span>CLEAR FILTERS</a>';
        return rtn;
    }
    static boolEditor = function (container, options) {
        $("<toggle size='btn-sm' field='" + options.field + "' ng-model='dataItem." + options.field + "' ></toggle>").appendTo(container);
    }

}