import observable = require("data/observable");
import { EventData } from "data/observable";
import { TabView } from "ui/tab-view";
import { Color } from "color";
import { MyTemplateSelector } from "../Views/Slides/template-selector";
import observableArrayModule = require("data/observable-array");

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

    constructor()
    {
    }
}