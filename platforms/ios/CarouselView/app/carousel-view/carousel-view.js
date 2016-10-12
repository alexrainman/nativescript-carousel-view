"use strict";
var common = require("./carousel-view-common");
var CarouselView = (function (_super) {
    __extends(CarouselView, _super);
    function CarouselView() {
        var _this = _super.call(this) || this;
        _this._ios = new UIPageViewController(UIPageViewControllerTransitionStyle.UIPageViewControllerTransitionStyleScroll, UIPageViewControllerNavigationOrientation.UIPageViewControllerNavigationOrientationHorizontal, NSDictionary.dictionaryWithObjectForKey(UIPageViewControllerSpineLocation.UIPageViewControllerSpineLocationNone, "spineLocation"));
        /*this._ios = UIPageViewController.alloc().initWithTransitionStyleNavigationOrientationOptions(
            UIPageViewControllerTransitionStyle.UIPageViewControllerTransitionStyleScroll,
            UIPageViewControllerNavigationOrientation.UIPageViewControllerNavigationOrientationHorizontal,
            NSDictionary.dictionaryWithObjectForKey(UIPageViewControllerSpineLocation.UIPageViewControllerSpineLocationNone, "spineLocation"));*/
        var that = new WeakRef(_this);
        _this._ios.dataSource = DataSourceClass.initWithOwner(that);
        _this._ios.delegate = new DelegateClass();
        return _this;
        /*var eventData: observable.EventData = {
            eventName: "positionSelected",
            object: this
        }
        this.notify(eventData);*/
    }
    Object.defineProperty(CarouselView.prototype, "ios", {
        get: function () {
            return this._ios;
        },
        enumerable: true,
        configurable: true
    });
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
                        this._ios.setViewControllersDirectionAnimatedCompletion(new NSArray(firstViewController), direction, false, function (arg1) { });
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
                        this._ios.setViewControllersDirectionAnimatedCompletion(new NSArray(firstViewController), direction, true, function (arg1) { });
                        this.position = newPos;
                        return [3 /*break*/, 3];
                    case 2:
                        firstViewController = this._ios.viewControllers[0];
                        direction = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
                        this._ios.setViewControllersDirectionAnimatedCompletion(new NSArray(firstViewController), direction, false, function (arg1) { });
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
            this._ios.setViewControllersDirectionAnimatedCompletion(new NSArray(firstViewController), direction, true, function (arg1) { });
        }
    };
    CarouselView.prototype.createViewController = function (position) {
        var item;
        if (this.itemsSource != null)
            item = this.itemsSource.getItem(position);
        var view = this.templateSelector.OnSelectTemplate(position, item);
        var obj = view;
        //obj._onAttached();
        var viewController = new ViewContainer();
        viewController.tag = position;
        //viewController.view = obj.ios;
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
    /*constructor(owner: WeakRef<CarouselView>)
    {
        this._owner = owner;
    }*/
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
            var owner = this._owner.get();
            return owner.createViewController(previousPageIndex);
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
            var owner = this._owner.get();
            return owner.createViewController(nextPageIndex);
        }
    };
    DataSourceClass.prototype.presentationCountForPageViewController = function (pageViewController) {
        var owner = this._owner.get();
        // FIX: populate the carousel with data after being loaded in UI
        if (owner.itemsSource == null)
            return 0;
        return owner.itemsSource.length;
    };
    DataSourceClass.prototype.presentationIndexForPageViewController = function (pageViewController) {
        var owner = this._owner.get();
        return owner.position;
    };
    return DataSourceClass;
}());
var DelegateClass = (function () {
    function DelegateClass() {
    }
    DelegateClass.prototype.pageViewControllerDidFinishAnimatingPreviousViewControllersTransitionCompleted = function (pageViewController, finished, previousViewControllers, completed) {
    };
    return DelegateClass;
}());
exports.DelegateClass = DelegateClass;
/*export class PageViewController extends UIPageViewController implements UIPageViewControllerDataSource
{
    private _owner: WeakRef<CarouselView>;

    get owner(): CarouselView {
        return this._owner.get();
    }

    public static initWithOwner(owner: WeakRef<CarouselView>): PageViewController {
        let controller = new PageViewController(
            UIPageViewControllerTransitionStyle.UIPageViewControllerTransitionStyleScroll,
            UIPageViewControllerNavigationOrientation.UIPageViewControllerNavigationOrientationHorizontal,
            NSDictionary.dictionaryWithObjectForKey(UIPageViewControllerSpineLocation.UIPageViewControllerSpineLocationNone, "spineLocation"))
        controller._owner = owner;
        return controller;
    }

    viewDidLoad() {

        super.viewDidLoad();

        this.dataSource = this;
        
        var firstViewController = this.createViewController(this.owner.position);
        var direction = UIPageViewControllerNavigationDirection.UIPageViewControllerNavigationDirectionForward;
        this.setViewControllersDirectionAnimatedCompletion (new NSArray(firstViewController), direction, false, (arg1) => {});
    }

    public createViewController(position: number) : UIViewController
   {
       var item;
        if (this.owner.itemsSource != null)
            item = this.owner.itemsSource.getItem(position);

        var view = this.owner.templateSelector.OnSelectTemplate(position, item);
        var obj = <any>view;
        //obj._onAttached();

        var viewController = new ViewContainer();
        viewController.tag = position;
        //viewController.view = obj.ios;

        return viewController;
    }

    pageViewControllerViewControllerBeforeViewController(pageViewController: UIPageViewController, viewController: UIViewController): UIViewController
    {
        var controller = <ViewContainer>viewController;
        var position = controller.tag;

        // Determine if we are on the first page
        if (position == 0)
        {
            // We are on the first page, so there is no need for a controller before that
            return null;
        }
        else {
            var previousPageIndex = position - 1;
            return this.owner.createViewController(previousPageIndex);
        }
    }

    pageViewControllerViewControllerAfterViewController(pageViewController: UIPageViewController, viewController: UIViewController): UIViewController
    {
        var controller = <ViewContainer>viewController;
        var position = controller.tag;

        // Determine if we are on the last page
        var count = this.presentationCountForPageViewController(pageViewController);
        if (position == count - 1)
        {
            // We are on the last page, so there is no need for a controller after that
            return null;
        }
        else {
            var nextPageIndex = position + 1;
            return this.owner.createViewController(nextPageIndex);
        }
    }

    presentationCountForPageViewController?(pageViewController: UIPageViewController): number
    {
        // FIX: populate the carousel with data after being loaded in UI
        if (this.owner.itemsSource == null)
            return 0;
        return this.owner.itemsSource.length;
    }

    presentationIndexForPageViewController?(pageViewController: UIPageViewController): number
    {
        return this.owner.position;
    }
}*/
var ViewContainer = (function (_super) {
    __extends(ViewContainer, _super);
    function ViewContainer() {
        return _super.apply(this, arguments) || this;
    }
    ViewContainer.prototype.viewDidLoad = function () {
        _super.prototype.viewDidLoad.call(this);
    };
    return ViewContainer;
}(UIViewController));
exports.ViewContainer = ViewContainer;
//# sourceMappingURL=carousel-view.js.map