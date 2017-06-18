
function searchUtil() { }

// create a template using the above definition
searchUtil.searchresultdealtemplate = kendo.template($("#searchresultdealtemplate").html());
searchUtil.searchresultworkbooktemplate = kendo.template($("#searchresultworkbooktemplate").html());
searchUtil.searchnoresulttemplate = kendo.template($("#searchnoresulttemplate").html());
searchUtil.searchresultexacttemplate = kendo.template($("#searchresultexacttemplate").html());
searchUtil.searchresultDataSource = null;
searchUtil.init = function () {
    $(".draggable-search").draggable({ handle: ".draggable-handle" });

    $("#searchClose").on("click", function () {
        $("#header-nav-search-results").hide();
    });

    $('#quickSearch').keypress(function (e) {
        if (e.keyCode === 13) {
            //var q = $("#quickSearch").val().replace(/ /g, ";").replace(/,/g, ";").replace(/[^a-zA-Z0-9-_ ,;!\[\]\'\"]/g, '');
            var q = $("#quickSearch").val().replace(/[^a-zA-Z0-9-_ ,;!\[\]\'\"]/g, '');

            $('#header-nav-search-results-searching').show();
            $('#header-nav-search-results-container').hide();
            $("#header-nav-search-results").show();

            $("#searchField").val(q);

            var scope = angular.element(document.getElementById('searchField')).scope();
            scope.searchText = q;
            scope.searchAll();
        }
    });
}

$(document).ready(function () {
    searchUtil.init();
});
