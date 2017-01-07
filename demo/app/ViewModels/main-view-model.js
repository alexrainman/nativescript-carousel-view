"use strict";
var observable = require("data/observable");
var observableArrayModule = require("data/observable-array");
var template_selector_1 = require("../Views/Slides/template-selector");
var HelloWorldModel = (function (_super) {
    __extends(HelloWorldModel, _super);
    function HelloWorldModel() {
        var _this = _super.call(this) || this;
        // Initialize default values.
        _this.templateSelector = new template_selector_1.MyTemplateSelector();
        _this.itemsSource = new observableArrayModule.ObservableArray();
        return _this;
    }
    return HelloWorldModel;
}(observable.Observable));
exports.HelloWorldModel = HelloWorldModel;
var Person = (function () {
    function Person() {
    }
    return Person;
}());
exports.Person = Person;
//# sourceMappingURL=main-view-model.js.map