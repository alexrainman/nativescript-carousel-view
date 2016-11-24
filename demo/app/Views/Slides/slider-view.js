"use strict";
var frame = require('ui/frame');
function onLoaded(args) {
    console.log('slide loaded');
}
exports.onLoaded = onLoaded;
function buttonTap(args) {
    return __awaiter(this, void 0, void 0, function () {
        var page, slider;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    page = frame.topmost().currentPage;
                    slider = page.getViewById("carouselView");
                    return [4 /*yield*/, slider.removePage(slider.position)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.buttonTap = buttonTap;
function labelTap(args) {
    console.log('label tap from code behind');
}
exports.labelTap = labelTap;
function stackTap(args) {
    console.log('stack tap from code behind');
}
exports.stackTap = stackTap;
//# sourceMappingURL=slider-view.js.map