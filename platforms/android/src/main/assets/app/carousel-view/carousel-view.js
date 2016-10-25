"use strict";
var application = require("application");
var common = require("./carousel-view-common");
var VIEWS_STATES = "_viewStates";
var CarouselView = (function (_super) {
    __extends(CarouselView, _super);
    function CarouselView() {
        return _super.apply(this, arguments) || this;
    }
    Object.defineProperty(CarouselView.prototype, "android", {
        get: function () {
            return this._android;
        },
        enumerable: true,
        configurable: true
    });
    CarouselView.prototype._createUI = function () {
        this._android = new android.support.v4.view.ViewPager(this._context);
        //this._android = new verticalViewPager(this._context);
        this._android.setPageMargin(this.interPageSpacing * 2);
    };
    CarouselView.prototype.onLoaded = function () {
        var that = new WeakRef(this);
        ensurePagerAdapterClass();
        this._android.setAdapter(new PagerAdapterClass(this));
        ensurePageChangedListenerClass();
        this._android.setOnPageChangeListener(new PageChangedListenerClass(this));
        this._android.setCurrentItem(this.position, false);
        var eventData = {
            eventName: "positionSelected",
            object: this
        };
        this.notify(eventData);
    };
    CarouselView.prototype.insertPage = function (position, bindingContext) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._android != null))
                            return [3 /*break*/, 2];
                        if (position > this.itemsSource.length)
                            position = this.itemsSource.length;
                        if (position < 0)
                            position = 0;
                        if (position == this.itemsSource.length)
                            this.itemsSource.push(bindingContext);
                        else
                            this.itemsSource.splice(position, 0, bindingContext);
                        if (position > 2)
                            this._android.getAdapter().notifyDataSetChanged();
                        else
                            this._android.setAdapter(new PagerAdapterClass(this));
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
            var newPos;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!(this._android != null))
                            return [3 /*break*/, 6];
                        if (position > this.itemsSource.length - 1)
                            position = this.itemsSource.length - 1;
                        if (position < 0)
                            position = 0;
                        if (!(position == this.position))
                            return [3 /*break*/, 5];
                        newPos = position - 1;
                        if (newPos == -1)
                            newPos = 0;
                        if (!(position == 0))
                            return [3 /*break*/, 2];
                        this._android.setCurrentItem(1, true);
                        return [4 /*yield*/, this.delay(100)];
                    case 1:
                        _a.sent();
                        this.itemsSource.splice(position, 1);
                        this._android.setAdapter(new PagerAdapterClass(this));
                        //this._android.getAdapter().notifyDataSetChanged (); 
                        this._android.setCurrentItem(0, false);
                        this.position = 0;
                        return [3 /*break*/, 4];
                    case 2:
                        this._android.setCurrentItem(newPos, true);
                        return [4 /*yield*/, this.delay(100)];
                    case 3:
                        _a.sent();
                        this.itemsSource.splice(position, 1);
                        if (position == 1)
                            this._android.setAdapter(new PagerAdapterClass(this));
                        else
                            this._android.getAdapter().notifyDataSetChanged();
                        this.position = newPos;
                        _a.label = 4;
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        this.itemsSource.splice(position, 1);
                        if (position == 1)
                            this._android.setAdapter(new PagerAdapterClass(this));
                        else
                            this._android.getAdapter().notifyDataSetChanged();
                        _a.label = 6;
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    CarouselView.prototype.setCurrentPage = function (position) {
        if (this._android != null) {
            if (position > this.itemsSource.length - 1)
                position = this.itemsSource.length - 1;
            if (position < 0)
                position = 0;
            this.position = position;
            this._android.setCurrentItem(position, true);
        }
    };
    CarouselView.prototype.itemsSourceChanged = function () {
        if (this.position > this.itemsSource.length - 1)
            this.position = this.itemsSource.length - 1;
        ensurePagerAdapterClass();
        this._android.setAdapter(new PagerAdapterClass(this));
        this._android.setCurrentItem(this.position, false);
        var eventData = {
            eventName: "positionSelected",
            object: this
        };
        this.notify(eventData);
    };
    CarouselView.prototype.delay = function (ms) {
        return new Promise(function (resolve) { return setTimeout(resolve, ms); });
    };
    return CarouselView;
}(common.CarouselView));
exports.CarouselView = CarouselView;
var PagerAdapterClass;
function ensurePagerAdapterClass() {
    if (PagerAdapterClass) {
        return;
    }
    var PagerAdapterInner = (function (_super) {
        __extends(PagerAdapterInner, _super);
        function PagerAdapterInner(_owner) {
            var _this = _super.call(this) || this;
            _this._owner = _owner;
            return global.__native(_this);
        }
        PagerAdapterInner.prototype.getCount = function () {
            // FIX: populate the carousel with data after being loaded in UI
            if (this._owner.itemsSource == null)
                return 0;
            return this._owner.itemsSource.length;
        };
        PagerAdapterInner.prototype.isViewFromObject = function (view, objectValue) {
            return view === objectValue;
        };
        PagerAdapterInner.prototype.instantiateItem = function (container, position) {
            // FIX: populate the carousel with data after being loaded in UI
            var item;
            if (this._owner.itemsSource != null)
                item = this._owner.itemsSource.getItem(position);
            var view = this._owner.templateSelector.OnSelectTemplate(position, item);
            var obj = view;
            obj._onAttached(application.android.currentContext);
            obj.android.tag = position;
            if (this[VIEWS_STATES]) {
                obj.android.restoreHierarchyState(this[VIEWS_STATES]);
            }
            container.addView(obj.android);
            return obj.android;
        };
        PagerAdapterInner.prototype.destroyItem = function (container, position, objectValue) {
            var pager = container;
            pager.removeView(objectValue);
        };
        PagerAdapterInner.prototype.getItemPosition = function (objectValue) {
            var tag = Number(objectValue.getTag());
            var position = this._owner.position;
            if (tag == position)
                return tag;
            return android.support.v4.view.PagerAdapter.POSITION_NONE;
        };
        PagerAdapterInner.prototype.saveState = function () {
            if (!this[VIEWS_STATES]) {
                this[VIEWS_STATES] = new android.util.SparseArray();
            }
            var mViewStates = this[VIEWS_STATES];
            var mViewPager = this._owner.android;
            var count = mViewPager.getChildCount();
            for (var i = 0; i < count; i++) {
                var c = mViewPager.getChildAt(i);
                if (c.isSaveFromParentEnabled()) {
                    c.saveHierarchyState(mViewStates);
                }
            }
            var bundle = new android.os.Bundle();
            bundle.putSparseParcelableArray(VIEWS_STATES, mViewStates);
            return bundle;
        };
        PagerAdapterInner.prototype.restoreState = function (state, loader) {
            var bundle = state;
            bundle.setClassLoader(loader);
            this[VIEWS_STATES] = bundle.getSparseParcelableArray(VIEWS_STATES);
        };
        return PagerAdapterInner;
    }(android.support.v4.view.PagerAdapter));
    PagerAdapterClass = PagerAdapterInner;
}
var PageChangedListenerClass;
function ensurePageChangedListenerClass() {
    if (PageChangedListenerClass) {
        return;
    }
    var PageChangedListenerInner = (function (_super) {
        __extends(PageChangedListenerInner, _super);
        function PageChangedListenerInner(owner) {
            var _this = _super.call(this) || this;
            _this._owner = owner;
            return global.__native(_this);
        }
        PageChangedListenerInner.prototype.onPageSelected = function (position) {
            this._owner.position = position;
        };
        PageChangedListenerInner.prototype.onPageScrollStateChanged = function (state) {
            if (state == 0) {
                var eventData = {
                    eventName: "positionSelected",
                    object: this._owner
                };
                this._owner.notify(eventData);
            }
        };
        return PageChangedListenerInner;
    }(android.support.v4.view.ViewPager.SimpleOnPageChangeListener));
    PageChangedListenerClass = PageChangedListenerInner;
}
/*export class verticalViewPager extends android.support.v4.view.ViewPager
{
    constructor(context: android.content.Context)
    {
        super(context);
        this.setPageTransformer(false, new DefaultTransformer());
    }

    private swapTouchEvent(ev: android.view.MotionEvent)
    {
        var width = this.getWidth();
        var height = this.getHeight();

        var swappedX = (ev.getY() / height) * width;
        var swappedY = (ev.getX() / width) * height;

        ev.setLocation(swappedX, swappedY);

        return ev;
    }

    public onInterceptTouchEvent(ev: android.view.MotionEvent)
    {
        var intercept = super.onInterceptTouchEvent(this.swapTouchEvent(ev));
        //If not intercept, touch event should not be swapped.
        this.swapTouchEvent(ev);
        return intercept;
    }

    public onTouchEvent(ev: android.view.MotionEvent)
    {
        return super.onTouchEvent(this.swapTouchEvent(ev));
    }
}

export class DefaultTransformer implements android.support.v4.view.ViewPager.PageTransformer
{
    public transformPage(page : android.view.View, position: number)
    {
        page.setTranslationX(page.getWidth() * -position);
        var yPosition = position * page.getHeight();
        page.setTranslationY(yPosition);
    }
}*/ 
//# sourceMappingURL=carousel-view.js.map