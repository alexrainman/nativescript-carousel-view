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

    constructor()
    {
    }
}