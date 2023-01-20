;(function (global) {
  class Model {
    reactiveData
    listenerCb
    context
    /**
     *
     * @param {Object} data JSON object
     */
    constructor(data) {
      const that = this
      this.reactiveData = new Proxy(data, {
        set(target, p, newValue) {
          Reflect.set(target, p, newValue)
          that.notifyChanges()
          return true
        },
      })
    }

    notifyChanges() {
      this.listenerCb.call(this.context, this.reactiveData)
    }

    registerChangeListener(cb, ctx) {
      this.listenerCb = cb
      this.context = ctx
    }
  }

  class View {
    template
    container
    /**
     *
     * @param {*} template non compiled ejs template
     * @param {string=} selector selector where view should be mounted
     */
    constructor(template, selector) {
      if (typeof template !== "function") {
        throw new Error("Template should be of type function. Which returns a string")
      }
      this.container = document.querySelector(selector || "#mvc")
      this.template = template
    }

    renderView(view) {
      /**
       * To ensure all event listeners are removed when we cleanup container
       * to avoid memory leaks
       * ref: https://www.geeksforgeeks.org/what-is-the-disadvantage-of-using-innerhtml-in-javascript/
       */
      while (this.container.lastChild) {
        this.container.removeChild(this.container.lastChild)
      }
      this.container.appendChild(view)
    }
  }

  class Controller {
    renderd = false
    parser
    /**
     *
     * @param {*} model Instance of Model
     * @param {*} view Instance of View
     * @param {*} listeners Listeners to be attached with view
     */
    constructor(model, view, listeners) {
      this.view = view
      this.model = model
      this.parser = new DOMParser()
      this.listeners = listeners
      model.registerChangeListener(this.updateView, this)
    }

    updateView(data) {
      /**
       * compile ejs template to html, attach all event listeners and render the view.
       * we are replacing entire view every time there is change in model. but it can
       * be improved further by doing fine grain dom updates. we can use rendered flag
       * to mark initial render as done and there after add logic to do fine grain update
       * by using container element from view instead of template.
       */

      const template = this.view.template(data || this.model.reactiveData)
      const domRepresentation = this.parser.parseFromString(
        template,
        "text/html"
      )
      domRepresentation.querySelectorAll("[mv-on]").forEach((entry) => {
        const attr = entry.getAttribute("mv-on")
        const parsedAttr = attr.slice(1, attr.length - 1)
        const [event, listenerFunc] = parsedAttr.split(":")
        if (this.listeners[listenerFunc]) {
          entry.addEventListener(event, this.listeners[listenerFunc])
        }
      })
      this.view.renderView(domRepresentation.body.firstChild)

      /**
       * TODO: Once initial render is done we can add diffing algo here and update dom
       * in more efficient way.
       */
    }
  }

  class Route {
    /**
     *
     * @param {*} path path name where e.g /home
     * @param {*} controller Controller Instance
     */
    constructor(path, controller) {
      this.path = path
      this.controller = controller
    }
  }

  class App {
    routes = {}
    constructor() {
      /**
       * this implementation has cleaner url's
       * but has couple of edge cases.
       */
      window.addEventListener("click", (e) => {
        if (e.target.tagName === "A") {
          e.preventDefault()
          const path = e.target.getAttribute("href")
          history.pushState(null, null, path)
          this.routes[`${path}`].updateView()
        }
      })

      /**
       * hash routing
       */
      // window.addEventListener("hashchange", (e) => {
      //   console.log(this.routes[`/${window.location.hash.replace("#", "")}`])
      //   this.routes[`/${window.location.hash.replace("#", "")}`].updateView()
      // })
    }

    /**
     *
     * @param {*} route Route Instance
     */
    registerRoute(route) {
      this.routes[route.path] = route.controller
    }

    render() {
      this.routes["/"].updateView()
    }
  }

  const MVC = { Model, View, Controller, Route, App }
  Object.freeze(MVC)
  window.MVC = MVC
})(typeof window !== "undefined" ? window : this)
