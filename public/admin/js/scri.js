class Scripts {
    constructor() {
      this._initSettings(),
        this._initVariables(),
        this._addListeners(),
        this._init();
    }
    _init() {
      setTimeout(() => {
        document.documentElement.setAttribute("data-show", "true"),
          document.body.classList.remove("spinner"),
          this._initBase(),
          this._initCommon(),
          this._initPages();
      }, 100);
    }
    _initBase() {
      if ("undefined" != typeof Nav) {
        new Nav(document.getElementById("nav"));
      }
      if ("undefined" != typeof Search) {
        new Search();
      }
      "undefined" != typeof AcornIcons && new AcornIcons().replace();
    }
    _initCommon() {
      if ("undefined" != typeof Common) {
        new Common();
      }
    }
    _initPages() {
      if ("undefined" != typeof CustomersDetail) {
        new CustomersDetail();
      }
      if ("undefined" != typeof CustomersList) {
        new CustomersList();
      }
      if ("undefined" != typeof Dashboard) {
        new Dashboard();
      }
      if ("undefined" != typeof Discount) {
        new Discount();
      }
      if ("undefined" != typeof OrdersList) {
        new OrdersList();
      }
      if ("undefined" != typeof ProductsDetail) {
        new ProductsDetail();
      }
      if ("undefined" != typeof ProductsList) {
        new ProductsList();
      }
      if ("undefined" != typeof SettingsGeneral) {
        new SettingsGeneral();
      }
      if ("undefined" != typeof StorefrontCategories) {
        new StorefrontCategories();
      }
      if ("undefined" != typeof StorefrontCheckout) {
        new StorefrontCheckout();
      }
      if ("undefined" != typeof StorefrontDetail) {
        new StorefrontDetail();
      }
      if ("undefined" != typeof StorefrontFilters) {
        new StorefrontFilters();
      }
      if ("undefined" != typeof StorefrontHome) {
        new StorefrontHome();
      }
    }
    _initSettings() {
      if ("undefined" != typeof Settings) {
        new Settings({
          attributes: {
            placement: "vertical",
            layout: "boxed",
            color: "light-green",
          },
          showSettings: !0,
          storagePrefix: "acorn-ecommerce-platform-",
        });
      }
    }
    _initVariables() {
      if ("undefined" != typeof Variables) {
        new Variables();
      }
    }
    _addListeners() {
      document.documentElement.addEventListener(
        Globals.menuPlacementChange,
        (e) => {
          setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
          }, 25);
        }
      ),
        document.documentElement.addEventListener(Globals.layoutChange, (e) => {
          setTimeout(() => {
            window.dispatchEvent(new Event("resize"));
          }, 25);
        }),
        document.documentElement.addEventListener(
          Globals.menuBehaviourChange,
          (e) => {
            setTimeout(() => {
              window.dispatchEvent(new Event("resize"));
            }, 25);
          }
        );
    }
  }
  window.addEventListener("DOMContentLoaded", () => {
    void 0 !== Scripts && new Scripts();
  }),
    "undefined" != typeof Dropzone && (Dropzone.autoDiscover = !1);