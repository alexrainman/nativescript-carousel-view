"use strict";
var view = require("ui/core/view");
var dependencyObservable = require("ui/core/dependency-observable");
var proxy = require("ui/core/proxy");
var CarouselView = (function (_super) {
    __extends(CarouselView, _super);
    function CarouselView() {
        return _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CarouselView.prototype, "position", {
        get: function () {
            return this._getValue(CarouselView.positionProperty);
        },
        set: function (value) {
            this._setValue(CarouselView.positionProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CarouselView.prototype, "templateSelector", {
        get: function () {
            return this._getValue(CarouselView.templateSelectorProperty);
        },
        set: function (value) {
            this._setValue(CarouselView.templateSelectorProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CarouselView.prototype, "itemsSource", {
        get: function () {
            return this._getValue(CarouselView.itemsSourceProperty);
        },
        set: function (value) {
            this._setValue(CarouselView.itemsSourceProperty, value);
        },
        enumerable: true,
        configurable: true
    });
    CarouselView.prototype.insertPage = function (position, bindingContext) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    CarouselView.prototype.removePage = function (position) {
        return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/];
        }); });
    };
    CarouselView.prototype.setCurrentPage = function (position) { };
    return CarouselView;
}(view.View));
exports.CarouselView = CarouselView;
CarouselView.positionProperty = new dependencyObservable.Property("position", "CarouselView", new proxy.PropertyMetadata(false));
CarouselView.templateSelectorProperty = new dependencyObservable.Property("templateSelector", "CarouselView", new proxy.PropertyMetadata(false));
CarouselView.itemsSourceProperty = new dependencyObservable.Property("itemsSource", "CarouselView", new proxy.PropertyMetadata(false));
//# sourceMappingURL=carousel-view-common.js.map