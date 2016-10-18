"use strict";
var common = require("./carousel-view-common");
var colorModule = require("color");
var CarouselView = (function (_super) {
    __extends(CarouselView, _super);
    function CarouselView() {
        var _this = _super.call(this) || this;
        _this._ios = new UIPageViewController(UIPageViewControllerTransitionStyle.UIPageViewControllerTransitionStyleScroll, UIPageViewControllerNavigationOrientation.UIPageViewControllerNavigationOrientationHorizontal, NSDictionary.dictionaryWithObjectForKey(UIPageViewControllerSpineLocation.UIPageViewControllerSpineLocationNone, "spineLocation"));
        var that = new WeakRef(_this);
        _this._ios.dataSource = DataSourceClass.initWithOwner(that);
        _this._ios.delegate = DelegateClass.initWithOwner(that);
        return _this;
    }
    Object.defineProperty(CarouselView.prototype, "ios", {
        get: function () {
            return this._ios.view;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CarouselView.prototype, "_nativeView", {
        // We will need this for the view to show up
        // However, if you uncomment an run with this, it will crash with:
        // -[UIPageViewController superview]: unrecognized selector sent to instance 0x7f9d21804000
        // Some of the docs linked by core team should provide a way forward 
        // Basically we need to extend UIPageViewController properly
        get: function () {
            return this._ios.view;
        },
        enumerable: true,
        configurable: true
    });
    CarouselView.prototype.onLoaded = function () {
        var firstViewController = this.createViewController(this.position);
        var direction = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
        this._ios.setViewControllersDirectionAnimatedCompletion([firstViewController], direction, false, function (arg1) { });
        var eventData = {
            eventName: "positionSelected",
            object: this
        };
        this.notify(eventData);
    };
    CarouselView.prototype.insertPage = function (position, bindingContext) {
        return __awaiter(this, void 0, void 0, function () {
            var firstViewController, direction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._ios != null))
                            return [3 /*break*/, 2];
                        if (position == -1)
                            this.itemsSource.push(bindingContext);
                        else
                            this.itemsSource.splice(position, 0, bindingContext);
                        firstViewController = this._ios.viewControllers[0];
                        direction = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
                        // can use a standard JS Array here (just type-cast to any to suffice TypeScript)
                        // {N} will auto-marshall this into a NSArray when making the call since the metadata knows its
                        // supposed to be an NSArray :)
                        this._ios.setViewControllersDirectionAnimatedCompletion([firstViewController], direction, false, function (arg1) { });
                        return [4 /*yield*/, this.delay(100)];
                    case 1:
                        _a.sent();
                        _a.label = 2;
                    case 2: return [2 /*return*/];
                }
            });
        });
    };
    CarouselView.prototype.removePage = function (position) {
        return __awaiter(this, void 0, void 0, function () {
            var newPos, forward, reverse, direction, firstViewController, firstViewController, direction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._ios != null))
                            return [3 /*break*/, 3];
                        if (!(position == this.position))
                            return [3 /*break*/, 2];
                        newPos = position - 1;
                        if (newPos == -1)
                            newPos = 0;
                        return [4 /*yield*/, this.delay(100)];
                    case 1:
                        _a.sent();
                        forward = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
                        reverse = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionReverse;
                        direction = position == 0 ? forward : reverse;
                        firstViewController = this.createViewController(newPos);
                        this._ios.setViewControllersDirectionAnimatedCompletion([firstViewController], direction, true, function (arg1) { });
                        this.position = newPos;
                        return [3 /*break*/, 3];
                    case 2:
                        firstViewController = this._ios.viewControllers[0];
                        direction = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
                        this._ios.setViewControllersDirectionAnimatedCompletion([firstViewController], direction, false, function (arg1) { });
                        _a.label = 3;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    CarouselView.prototype.setCurrentPage = function (position) {
        if (this._ios != null) {
            var forward = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
            var reverse = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionReverse;
            var direction = position > this.position ? forward : reverse;
            this.position = position;
            var firstViewController = this.createViewController(position);
            this._ios.setViewControllersDirectionAnimatedCompletion([firstViewController], direction, true, function (arg1) { });
        }
    };
    CarouselView.prototype.createViewController = function (position) {
        var item;
        if (this.itemsSource != null)
            item = this.itemsSource.getItem(position);
        var view = this.templateSelector.OnSelectTemplate(position, item);
        var obj = view;
        obj._onAttached();
        //var red = new colorModule.Color("#ff0000");
        //obj._view.backgroundColor = red.ios;
        var viewController = new ViewContainer();
        viewController.tag = position;
        viewController.view = obj.ios;
        return viewController;
    };
    CarouselView.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return CarouselView;
}(common.CarouselView));
exports.CarouselView = CarouselView;
var DataSourceClass = (function () {
    function DataSourceClass() {
    }
    Object.defineProperty(DataSourceClass.prototype, "owner", {
        get: function () {
            return this._owner.get();
        },
        enumerable: true,
        configurable: true
    });
    DataSourceClass.initWithOwner = function (owner) {
        var datasource = new DataSourceClass();
        datasource._owner = owner;
        return datasource;
    };
    DataSourceClass.prototype.pageViewControllerViewControllerBeforeViewController = function (pageViewController, viewController) {
        var controller = viewController;
        var position = controller.tag;
        // Determine if we are on the first page
        if (position == 0) {
            // We are on the first page, so there is no need for a controller before that
            return null;
        }
        else {
            var previousPageIndex = position - 1;
            return this.owner.createViewController(previousPageIndex);
        }
    };
    DataSourceClass.prototype.pageViewControllerViewControllerAfterViewController = function (pageViewController, viewController) {
        var controller = viewController;
        var position = controller.tag;
        // Determine if we are on the last page
        var count = this.presentationCountForPageViewController(pageViewController);
        if (position == count - 1) {
            // We are on the last page, so there is no need for a controller after that
            return null;
        }
        else {
            var nextPageIndex = position + 1;
            return this.owner.createViewController(nextPageIndex);
        }
    };
    DataSourceClass.prototype.presentationCountForPageViewController = function (pageViewController) {
        // FIX: populate the carousel with data after being loaded in UI
        if (this.owner.itemsSource == null)
            return 0;
        return this.owner.itemsSource.length;
    };
    DataSourceClass.prototype.presentationIndexForPageViewController = function (pageViewController) {
        return this.owner.position;
    };
    return DataSourceClass;
}());
var DelegateClass = (function () {
    function DelegateClass() {
    }
    Object.defineProperty(DelegateClass.prototype, "owner", {
        get: function () {
            return this._owner.get();
        },
        enumerable: true,
        configurable: true
    });
    DelegateClass.initWithOwner = function (owner) {
        var delegate = new DelegateClass();
        delegate._owner = owner;
        return delegate;
    };
    DelegateClass.prototype.pageViewControllerDidFinishAnimatingPreviousViewControllersTransitionCompleted = function (pageViewController, finished, previousViewControllers, completed) {
        if (finished) {
            var eventData = {
                eventName: "positionSelected",
                object: this.owner
            };
            this.owner.notify(eventData);
        }
    };
    return DelegateClass;
}());
var ViewContainer = (function (_super) {
    __extends(ViewContainer, _super);
    function ViewContainer() {
        return _super.apply(this, arguments) || this;
    }
    return ViewContainer;
}(UIViewController));
exports.ViewContainer = ViewContainer;
//# sourceMappingURL=carousel-view.ios.js.map