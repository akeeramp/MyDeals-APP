(function () {
	'use strict';
	angular
        .module('blocks.secUtil')
        .factory('SecUtil', SecUtil);

	SecUtil.$inject = [];

	function SecUtil() {

		return {
			ChkAtrbRulesBase: ChkAtrbRulesBase
			, ConvertHexToBin: ConvertHexToBin
			, ConvertBinStringToHex: ConvertBinStringToHex
		}
		

		function ChkAtrbRulesBase(permissionMask, secActionObj) {
			var allowedActions = [];
			var reverseSecurityMask = permissionMask.split('.').reverse();

			for (var a = 0; a < secActionObj.length; a++) {
				if (reverseSecurityMask.length < secActionObj[a].ATRB_MAGNITUDE) return allowedActions;

				var binVal = ConvertHexToBin(reverseSecurityMask[secActionObj[a].ATRB_MAGNITUDE]);
				var revBinVal = binVal.split('').reverse();

				if (revBinVal.length < secActionObj[a].ATRB_BIT) return allowedActions;

				if (revBinVal[secActionObj[a].ATRB_BIT] === '1') allowedActions.push(secActionObj[a].ATRB_CD);
			}
			return allowedActions;
		}
		
		function ConvertHexToBin(hex) {
			var base = "0000000000000000";
			var convertBase = function (num) {
				return {
					from: function (baseFrom) {
						return {
							to: function (baseTo) {
								return parseInt(num, baseFrom).toString(baseTo);
							}
						};
					}
				};
			};
			var val = convertBase(hex).from(16).to(2);
			return (base + val).slice(-1 * base.length);
		}

		function ConvertBinStringToHex(binString) {
			var s2 = '', c;
			for (var i = 0, l = binString.length; i < l; ++i) {
				c = binString.charCodeAt(i);
				s2 += (c >> 4).toString(16);
				s2 += (c & 0xF).toString(16);
			}
			return s2;
		}
	}
})();
