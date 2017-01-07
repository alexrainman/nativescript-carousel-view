CarouselView plugin for nativescript

#### Setup

tns plugin add nativescript-carousel-view

#### Platform Support

|Platform|Supported|Version|NativeView|
| ------------------- | :-----------: | :-----------: | :------------------: |
|iOS|Yes|iOS 8.1+|UIPageViewController|
|Android|Yes|API 15+|ViewPager|

#### Usage

First add the xmlns namespace:

```xml
xmlns:controls="nativescript-carousel-view"
```

Then add the control:

```xml
<controls:CarouselView
    id="carouselView"
    position="0"
    orientation="horizontal"
    interPageSpacing="5"
    itemsSource="{{ itemsSource }}"
    templateSelector="{{ templateSelector }}"/>
```

#### Bindable Properties

```orientation```: horizontal, vertical (default horizontal).

```itemsSource```: collection of objects used as bindingContext for each page.

```position```: selected page when carousel starts (default 0).

```interPageSpacing```: margin/space between pages (default 0).

```interPageSpacingColor```: color for the margin/space between pages (default #FFFFFF).

```showIndicators```: show page indicators (default true).

```indicatorsShape```: Circle or Square indicators shape (default Circle).

```indicatorsTintColor```: color for the unselected dots (default #c0c0c0).

```indicatorsCurrentPageColor```: color for the selected dot (default #808080).

```templateSelector```: a class implementing the provided ITemplateSelector interface.

```animateTransition```: enables transition animation when swiping programmatically (default true).

Template selector should return a valid {N} view. As advice, put each view in separate files and load them with builder. Also, notice that you have to assign the bindingContext of the returning view.

#### TYPESCRIPT

```
import { ITemplateSelector } from "nativescript-carousel-view";
import builder = require("ui/builder");
var frame = require('ui/frame');

export class MyTemplateSelector implements ITemplateSelector {
    
    OnSelectTemplate(position: number, bindingContext: any) {

        var page = frame.topmost().currentPage;

        var view = builder.load({
            path: "~/Views/Slides",
            name: "slider-view",
            page: page
        });

        // required
        view.bindingContext = bindingContext;

        return view;
    }
}
```

#### ViewModel

```
import observable = require("data/observable");
import observableArrayModule = require("data/observable-array");
import { MyTemplateSelector } from "../Views/Slides/template-selector";

export class MainViewModel extends observable.Observable {

    public templateSelector: MyTemplateSelector;
    public itemsSource: observableArrayModule.ObservableArray<Person>;

    constructor() {
        super();

        // Initialize default values.

        this.templateSelector = new MyTemplateSelector();

        var person = new Person();
        person.first = "Alexander";
        person.last = "Reyes";

        var items = [ person, person, person, person, person ];
        this.itemsSource = new observableArrayModule.ObservableArray<Person>(items);
    }
}
```

#### JAVASCRIPT

```
"use strict";
var builder = require("ui/builder");
var frame = require('ui/frame');

var MyTemplateSelector = (function () {
    function MyTemplateSelector() {
    }
    MyTemplateSelector.prototype.OnSelectTemplate = function (position, bindingContext) {

        var page = frame.topmost().currentPage;

        var view = builder.load({
            path: "~/Views/Slides",
            name: "slider-view",
            page: page
        });

        view.bindingContext = bindingContext;

        return view;
    };
    return MyTemplateSelector;
}());

exports.MyTemplateSelector = MyTemplateSelector;
```

#### ViewModel

```
"use strict";
var observable = require("data/observable");
var observableArrayModule = require("data/observable-array");
var template_selector = require("../Views/Slides/template-selector");

var MainViewModel = (function (_super) {
    __extends(MainViewModel, _super);
    function MainViewModel() {
        var _this = _super.call(this) || this;
        _this.templateSelector = new template_selector.MyTemplateSelector();
        _this.itemsSource = new observableArrayModule.ObservableArray(items);
        return _this;
    }
    return MainViewModel;
}(observable.Observable));

exports.MainViewModel = MainViewModel;
```

#### Event Handlers

```positionSelected```: triggers when the selected page changes.

```
var carouselView = <CarouselView>page.getViewById("carouselView");

carouselView.on("positionSelected", function(eventData){
    console.log(eventData.eventName + " has been raised! by: " + eventData.object);
});
```

#### Methods

```insertPage (position, bindingContext)```: insert a page at a given position.

```
await carouselView.insertPage(5, person);
carouselView.setCurrentPage(5);
```

```removePage (position)```: remove a page at given position (this will also remove the corresponding item from itemsSource).

```
await carouselView.removePage(5);
```

```setCurrentPage (position)```: slide programmatically to a given position.

#### Requirements for TypeScript developers

* TypeScript >= 2.1.1 (npm install -g typescript@2.1.1)

Please follow this tutorial to add TypeScript >= 2.1.1 and async/await support to your project:

https://www.nativescript.org/blog/use-async-await-with-typescript-in-nativescript-today

#### Roadmap

* Remove setCurrentPage, implement as position propertyChangedEvent (requires lot of refactoring)
* Indicators tap event
* PullToLoadMore event

#### Collaborators

* [alexrainman](https://github.com/alexrainman)

#### Release Notes

2.9.0

[New feature] animateTransition, enables transition animation when swiping programmatically (default true).

2.8.0

[Update] itemsSource now supports empty observable array.

2.7.1

[New feature] Circle or Square indicatorsShape property (default Circle).

2.6.1

[Update] orientation property is now expressed as string (horizontal, vertical), Orientation enum from "ui/enums" is supported.

[New feature] interPageSpacingColor property to change the color of the margin/space between pages (default #FFFFFF).

[New feature] indicatorsTintColor property to change the color of unselected dots (default #c0c0c0).

[New feature] indicatorsCurrentPageColor property to change the color of selected dot (default #808080).

2.6.0

[Udpate] Matching version number with Xamarin.Forms CarouselView

2.2.0

[iOS] Small fix to avoid UIPageViewController.View go outside its container bounds

[Update] showIndicators property now does what it supposed to do, hide/show indicators :)

[Update] itemsSourceChanged method removed, implemented as a propertyChangedEvent

2.1.0

[Enhancement] Adding page indicators

2.0.6

[Bug] CSS not applying to slides #6 (fixed)

[Enhancement] Removing left and right overscroll in Android vertical carousel

2.0.5

[Bug] Adding another touch gesture to slider-view does not work (fixed)

2.0.4

Updated README.

2.0.3

[Bug] fixing interPageSpacing in Android.

2.0.2

[Bug] onLoaded() not being called on carousel pages (Fixed).

#### License
MIT.

Ported from CarouselView for Xamarin.Forms: https://github.com/alexrainman/CarouselView
