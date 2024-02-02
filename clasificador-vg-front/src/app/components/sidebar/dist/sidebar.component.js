"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.SidebarComponent = exports.ROUTES = void 0;
var core_1 = require("@angular/core");
exports.ROUTES = [
    { path: "/modelo-info", title: "Informacion", icon: "info", "class": "" },
    {
        path: "/grafica-dona",
        title: "Grafica Dona",
        icon: "donut_large",
        "class": ""
    },
    {
        path: "/grafica-barras",
        title: "Grafica Barras Verticales",
        icon: "leaderboard",
        "class": ""
    },
    {
        path: "/grafica-barras-horizontales",
        title: "Grafica Barras Horizontales",
        icon: "align_horizontal_left",
        "class": ""
    },
    {
        path: "/grafica-linea",
        title: "Grafica Linea",
        icon: "stacked_line_chart",
        "class": ""
    },
    {
        path: "/predictor",
        title: "Predictor",
        icon: "settings_accessibility",
        "class": ""
    },
];
var SidebarComponent = /** @class */ (function () {
    function SidebarComponent() {
    }
    SidebarComponent.prototype.ngOnInit = function () {
        this.menuItems = exports.ROUTES.filter(function (menuItem) { return menuItem; });
    };
    SidebarComponent.prototype.isMobileMenu = function () {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };
    SidebarComponent = __decorate([
        core_1.Component({
            selector: "app-sidebar",
            templateUrl: "./sidebar.component.html",
            styleUrls: ["./sidebar.component.css"]
        })
    ], SidebarComponent);
    return SidebarComponent;
}());
exports.SidebarComponent = SidebarComponent;
