
function searchUtil() { }

// create a template using the above definition
searchUtil.searchresultdealtemplate = kendo.template($("#searchresultdealtemplate").html());
searchUtil.searchresultworkbooktemplate = kendo.template($("#searchresultworkbooktemplate").html());
searchUtil.searchnoresulttemplate = kendo.template($("#searchnoresulttemplate").html());
searchUtil.searchresultexacttemplate = kendo.template($("#searchresultexacttemplate").html());
searchUtil.searchresultDataSource = null;
searchUtil.init = function () {
    $(".draggable-search").draggable({ handle: ".draggable-handle" });

    searchUtil.searchresultDataSource = new kendo.data.DataSource({
        type: "api",
        transport: {
            read: {
                url: "/api/Search/v1/Search/",
                dataType: "json"
            }
        },
        error: function (result) {
            util.error(result, "Unable to run Search");
            return false;
        },
        change: function (e) {
            var data = this.data()[0];
            if (data.Deals.length === 0 && data.Workbooks.length === 0) {
                $("#header-nav-search-results-container").html(searchUtil.searchnoresulttemplate);
            } else if ((data.Deals.length + data.Workbooks.length) === 1) {
                $("#header-nav-search-results-container").html("<ul id='searchPanelBar'><li class='k-state-active'>Deals<div style='padding: 6px;'>" + kendo.render(searchUtil.searchresultexacttemplate, this.view()) + "</div></li></ul>");
                $("#searchPanelBar").kendoPanelBar({
                    expandMode: "single"
                });
                if (data.Deals.length === 1)
                    document.location.href = "/DealDetails/" + dealUtil.safeDealId(data.Deals[0].DealNbr) + "/Primary";
                else {
                    document.location.href = "/WorkBook/SearchBy/" + data.Workbooks[0].WB_ID;
                }
            } else {
                var resultDeals = (this.view()[0].Deals.length > 0)
                    ? "<li class='k-state-active'>Deals<div style='padding: 6px;'>" + kendo.render(searchUtil.searchresultdealtemplate, this.view()[0].Deals) + "</div></li>"
                    : "";
                var resultWorkbooks = (this.view()[0].Workbooks.length > 0)
                    ? "<li class='k-state-active'>Workbooks<div style='padding: 6px;'>" + kendo.render(searchUtil.searchresultworkbooktemplate, this.view()[0].Workbooks) + "</div></li>"
                    : "";
                $("#header-nav-search-results-container").html("<ul id='searchPanelBar'>" + resultDeals + resultWorkbooks + "</ul>");
                $("#searchPanelBar").kendoPanelBar({
                    expandMode: "single"
                });

                $(".searchresultitem").on("click", function () {
                    var dealNum = $(this).find('input').first().val();
                    document.location.href = "/DealDetails/" + dealUtil.safeDealId(dealNum) + "/Primary";
                });
                $(".searchresultwbitem").on("click", function () {
                    var wbNum = $(this).find('input').first().val();
                    document.location.href = "/Workbook/SearchBy/" + wbNum;
                });

            }
            $('#header-nav-search-results-searching').hide();
            $("#header-nav-search-results-container").show();
            $("#header-nav-search-results").show();

        },
        schema: {
            model: {
                fields: {
                    DealNbr: { type: "int" },
                    DealType: { type: "string" },
                    Stage: { type: "string" },
                    StartDate: { type: "datetime" },
                    EndDate: { type: "datetime" },
                    Customer: { type: "string" }
                }
            }
        }
    });

    $("#searchClose").on("click", function () {
        $("#header-nav-search-results").hide();
    });

    $('#quickSearch').keypress(function (e) {
        if (e.keyCode === 13) {
            $('#header-nav-search-results-searching').show();
            $('#header-nav-search-results-container').hide();
            $("#header-nav-search-results").show();

            var q = $("#quickSearch").val().replace(/ /g, ";").replace(/,/g, ";").replace(/[^a-zA-Z0-9-_,;!\[\]\'\"]/g, '');
            searchUtil.searchresultDataSource.transport.options.read.url = "/api/Search/v1/Search/" + q;
            searchUtil.searchresultDataSource.read();
        } else {
            //$("#quickSearch").val($("#quickSearch").val().replace(/[^a-zA-Z0-9-_,;]/g, ''));
        }
    });
}

$(document).ready(function () {
    searchUtil.init();
});
