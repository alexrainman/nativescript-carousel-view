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
//# sourceMappingURL=template-selector.js.map