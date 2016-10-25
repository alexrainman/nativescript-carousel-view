# CarouselView plugin for NativeScript

#### Setup
* Available on npm: https://www.nuget.org/packages/CarouselView.FormsPlugin/ [![NuGet](https://img.shields.io/nuget/v/CarouselView.FormsPlugin.svg?label=NuGet)](https://www.nuget.org/packages/CarouselView.FormsPlugin/)

**Platform Support**

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
<controls:CarouselView id="carouselView" position="0" itemsSource="{{ itemsSource }}" templateSelector="{{ templateSelector }}"/>
```

**Bindable Properties**

```position```: selected page when carousel starts.

```interPageSpacing```: margin/space between pages.

```itemsSource```: collection of objects used as bindingContext of each page.

```templateSelector```: a class implementing the provided ITemplateSelector interface.

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

export class Person {
    first: string;
    last: string;
}
```

Template selector: it should return a {N} view. As you can see in the example, i put each page view in separate file and i load them using builder. Also, notice that you have to assign the bindingContext of the returning view.

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

**Event Handlers**

```positionSelected```: called when the selected page changes.

**Methods**

```removePage (position)```: remove a view at given position (when you remove the current view it will slide to the previous one). This method will also remove the related item from the itemsSource).

```insertPage (position, bindingContext)```: insert a view at a given position.

```setCurrentPage (position)```: slide programmatically to a given position.

```itemsSourceChanged```: call this if you change the itemsSource.

#### Contributors
* [alexrainman](https://github.com/alexrainman)

Thanks!

#### License
Licensed under repo license
