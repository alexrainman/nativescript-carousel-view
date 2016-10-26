# CarouselView plugin for NativeScript

Ported from my CarouselView for Xamarin.Forms: https://github.com/alexrainman/CarouselView

#### Setup

tns plugin add nativescript-carousel-view

#### Platform Support

|Platform|Supported|Version|NativeView|
| ------------------- | :-----------: | :-----------: | :------------------: |
|iOS|Yes|iOS 8.1+|UIPageViewController|
|Android|Yes|API 15+|ViewPager|

#### Requirements

* TypeScript >= 2.1.0-dev.20161003
* Async/Await

Please follow this tutorial to add TypeScript 2.1.0-dev.20161003 and async/await support to your project:

https://www.nativescript.org/blog/use-async-await-with-typescript-in-nativescript-today

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
    interPageSpacing="20"
    itemsSource="{{ itemsSource }}"
    templateSelector="{{ templateSelector }}"/>
```

#### Bindable Properties

```position```: selected page when carousel starts (default 0).

```interPageSpacing```: margin/space between pages (default 0).

```itemsSource```: collection of objects used as bindingContext for each page.

```templateSelector```: a class implementing the provided ITemplateSelector interface.

#### ViewModel example

```
import observable = require("data/observable");
import observableArrayModule = require("data/observable-array");
import { MyTemplateSelector } from "../Views/Slides/template-selector";

export class HelloWorldModel extends observable.Observable {

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

#### Template selector

Template selector should return a valid {N} view. As advice, put each view in separate files and load them with builder. Also, notice that you have to assign the bindingContext of the returning view.

```
import { ITemplateSelector } from "nativescript-carousel-view";
import builder = require("ui/builder");

export class MyTemplateSelector implements ITemplateSelector {
    
    OnSelectTemplate(position: number, bindingContext: any) {

        var view = builder.load({
            path: "~/Views/Slides",
            name: "slider-view"
        });

        // required
        view.bindingContext = bindingContext;

        return view;
    }
}
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

```removePage (position)```: remove a page at given position (this will also remove the corresponding item from itemsSource).

```setCurrentPage (position)```: slide programmatically to a given position.

```itemsSourceChanged```: call this if itemsSource has changed.

#### Roadmap

- Page Indicators
- Vertical Carousel

#### Collaborators

* [alexrainman](https://github.com/alexrainman)

* [NathanWalker](https://github.com/nathanwalker)

* [BradMartin] (https://github.com/bradmartin)

* [{N} Team ](https://github.com/nativescript)

#### License
MIT.
