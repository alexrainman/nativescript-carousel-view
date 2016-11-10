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

        view.bindingContext = bindingContext;

        return view;
    }
}