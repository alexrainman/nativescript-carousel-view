CarouselView plugin for nativescript

#### Release Notes

2.0.2
[Bug] onLoaded() not being called on carousel pages (Fixed).

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
    orientation="0"
    position="0"
    interPageSpacing="20"
    itemsSource="{{ itemsSource }}"
    templateSelector="{{ templateSelector }}"/>
```

#### Bindable Properties

```orientation```: 0 = horizontal, 1 = vertical (default 0)

```position```: selected page when carousel starts (default 0).

```interPageSpacing```: margin/space between pages (default 0).

```itemsSource```: collection of objects used as bindingContext for each page.

```templateSelector```: a class implementing the provided ITemplateSelector interface.

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

var MyTemplateSelector = (function () {
    function MyTemplateSelector() {
    }
    MyTemplateSelector.prototype.OnSelectTemplate = function (position, bindingContext) {

        var view = builder.load({
            path: "~/Views/Slides",
            name: "slider-view"
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

```itemsSourceChanged```: call this if itemsSource has changed.

#### Roadmap

- Page Indicators

#### Requirements for TypeScrip developers

* TypeScript >= 2.1.0-dev.20161003

Please follow this tutorial to add TypeScript 2.1.0-dev.20161003 and async/await support to your project:

https://www.nativescript.org/blog/use-async-await-with-typescript-in-nativescript-today

#### Developed by

* [alexrainman](https://github.com/alexrainman)

#### Collaborators

* [BradMartin](https://github.com/bradmartin)
* [NathanWalker](https://github.com/nathanwalker)

#### License
MIT.

Ported from CarouselView for Xamarin.Forms: https://github.com/alexrainman/CarouselView