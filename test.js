function calculatorApp() {
  const model = new MVC.Model({ result: 0, currentOperations: "" })
  const view = new MVC.View(
    (data) => `<div>
      <h1>Result: ${data.result}</h1>
      <div id="input-bar">${data.currentOperations}</div>
      <div class="calculator-buttons">
        <div mv-on="{click:registerNumber}" class="calculator-numbers">
          <button>1</button>
          <button>2</button>
          <button>3</button>
          <button>4</button>
          <button>5</button>
          <button>6</button>
          <button>7</button>
          <button>8</button>
          <button>9</button>
          <button>0</button>
          <button>.</button>
          <button>=</button>
        </div>
        <div mv-on="{click:registerNumber}" class="calculator-operators">
          <button>+</button>
          <button>-</button>
          <button>*</button>
          <button>%</button>
        </div>
      </div>
      <button mv-on="{click:clearInput}" id="clear-button">Clear</button>
      <a href="/counter">Counter App</a>
  </div>`
  )
  const controller = new MVC.Controller(model, view, {
    registerNumber: (e) => {
      const currentOperationsStr = model.reactiveData.currentOperations
      const lastAddedChar =
        currentOperationsStr[currentOperationsStr.length - 1]
      if (
        Number.isNaN(parseInt(lastAddedChar)) &&
        Number.isNaN(parseInt(e.target.innerHTML))
      ) {
        alert("Invalid Input")
        return
      }
      if (e.target.innerHTML === "=") {
        model.reactiveData.result = eval(currentOperationsStr)
      } else {
        model.reactiveData.currentOperations =
          currentOperationsStr + e.target.innerHTML
      }
    },
    clearInput:() => {
      model.reactiveData.currentOperations = ""
      model.reactiveData.result = 0
    }
  })

  return controller
}

function counterApp() {
  const model = new MVC.Model({ count: 1 })
  const view = new MVC.View(
    (data) => `<div>
      <h1>${data.count}</h1>
      <button mv-on="{click:incrementCount}">Increment +</button>
      <button mv-on="{click:decrementCount}">Decrement -</button>
      <a href="/">Calculator App</a>
  </div>`
  )
  const controller = new MVC.Controller(model, view, {
    incrementCount(e) {
      model.reactiveData.count = model.reactiveData.count + 1
    },
    decrementCount(e) {
      model.reactiveData.count = model.reactiveData.count - 1
    },
  })

  return controller
}

function main() {
  const counterController = counterApp()
  const calculatorController = calculatorApp()
  const calculatorRoute = new MVC.Route("/", calculatorController)
  const homeRoute = new MVC.Route("/counter", counterController)
  const app = new MVC.App()
  app.registerRoute(homeRoute)
  app.registerRoute(calculatorRoute)
  app.render()
}

main()
