import { Component, OnInit } from "@angular/core";

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES: RouteInfo[] = [
  { path: "/modelo-info", title: "Informacion", icon: "info", class: "" },
  {
    path: "/grafica-dona",
    title: "Grafica Dona",
    icon: "donut_large",
    class: "",
  },
  {
    path: "/grafica-barras",
    title: "Grafica Barras Vertical",
    icon: "leaderboard",
    class: "",
  },
  {
    path: "/grafica-barras-horizontales",
    title: "Grafica Barras Horizontales",
    icon: "align_horizontal_left",
    class: "",
  },
  {
    path: "/grafica-linea",
    title: "Grafica Linea",
    icon: "stacked_line_chart",
    class: "",
  },
  {
    path: "/predictor",
    title: "Predictor",
    icon: "settings_accessibility",
    class: "",
  },
];

@Component({
  selector: "app-sidebar",
  templateUrl: "./sidebar.component.html",
  styleUrls: ["./sidebar.component.css"],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];

  constructor() {}

  ngOnInit() {
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
