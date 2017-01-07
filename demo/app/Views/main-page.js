"use strict";
var main_view_model_1 = require("../ViewModels/main-view-model");
var main_view_model_2 = require("../ViewModels/main-view-model");
var gestures = require("ui/gestures");
var frame = require('ui/frame');
// Event handler for Page "navigatingTo" event attached in main-page.xml
function navigatingTo(args) {
    // Get the event sender
    var page = args.object;
    page.bindingContext = new main_view_model_1.HelloWorldModel();
    var slider = page.getViewById("carouselView");
    slider.on("positionSelected", function (eventData) {
        console.log(eventData.eventName + " has been raised! by: " + eventData.object);
    });
    var addpage = page.getViewById("addPage");
    var observer = addpage.on(gestures.GestureTypes.tap, function (args) {
        return __awaiter(this, void 0, void 0, function () {
            var person;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        person = new main_view_model_2.Person();
                        person.first = "Alex";
                        person.last = Date.now().toString();
                        if (!(slider.itemsSource != null))
                            return [3 /*break*/, 2];
                        return [4 /*yield*/, slider.insertPage(slider.itemsSource.length, person)];
                    case 1:
                        _a.sent();
                        if (slider.itemsSource.length > 1)
                            slider.setCurrentPage(slider.itemsSource.length - 1);
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    });
}
exports.navigatingTo = navigatingTo;
function onNext(args) {
    var page = frame.topmost().currentPage;
    var slider = page.getViewById("carouselView");
    if (slider.itemsSource != null) {
        if (slider.position < slider.itemsSource.length - 1)
            slider.setCurrentPage(slider.position + 1);
    }
}
exports.onNext = onNext;
function onPrev(args) {
    var page = frame.topmost().currentPage;
    var slider = page.getViewById("carouselView");
    if (slider.itemsSource != null) {
        if (slider.position > 0)
            slider.setCurrentPage(slider.position - 1);
    }
}
exports.onPrev = onPrev;
//# sourceMappingURL=main-page.js.map