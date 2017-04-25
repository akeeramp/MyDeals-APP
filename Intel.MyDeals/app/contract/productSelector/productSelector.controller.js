angular
    .module('app.admin')
    .controller('ProductSelectorModalController', ProductSelectorModalController);

ProductSelectorModalController.$inject = ['$filter'];

function ProductSelectorModalController($filter) {
    var vm = this;
    vm.selectedPathParts = [];
    vm.tree = [
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Woodcrest",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Woodcrest",
     "PRD_MBR_SID": 2700,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Yorkfield6M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Yorkfield6M",
     "PRD_MBR_SID": 2790,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Atom / Rangeley",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Atom",
     "FMLY_NM": "Rangeley",
     "PRD_MBR_SID": 38097,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Atom / Avoton",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Atom",
     "FMLY_NM": "Avoton",
     "PRD_MBR_SID": 38060,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / IPP / IvyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "IPP",
     "FMLY_NM": "IvyBridge",
     "PRD_MBR_SID": 38513,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / IPP / SandyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "IPP",
     "FMLY_NM": "SandyBridge",
     "PRD_MBR_SID": 38568,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / IPP / Bay Trail",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "IPP",
     "FMLY_NM": "Bay Trail",
     "PRD_MBR_SID": 38447,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / IPP / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "IPP",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 38480,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / IPP / Wolfdale2M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "IPP",
     "FMLY_NM": "Wolfdale2M",
     "PRD_MBR_SID": 38656,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / IPP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "IPP",
     "FMLY_NM": null,
     "PRD_MBR_SID": 38446,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / IPP / Conroe1M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "IPP",
     "FMLY_NM": "Conroe1M",
     "PRD_MBR_SID": 38463,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / IPP / Clarkdale",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "IPP",
     "FMLY_NM": "Clarkdale",
     "PRD_MBR_SID": 38452,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / IPP / Wolfdale1M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "IPP",
     "FMLY_NM": "Wolfdale1M",
     "PRD_MBR_SID": 38652,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Ci7",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Ci7",
     "FMLY_NM": null,
     "PRD_MBR_SID": 39849,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Ci5 / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Ci5",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 39845,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Ci7 / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Ci7",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 39850,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / SandyBridge-EN",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "SandyBridge-EN",
     "PRD_MBR_SID": 26525,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / SandyBridge-EP4S",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "SandyBridge-EP4S",
     "PRD_MBR_SID": 26845,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci5 / IvyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci5",
     "FMLY_NM": "IvyBridge",
     "PRD_MBR_SID": 27279,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci3 / IvyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci3",
     "FMLY_NM": "IvyBridge",
     "PRD_MBR_SID": 27407,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom / Penwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": "Penwell",
     "PRD_MBR_SID": 27654,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci3 / Gladden",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci3",
     "FMLY_NM": "Gladden",
     "PRD_MBR_SID": 28776,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / IPP / Gladden",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "IPP",
     "FMLY_NM": "Gladden",
     "PRD_MBR_SID": 28780,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / IPP / IvyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "IPP",
     "FMLY_NM": "IvyBridge",
     "PRD_MBR_SID": 28944,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / PDC / IvyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "PDC",
     "FMLY_NM": "IvyBridge",
     "PRD_MBR_SID": 29027,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Gladden",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Gladden",
     "PRD_MBR_SID": 28924,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom / Cloverview",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": "Cloverview",
     "PRD_MBR_SID": 29678,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / PDC / SandyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "PDC",
     "FMLY_NM": "SandyBridge",
     "PRD_MBR_SID": 17421,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Westmere-EX-MP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Westmere-EX-MP",
     "PRD_MBR_SID": 17461,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / SandyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "SandyBridge",
     "PRD_MBR_SID": 17318,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / SandyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "SandyBridge",
     "PRD_MBR_SID": 18107,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom / Pineview-DC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": "Pineview-DC",
     "PRD_MBR_SID": 6173,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / _ / ThermalSolution",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "_",
     "FMLY_NM": "ThermalSolution",
     "PRD_MBR_SID": 6518,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / _",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "_",
     "FMLY_NM": null,
     "PRD_MBR_SID": 6517,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci5 / SandyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci5",
     "FMLY_NM": "SandyBridge",
     "PRD_MBR_SID": 6820,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Rebate",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Rebate",
     "FMLY_NM": null,
     "PRD_MBR_SID": 6899,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Rebate / Dollars",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Rebate",
     "FMLY_NM": "Dollars",
     "PRD_MBR_SID": 6916,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / I/O products / UPSD",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "I/O products",
     "PRD_CAT_NM": "UPSD",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7601,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Network / DHG/SPD",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Network",
     "PRD_CAT_NM": "DHG/SPD",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7605,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Software / Software / IA SW/Service",
     "MarkLevel1": "Software",
     "MarkLevel2": "Software",
     "PRD_CAT_NM": "IA SW/Service",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7614,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Cable Modems and Media Gateways / Cable Modem",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Cable Modems and Media Gateways",
     "PRD_CAT_NM": "Cable Modem",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7616,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Ethernet and I/O products / NIC",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Ethernet and I/O products",
     "PRD_CAT_NM": "NIC",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7618,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Rebate / Dollars",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Rebate",
     "FMLY_NM": "Dollars",
     "PRD_MBR_SID": 6900,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Chipset / Chipset / EIA CS",
     "MarkLevel1": "Chipset",
     "MarkLevel2": "Chipset",
     "PRD_CAT_NM": "EIA CS",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7602,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Embedded / EIA MISC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Embedded",
     "PRD_CAT_NM": "EIA MISC",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7603,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / Merom-SC-NR",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "Merom-SC-NR",
     "PRD_MBR_SID": 6617,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci5 / SandyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci5",
     "FMLY_NM": "SandyBridge",
     "PRD_MBR_SID": 10138,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": " / PCG MISC",
     "MarkLevel1": null,
     "MarkLevel2": null,
     "PRD_CAT_NM": "PCG MISC",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7606,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile Communications / IMC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile Communications",
     "PRD_CAT_NM": "IMC",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7611,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Server / Server / EPSD",
     "MarkLevel1": "Server",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "EPSD",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7600,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Network / ECPD EMD",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Network",
     "PRD_CAT_NM": "ECPD EMD",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7604,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci7 / SandyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci7",
     "FMLY_NM": "SandyBridge",
     "PRD_MBR_SID": 6844,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Memory and Storage / Memory / NAND",
     "MarkLevel1": "Memory and Storage",
     "MarkLevel2": "Memory",
     "PRD_CAT_NM": "NAND",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7607,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": " / FMG",
     "MarkLevel1": null,
     "MarkLevel2": null,
     "PRD_CAT_NM": "FMG",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7609,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": " / Other",
     "MarkLevel1": null,
     "MarkLevel2": null,
     "PRD_CAT_NM": "Other",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7610,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci7 / SandyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci7",
     "FMLY_NM": "SandyBridge",
     "PRD_MBR_SID": 6836,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Rebate",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Rebate",
     "FMLY_NM": null,
     "PRD_MBR_SID": 6877,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Fabric / TCD",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Fabric",
     "PRD_CAT_NM": "TCD",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7613,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Rebate / Dollars",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Rebate",
     "FMLY_NM": "Dollars",
     "PRD_MBR_SID": 6878,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": " / ECG",
     "MarkLevel1": null,
     "MarkLevel2": null,
     "PRD_CAT_NM": "ECG",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7608,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Software / Software / World Ahead",
     "MarkLevel1": "Software",
     "MarkLevel2": "Software",
     "PRD_CAT_NM": "World Ahead",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7615,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci3 / SandyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci3",
     "FMLY_NM": "SandyBridge",
     "PRD_MBR_SID": 10144,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": " / SMART PHONE",
     "MarkLevel1": null,
     "MarkLevel2": null,
     "PRD_CAT_NM": "SMART PHONE",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7612,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci3 / SandyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci3",
     "FMLY_NM": "SandyBridge",
     "PRD_MBR_SID": 10347,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Rebate",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Rebate",
     "FMLY_NM": null,
     "PRD_MBR_SID": 6915,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Ethernet and I/O products / LOM",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Ethernet and I/O products",
     "PRD_CAT_NM": "LOM",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 7617,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1653,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / IPF / Tukwila",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "IPF",
     "FMLY_NM": "Tukwila",
     "PRD_MBR_SID": 1891,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / C2X / Penryn-DC-MV",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "C2X",
     "FMLY_NM": "Penryn-DC-MV",
     "PRD_MBR_SID": 1482,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci3 / Arrandale",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci3",
     "FMLY_NM": "Arrandale",
     "PRD_MBR_SID": 1516,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / Merom-SC-SR",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "Merom-SC-SR",
     "PRD_MBR_SID": 1673,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICPm",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICPm",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1714,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / C2D / Penryn-DC-SR",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "C2D",
     "FMLY_NM": "Penryn-DC-SR",
     "PRD_MBR_SID": 1399,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / IPF / Montecito",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "IPF",
     "FMLY_NM": "Montecito",
     "PRD_MBR_SID": 1824,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / PDC / Penryn-DC-MV",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "PDC",
     "FMLY_NM": "Penryn-DC-MV",
     "PRD_MBR_SID": 1770,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / PSC / Penryn-SC-MV",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "PSC",
     "FMLY_NM": "Penryn-SC-MV",
     "PRD_MBR_SID": 1819,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci7",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci7",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1583,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Harpertown",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Harpertown",
     "PRD_MBR_SID": 2083,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 64663,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / XP / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "XP",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 64734,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci3 / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci3",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 66035,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICP / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICP",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 66045,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Broadwell-EP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Broadwell-EP",
     "PRD_MBR_SID": 66879,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": " / PCG MISC / NA",
     "MarkLevel1": null,
     "MarkLevel2": null,
     "PRD_CAT_NM": "PCG MISC",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85004,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Server / Server / EPSD / NA",
     "MarkLevel1": "Server",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "EPSD",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85018,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Embedded / EIA MISC / NA",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Embedded",
     "PRD_CAT_NM": "EIA MISC",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85023,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Wireless / WC / NA / NA",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Wireless",
     "PRD_CAT_NM": "WC",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85001,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Ethernet and I/O products / LOM / NA",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Ethernet and I/O products",
     "PRD_CAT_NM": "LOM",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85010,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Server / Server / EPSD / NA / NA",
     "MarkLevel1": "Server",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "EPSD",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85012,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Software / Software / World Ahead / NA",
     "MarkLevel1": "Software",
     "MarkLevel2": "Software",
     "PRD_CAT_NM": "World Ahead",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85035,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Chipset / Chipset / EIA CS / NA",
     "MarkLevel1": "Chipset",
     "MarkLevel2": "Chipset",
     "PRD_CAT_NM": "EIA CS",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85014,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Software / Software / IA SW/Service / NA / NA",
     "MarkLevel1": "Software",
     "MarkLevel2": "Software",
     "PRD_CAT_NM": "IA SW/Service",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85016,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Software / Software / IA SW/Service / NA",
     "MarkLevel1": "Software",
     "MarkLevel2": "Software",
     "PRD_CAT_NM": "IA SW/Service",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85031,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Network / ECPD EMD / NA",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Network",
     "PRD_CAT_NM": "ECPD EMD",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85046,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Chipset / Chipset / CS / NA / NA",
     "MarkLevel1": "Chipset",
     "MarkLevel2": "Chipset",
     "PRD_CAT_NM": "CS",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85036,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile Communications / IMC / NA / NA",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile Communications",
     "PRD_CAT_NM": "IMC",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85039,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / I/O products / UPSD / NA / NA",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "I/O products",
     "PRD_CAT_NM": "UPSD",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85040,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": " / PCG MISC / NA / NA",
     "MarkLevel1": null,
     "MarkLevel2": null,
     "PRD_CAT_NM": "PCG MISC",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85060,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Cable Modems and Media Gateways / Cable Modem / NA",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Cable Modems and Media Gateways",
     "PRD_CAT_NM": "Cable Modem",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85047,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Chipset / Chipset / EIA CS / NA / NA",
     "MarkLevel1": "Chipset",
     "MarkLevel2": "Chipset",
     "PRD_CAT_NM": "EIA CS",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85049,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Fabric / TCD / NA",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Fabric",
     "PRD_CAT_NM": "TCD",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85009,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Chipset / Chipset / CS / NA",
     "MarkLevel1": "Chipset",
     "MarkLevel2": "Chipset",
     "PRD_CAT_NM": "CS",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85034,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / I/O products / UPSD / NA",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "I/O products",
     "PRD_CAT_NM": "UPSD",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85003,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Memory and Storage / Memory / NAND / NA / NA",
     "MarkLevel1": "Memory and Storage",
     "MarkLevel2": "Memory",
     "PRD_CAT_NM": "NAND",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85042,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Memory and Storage / SSD / NAND (SSD) / NA",
     "MarkLevel1": "Memory and Storage",
     "MarkLevel2": "SSD",
     "PRD_CAT_NM": "NAND (SSD)",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85045,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Ethernet and I/O products / LAD / NA / NA",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Ethernet and I/O products",
     "PRD_CAT_NM": "LAD",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85052,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Embedded / EIA CPU / NA",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Embedded",
     "PRD_CAT_NM": "EIA CPU",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85025,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Embedded / EIA CPU / NA / NA",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Embedded",
     "PRD_CAT_NM": "EIA CPU",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85032,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile Communications / IMC / NA",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile Communications",
     "PRD_CAT_NM": "IMC",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85024,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Network / DHG/SPD / NA / NA",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Network",
     "PRD_CAT_NM": "DHG/SPD",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85056,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Memory and Storage / Memory / NAND / NA",
     "MarkLevel1": "Memory and Storage",
     "MarkLevel2": "Memory",
     "PRD_CAT_NM": "NAND",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85021,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Ethernet and I/O products / NIC / NA / NA",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Ethernet and I/O products",
     "PRD_CAT_NM": "NIC",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85011,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": " / SMART PHONE / NA",
     "MarkLevel1": null,
     "MarkLevel2": null,
     "PRD_CAT_NM": "SMART PHONE",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85026,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": " / SMART PHONE / NA / NA",
     "MarkLevel1": null,
     "MarkLevel2": null,
     "PRD_CAT_NM": "SMART PHONE",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85028,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Cable Modems and Media Gateways / Cable Modem / NA / NA",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Cable Modems and Media Gateways",
     "PRD_CAT_NM": "Cable Modem",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85055,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Network / DHG/SPD / NA",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Network",
     "PRD_CAT_NM": "DHG/SPD",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85048,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom / Cedarview",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": "Cedarview",
     "PRD_MBR_SID": 22886,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / SandyBridge-EP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "SandyBridge-EP",
     "PRD_MBR_SID": 23420,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Atom / Cedarview",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Atom",
     "FMLY_NM": "Cedarview",
     "PRD_MBR_SID": 22879,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / IvyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "IvyBridge",
     "PRD_MBR_SID": 26182,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci7 / IvyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci7",
     "FMLY_NM": "IvyBridge",
     "PRD_MBR_SID": 26271,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci7 / IvyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci7",
     "FMLY_NM": "IvyBridge",
     "PRD_MBR_SID": 26121,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci5 / IvyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci5",
     "FMLY_NM": "IvyBridge",
     "PRD_MBR_SID": 26252,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci3 / IvyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci3",
     "FMLY_NM": "IvyBridge",
     "PRD_MBR_SID": 26398,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / IPP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "IPP",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1761,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Nehalem-EP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Nehalem-EP",
     "PRD_MBR_SID": 2300,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / PSC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "PSC",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1818,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1911,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Clarkdale",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Clarkdale",
     "PRD_MBR_SID": 1912,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Conroe2M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Conroe2M",
     "PRD_MBR_SID": 1979,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Harpertown-UP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Harpertown-UP",
     "PRD_MBR_SID": 2238,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Nehalem-EX-DP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Nehalem-EX-DP",
     "PRD_MBR_SID": 2383,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Nehalem-WS-DP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Nehalem-WS-DP",
     "PRD_MBR_SID": 2426,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Dunnington",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Dunnington",
     "PRD_MBR_SID": 2050,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Conroe4M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Conroe4M",
     "PRD_MBR_SID": 1988,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / C2Q / Kentsfield",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "C2Q",
     "FMLY_NM": "Kentsfield",
     "PRD_MBR_SID": 238,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICPD / Cedar_Mill",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICPD",
     "FMLY_NM": "Cedar_Mill",
     "PRD_MBR_SID": 605,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci7 / Gulftown",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci7",
     "FMLY_NM": "Gulftown",
     "PRD_MBR_SID": 493,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Atom / Diamondville-SC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Atom",
     "FMLY_NM": "Diamondville-SC",
     "PRD_MBR_SID": 22,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / C2D / Wolfdale6M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "C2D",
     "FMLY_NM": "Wolfdale6M",
     "PRD_MBR_SID": 158,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / C2D / Conroe4M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "C2D",
     "FMLY_NM": "Conroe4M",
     "PRD_MBR_SID": 76,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci7",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci7",
     "FMLY_NM": null,
     "PRD_MBR_SID": 441,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / C2Q / Yorkfield4M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "C2Q",
     "FMLY_NM": "Yorkfield4M",
     "PRD_MBR_SID": 284,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Atom / Pineview-SC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Atom",
     "FMLY_NM": "Pineview-SC",
     "PRD_MBR_SID": 33,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / C2Q / Yorkfield12M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "C2Q",
     "FMLY_NM": "Yorkfield12M",
     "PRD_MBR_SID": 250,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Embedded / EIA CPU",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Embedded",
     "PRD_CAT_NM": "EIA CPU",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 13,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci5 / Clarkdale",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci5",
     "FMLY_NM": "Clarkdale",
     "PRD_MBR_SID": 383,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 10,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / C2D / Wolfdale3M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "C2D",
     "FMLY_NM": "Wolfdale3M",
     "PRD_MBR_SID": 103,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci5 / Kaby Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci5",
     "FMLY_NM": "Kaby Lake",
     "PRD_MBR_SID": 75082,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci7 / Kaby Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci7",
     "FMLY_NM": "Kaby Lake",
     "PRD_MBR_SID": 75086,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci3 / Kaby Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci3",
     "FMLY_NM": "Kaby Lake",
     "PRD_MBR_SID": 75078,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / M3 / Kaby Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "M3",
     "FMLY_NM": "Kaby Lake",
     "PRD_MBR_SID": 75118,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / Apollo Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "Apollo Lake",
     "PRD_MBR_SID": 75417,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom / Baytrail",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": "Baytrail",
     "PRD_MBR_SID": 75933,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / IPP / Apollo Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "IPP",
     "FMLY_NM": "Apollo Lake",
     "PRD_MBR_SID": 76208,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / IPP / Apollo Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "IPP",
     "FMLY_NM": "Apollo Lake",
     "PRD_MBR_SID": 75400,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICP / Apollo Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICP",
     "FMLY_NM": "Apollo Lake",
     "PRD_MBR_SID": 76199,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICP / Conroe-L",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICP",
     "FMLY_NM": "Conroe-L",
     "PRD_MBR_SID": 543,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom / Silverthorne",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": "Silverthorne",
     "PRD_MBR_SID": 1144,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom / Diamondville-SC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": "Diamondville-SC",
     "PRD_MBR_SID": 1105,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom / Pineview-SC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": "Pineview-SC",
     "PRD_MBR_SID": 1131,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / C2S",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "C2S",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1469,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / CD / Yonah-DC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "CD",
     "FMLY_NM": "Yonah-DC",
     "PRD_MBR_SID": 1496,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / C2D / Merom-DC-SR",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "C2D",
     "FMLY_NM": "Merom-DC-SR",
     "PRD_MBR_SID": 1197,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci3",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci3",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1515,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci7 / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci7",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 56650,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Xeon / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Xeon",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 57241,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / M7_Vpro / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "M7_Vpro",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 57345,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / IPP / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "IPP",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 57322,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / E3 / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "E3",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 57477,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci5 / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci5",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 57274,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / M5 / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "M5",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 57335,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / M5_Vpro / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "M5_Vpro",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 57340,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 57315,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / E3",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "E3",
     "FMLY_NM": null,
     "PRD_MBR_SID": 57476,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci3 / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci3",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 57270,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / M7_Vpro",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "M7_Vpro",
     "FMLY_NM": null,
     "PRD_MBR_SID": 57344,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci7 / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci7",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 57234,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / M5",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "M5",
     "FMLY_NM": null,
     "PRD_MBR_SID": 57334,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / M3",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "M3",
     "FMLY_NM": null,
     "PRD_MBR_SID": 57329,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / M3 / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "M3",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 57330,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / M5_Vpro",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "M5_Vpro",
     "FMLY_NM": null,
     "PRD_MBR_SID": 57339,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / XP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "XP",
     "FMLY_NM": null,
     "PRD_MBR_SID": 59449,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Tigerton",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Tigerton",
     "PRD_MBR_SID": 2498,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Tulsa",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Tulsa",
     "PRD_MBR_SID": 2514,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Nehalem-EX-MP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Nehalem-EX-MP",
     "PRD_MBR_SID": 2393,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Paxville-(MP)",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Paxville-(MP)",
     "PRD_MBR_SID": 2479,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Nehalem-WS-UP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Nehalem-WS-UP",
     "PRD_MBR_SID": 2437,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Wolfdale-UP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Wolfdale-UP",
     "PRD_MBR_SID": 2673,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Westmere-EP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Westmere-EP",
     "PRD_MBR_SID": 2550,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Wolfdale-DP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Wolfdale-DP",
     "PRD_MBR_SID": 2622,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Ci7 / IvyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Ci7",
     "FMLY_NM": "IvyBridge",
     "PRD_MBR_SID": 63433,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / IPP / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "IPP",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 64469,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICP",
     "FMLY_NM": null,
     "PRD_MBR_SID": 537,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / PD",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "PD",
     "FMLY_NM": null,
     "PRD_MBR_SID": 851,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / PD / Presler",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "PD",
     "FMLY_NM": "Presler",
     "PRD_MBR_SID": 852,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / P4 / Cedar_Mill",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "P4",
     "FMLY_NM": "Cedar_Mill",
     "PRD_MBR_SID": 696,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / P4 / Prescott6xx",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "P4",
     "FMLY_NM": "Prescott6xx",
     "PRD_MBR_SID": 807,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICP / Wolfdale1M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICP",
     "FMLY_NM": "Wolfdale1M",
     "PRD_MBR_SID": 582,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Haswell-EX",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Haswell-EX",
     "PRD_MBR_SID": 54324,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / Braswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "Braswell",
     "PRD_MBR_SID": 54971,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / IPP / Braswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "IPP",
     "FMLY_NM": "Braswell",
     "PRD_MBR_SID": 54978,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Broadwell-DE",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Broadwell-DE",
     "PRD_MBR_SID": 55383,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / IPP / Braswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "IPP",
     "FMLY_NM": "Braswell",
     "PRD_MBR_SID": 55630,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICP / Braswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICP",
     "FMLY_NM": "Braswell",
     "PRD_MBR_SID": 55623,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci7 / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci7",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 56341,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci5 / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci5",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 56328,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Ci5 / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Ci5",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 56229,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Ci7 / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Ci7",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 56233,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 56490,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci5 / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci5",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 56646,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / C2D / Conroe2M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "C2D",
     "FMLY_NM": "Conroe2M",
     "PRD_MBR_SID": 41,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / C2Q / Yorkfield6M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "C2Q",
     "FMLY_NM": "Yorkfield6M",
     "PRD_MBR_SID": 324,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / C2E / Kentsfield",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "C2E",
     "FMLY_NM": "Kentsfield",
     "PRD_MBR_SID": 209,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Chipset / Chipset / CS",
     "MarkLevel1": "Chipset",
     "MarkLevel2": "Chipset",
     "PRD_CAT_NM": "CS",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 12,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / C2Q",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "C2Q",
     "FMLY_NM": null,
     "PRD_MBR_SID": 237,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Memory and Storage / SSD / NAND (SSD)",
     "MarkLevel1": "Memory and Storage",
     "MarkLevel2": "SSD",
     "PRD_CAT_NM": "NAND (SSD)",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 15,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / C2D",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "C2D",
     "FMLY_NM": null,
     "PRD_MBR_SID": 40,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICPD / Prescott",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICPD",
     "FMLY_NM": "Prescott",
     "PRD_MBR_SID": 621,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Ethernet and I/O products / LAD",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Ethernet and I/O products",
     "PRD_CAT_NM": "LAD",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 14,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Wireless / WC",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Wireless",
     "PRD_CAT_NM": "WC",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 16,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / P4 / Prescott",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "P4",
     "FMLY_NM": "Prescott",
     "PRD_MBR_SID": 717,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / C2S / Penryn-SC-MV",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "C2S",
     "FMLY_NM": "Penryn-SC-MV",
     "PRD_MBR_SID": 1470,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / C2D / Merom-DC-NR",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "C2D",
     "FMLY_NM": "Merom-DC-NR",
     "PRD_MBR_SID": 1179,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci5",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci5",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1540,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / C2X / Penryn-QC-MV",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "C2X",
     "FMLY_NM": "Penryn-QC-MV",
     "PRD_MBR_SID": 1491,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / IPP / Arrandale",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "IPP",
     "FMLY_NM": "Arrandale",
     "PRD_MBR_SID": 1762,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICPm / Yonah-SC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICPm",
     "FMLY_NM": "Yonah-SC",
     "PRD_MBR_SID": 1745,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Lynnfield",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Lynnfield",
     "PRD_MBR_SID": 2264,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / PM",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "PM",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1786,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / IPF / Montvale",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "IPF",
     "FMLY_NM": "Montvale",
     "PRD_MBR_SID": 1869,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / C2Q",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "C2Q",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1459,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / CD",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "CD",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1495,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / C2X",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "C2X",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1481,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / X1 / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "X1",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 49013,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / X1",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "X1",
     "FMLY_NM": null,
     "PRD_MBR_SID": 49012,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / X4",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "X4",
     "FMLY_NM": null,
     "PRD_MBR_SID": 49020,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / X4 / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "X4",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 49021,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Core_M_Vpro / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Core_M_Vpro",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 49878,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Core_M / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Core_M",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 49870,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Core_M_Vpro",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Core_M_Vpro",
     "FMLY_NM": null,
     "PRD_MBR_SID": 49877,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Core_M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Core_M",
     "FMLY_NM": null,
     "PRD_MBR_SID": 49869,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom / Lincroft",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": "Lincroft",
     "PRD_MBR_SID": 1112,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / C2D / Penryn-DC-MV",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "C2D",
     "FMLY_NM": "Penryn-DC-MV",
     "PRD_MBR_SID": 1216,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / PDC / Clarkdale",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "PDC",
     "FMLY_NM": "Clarkdale",
     "PRD_MBR_SID": 972,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1104,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / PDC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "PDC",
     "FMLY_NM": null,
     "PRD_MBR_SID": 971,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / PDC / Wolfdale1M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "PDC",
     "FMLY_NM": "Wolfdale1M",
     "PRD_MBR_SID": 1014,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci7 / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci7",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 33322,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci5 / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci5",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 33492,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci7 / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci7",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 33517,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 33548,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci5 / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci5",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 34389,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / IvyBridge-EP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "IvyBridge-EP",
     "PRD_MBR_SID": 34618,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci3 / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci3",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 34478,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Ci5",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Ci5",
     "FMLY_NM": null,
     "PRD_MBR_SID": 39844,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Xeon",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Xeon",
     "FMLY_NM": null,
     "PRD_MBR_SID": 43052,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Xeon / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Xeon",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 43053,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / IPP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "IPP",
     "FMLY_NM": null,
     "PRD_MBR_SID": 43803,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / IPP / SandyBridge-EN",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "IPP",
     "FMLY_NM": "SandyBridge-EN",
     "PRD_MBR_SID": 43808,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / IPP / IvyBridge-EN",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "IPP",
     "FMLY_NM": "IvyBridge-EN",
     "PRD_MBR_SID": 43804,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom / Merrifield",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": "Merrifield",
     "PRD_MBR_SID": 44221,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Haswell-EP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Haswell-EP",
     "PRD_MBR_SID": 44786,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom / Moorefield",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": "Moorefield",
     "PRD_MBR_SID": 45029,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Atom / Denverton",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Atom",
     "FMLY_NM": "Denverton",
     "PRD_MBR_SID": 79581,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / M7 / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "M7",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 80295,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / M7",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "M7",
     "FMLY_NM": null,
     "PRD_MBR_SID": 80294,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom / Apollo Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": "Apollo Lake",
     "PRD_MBR_SID": 80311,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / SP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "SP",
     "FMLY_NM": null,
     "PRD_MBR_SID": 82011,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / SP / Skylake-SP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "SP",
     "FMLY_NM": "Skylake-SP",
     "PRD_MBR_SID": 82012,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Phi / Knights Landing",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Phi",
     "FMLY_NM": "Knights Landing",
     "PRD_MBR_SID": 73454,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Broadwell-EX",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Broadwell-EX",
     "PRD_MBR_SID": 73158,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Westmere-WS-UP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Westmere-WS-UP",
     "PRD_MBR_SID": 2616,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Yorkfield12M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Yorkfield12M",
     "PRD_MBR_SID": 2758,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Westmere-EX-DP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Westmere-EX-DP",
     "PRD_MBR_SID": 17886,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICP / SandyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICP",
     "FMLY_NM": "SandyBridge",
     "PRD_MBR_SID": 18168,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / IPP / SandyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "IPP",
     "FMLY_NM": "SandyBridge",
     "PRD_MBR_SID": 18287,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / C2E",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "C2E",
     "FMLY_NM": null,
     "PRD_MBR_SID": 208,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci3 / Clarkdale",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci3",
     "FMLY_NM": "Clarkdale",
     "PRD_MBR_SID": 358,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Atom",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Atom",
     "FMLY_NM": null,
     "PRD_MBR_SID": 30710,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Ci3",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Ci3",
     "FMLY_NM": null,
     "PRD_MBR_SID": 30739,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom / Bondi",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": "Bondi",
     "PRD_MBR_SID": 30699,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Atom / Briarwood",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Atom",
     "FMLY_NM": "Briarwood",
     "PRD_MBR_SID": 30711,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / IvyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "IvyBridge",
     "PRD_MBR_SID": 30523,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / IPF / Poulson",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "IPF",
     "FMLY_NM": "Poulson",
     "PRD_MBR_SID": 30221,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Atom / Centerton",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Atom",
     "FMLY_NM": "Centerton",
     "PRD_MBR_SID": 30721,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Phi / Knights Corner",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Phi",
     "FMLY_NM": "Knights Corner",
     "PRD_MBR_SID": 31437,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICP / IvyBridge",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICP",
     "FMLY_NM": "IvyBridge",
     "PRD_MBR_SID": 31314,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Ci3 / Gladden",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Ci3",
     "FMLY_NM": "Gladden",
     "PRD_MBR_SID": 30740,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / Gladden",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "Gladden",
     "PRD_MBR_SID": 31197,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Phi",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Phi",
     "FMLY_NM": null,
     "PRD_MBR_SID": 31436,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci5",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci5",
     "FMLY_NM": null,
     "PRD_MBR_SID": 382,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / PDC / Conroe1M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "PDC",
     "FMLY_NM": "Conroe1M",
     "PRD_MBR_SID": 984,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci3",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci3",
     "FMLY_NM": null,
     "PRD_MBR_SID": 357,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Broadwell-EP4S",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Broadwell-EP4S",
     "PRD_MBR_SID": 69088,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / C2Q / Penryn-QC-MV",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "C2Q",
     "FMLY_NM": "Penryn-QC-MV",
     "PRD_MBR_SID": 1460,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / CS",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "CS",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1645,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / CS / Yonah-SC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "CS",
     "FMLY_NM": "Yonah-SC",
     "PRD_MBR_SID": 1646,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Clovertown",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Clovertown",
     "PRD_MBR_SID": 1919,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / C2X / Penryn-DC-SR",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "C2X",
     "FMLY_NM": "Penryn-DC-SR",
     "PRD_MBR_SID": 1487,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / PM / Dothan",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "PM",
     "FMLY_NM": "Dothan",
     "PRD_MBR_SID": 1787,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICPm / Dothan",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICPm",
     "FMLY_NM": "Dothan",
     "PRD_MBR_SID": 1715,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / Arrandale",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "Arrandale",
     "PRD_MBR_SID": 1654,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Kentsfield",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Kentsfield",
     "PRD_MBR_SID": 2254,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci5 / Arrandale",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci5",
     "FMLY_NM": "Arrandale",
     "PRD_MBR_SID": 1541,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / Penryn-DC-MV",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "Penryn-DC-MV",
     "PRD_MBR_SID": 1680,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / Merom-SC-L-SR",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "Merom-SC-L-SR",
     "PRD_MBR_SID": 1666,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / IPF",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "IPF",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1823,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci7 / Arrandale",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci7",
     "FMLY_NM": "Arrandale",
     "PRD_MBR_SID": 1584,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci7 / Clarksfield",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci7",
     "FMLY_NM": "Clarksfield",
     "PRD_MBR_SID": 1620,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / PDC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "PDC",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1769,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci5 / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci5",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 51830,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci7 / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci7",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 51839,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Haswell-EN",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Haswell-EN",
     "PRD_MBR_SID": 51633,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 51846,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / IPP / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "IPP",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 51977,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Ci3 / Broadwell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Ci3",
     "FMLY_NM": "Broadwell",
     "PRD_MBR_SID": 51878,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom / Cherry Trail",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": "Cherry Trail",
     "PRD_MBR_SID": 52237,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Xeon / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Xeon",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 52496,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Xeon",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Xeon",
     "FMLY_NM": null,
     "PRD_MBR_SID": 52495,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Haswell-EP4S",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Haswell-EP4S",
     "PRD_MBR_SID": 53301,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / C2E / Yorkfield12M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "C2E",
     "FMLY_NM": "Yorkfield12M",
     "PRD_MBR_SID": 219,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 9,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICP / Clarkdale",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICP",
     "FMLY_NM": "Clarkdale",
     "PRD_MBR_SID": 538,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Atom / Diamondville-DC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Atom",
     "FMLY_NM": "Diamondville-DC",
     "PRD_MBR_SID": 18,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICP / Conroe512K-DC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICP",
     "FMLY_NM": "Conroe512K-DC",
     "PRD_MBR_SID": 561,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci7 / Bloomfield",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci7",
     "FMLY_NM": "Bloomfield",
     "PRD_MBR_SID": 442,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / P4",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "P4",
     "FMLY_NM": null,
     "PRD_MBR_SID": 695,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / PD / Smithfield",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "PD",
     "FMLY_NM": "Smithfield",
     "PRD_MBR_SID": 936,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICPD",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICPD",
     "FMLY_NM": null,
     "PRD_MBR_SID": 604,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci5 / Lynnfield",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci5",
     "FMLY_NM": "Lynnfield",
     "PRD_MBR_SID": 428,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / PDC / Wolfdale2M",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "PDC",
     "FMLY_NM": "Wolfdale2M",
     "PRD_MBR_SID": 1023,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / IvyBridge-EP4S",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "IvyBridge-EP4S",
     "PRD_MBR_SID": 35439,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / Atom / Bay Trail",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "Atom",
     "FMLY_NM": "Bay Trail",
     "PRD_MBR_SID": 35725,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 35874,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / IPP / Bay Trail",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "IPP",
     "FMLY_NM": "Bay Trail",
     "PRD_MBR_SID": 35688,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICP / Bay Trail",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICP",
     "FMLY_NM": "Bay Trail",
     "PRD_MBR_SID": 35787,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Pentium",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Pentium",
     "FMLY_NM": null,
     "PRD_MBR_SID": 35817,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / IPP / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "IPP",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 35984,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / Bay Trail",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "Bay Trail",
     "PRD_MBR_SID": 35681,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Ivy Gladden",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Ivy Gladden",
     "PRD_MBR_SID": 35822,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci3 / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci3",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 36117,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Pentium / Ivy Gladden",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Pentium",
     "FMLY_NM": "Ivy Gladden",
     "PRD_MBR_SID": 35818,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / PDC / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "PDC",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 36132,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / PDC / Bay Trail",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "PDC",
     "FMLY_NM": "Bay Trail",
     "PRD_MBR_SID": 35794,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / IvyBridge-EN",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "IvyBridge-EN",
     "PRD_MBR_SID": 36082,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / Rebate / Knights Corner",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "Rebate",
     "FMLY_NM": "Knights Corner",
     "PRD_MBR_SID": 36607,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICP / Haswell",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICP",
     "FMLY_NM": "Haswell",
     "PRD_MBR_SID": 36782,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / IvyBridge-EX-DP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "IvyBridge-EX-DP",
     "PRD_MBR_SID": 36861,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / IvyBridge-EX",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "IvyBridge-EX",
     "PRD_MBR_SID": 36821,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Network / ECPD EMD / NA / NA",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Network",
     "PRD_CAT_NM": "ECPD EMD",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85002,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Memory and Storage / SSD / NAND (SSD) / NA / NA",
     "MarkLevel1": "Memory and Storage",
     "MarkLevel2": "SSD",
     "PRD_CAT_NM": "NAND (SSD)",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85027,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Ethernet and I/O products / NIC / NA",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Ethernet and I/O products",
     "PRD_CAT_NM": "NIC",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85015,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Ethernet and I/O products / LOM / NA / NA",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Ethernet and I/O products",
     "PRD_CAT_NM": "LOM",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85030,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Ethernet and I/O products / LAD / NA",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Ethernet and I/O products",
     "PRD_CAT_NM": "LAD",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85006,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Fabric / TCD / NA / NA",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Fabric",
     "PRD_CAT_NM": "TCD",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85029,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Software / Software / World Ahead / NA / NA",
     "MarkLevel1": "Software",
     "MarkLevel2": "Software",
     "PRD_CAT_NM": "World Ahead",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85033,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Embedded / EIA MISC / NA / NA",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Embedded",
     "PRD_CAT_NM": "EIA MISC",
     "BRND_NM": "NA",
     "FMLY_NM": "NA",
     "PRD_MBR_SID": 85053,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Network and I/O / Wireless / WC / NA",
     "MarkLevel1": "Network and I/O",
     "MarkLevel2": "Wireless",
     "PRD_CAT_NM": "WC",
     "BRND_NM": "NA",
     "FMLY_NM": null,
     "PRD_MBR_SID": 85062,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / XP / Skylake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "XP",
     "FMLY_NM": "Skylake",
     "PRD_MBR_SID": 59450,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": null,
     "FMLY_NM": null,
     "PRD_MBR_SID": 11,
     "DSPLY_LVL_NM": "Category"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci7 / Lynnfield",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci7",
     "FMLY_NM": "Lynnfield",
     "PRD_MBR_SID": 504,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / C2D",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "C2D",
     "FMLY_NM": null,
     "PRD_MBR_SID": 1178,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Atom",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Atom",
     "FMLY_NM": null,
     "PRD_MBR_SID": 17,
     "DSPLY_LVL_NM": "Brand"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Atom / Pineview-DC",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Atom",
     "FMLY_NM": "Pineview-DC",
     "PRD_MBR_SID": 26,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / Penryn-SC-MV",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "Penryn-SC-MV",
     "PRD_MBR_SID": 1699,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Dempsey",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Dempsey",
     "PRD_MBR_SID": 2006,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / ICP / Kaby Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "ICP",
     "FMLY_NM": "Kaby Lake",
     "PRD_MBR_SID": 76916,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Kaby Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Kaby Lake",
     "PRD_MBR_SID": 77422,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci5 / Kaby Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci5",
     "FMLY_NM": "Kaby Lake",
     "PRD_MBR_SID": 77551,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / IPP / Kaby Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "IPP",
     "FMLY_NM": "Kaby Lake",
     "PRD_MBR_SID": 76923,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Mobile / Mb / XP / Kaby Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Mobile",
     "PRD_CAT_NM": "Mb",
     "BRND_NM": "XP",
     "FMLY_NM": "Kaby Lake",
     "PRD_MBR_SID": 77621,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Server / SvrWS / XP / Skylake-SP",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Server",
     "PRD_CAT_NM": "SvrWS",
     "BRND_NM": "XP",
     "FMLY_NM": "Skylake-SP",
     "PRD_MBR_SID": 77761,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci7 / Kaby Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci7",
     "FMLY_NM": "Kaby Lake",
     "PRD_MBR_SID": 77573,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / ICP / Kaby Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "ICP",
     "FMLY_NM": "Kaby Lake",
     "PRD_MBR_SID": 78242,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / Ci3 / Kaby Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "Ci3",
     "FMLY_NM": "Kaby Lake",
     "PRD_MBR_SID": 78226,
     "DSPLY_LVL_NM": "Family"
 },
 {
     "FULL_NAME_HASH": "Processors / Desktop / DT / IPP / Kaby Lake",
     "MarkLevel1": "Processors",
     "MarkLevel2": "Desktop",
     "PRD_CAT_NM": "DT",
     "BRND_NM": "IPP",
     "FMLY_NM": "Kaby Lake",
     "PRD_MBR_SID": 78160,
     "DSPLY_LVL_NM": "Family"
 }
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
}