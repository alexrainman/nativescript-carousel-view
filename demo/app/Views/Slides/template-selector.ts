import { ITemplateSelector } from "nativescript-carousel-view";
import builder = require("ui/builder");

export class MyTemplateSelector implements ITemplateSelector {
    
    OnSelectTemplate(position: number, bindingContext: any) {

        var view = builder.load({
            path: "~/Views/Slides",
            name: "slider-view"
        });

        view.bindingContext = bindingContext;

        return view;
    }
}