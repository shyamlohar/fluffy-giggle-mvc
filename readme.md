# Mini MVC framework

# Demo URL
https://silly-parfait-63b17b.netlify.app/

## How to Use
Just link the mvc.js or mvc-ejs.js right before the closing </body> tag, followed by your own custom JavaScript file, scripts.js or whatever you name it.

Add one div above script tag with id mvc.

After this step your html should look like 

```html
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>

    <!-- Your content here -->
    <div id="mvc"></div>
    <script src="mvc.js"></script>
    <script src="script.js"></script>
</body>
</html>
```

Once this part is done we can go ahead and create our first Route using MVC framework.

For example we will be building Counter component.

first we will create a function named main in script.js file as shown below.

```javascript
function main() {
    // we will add code here
}
main()
```

Next step is to create model to store our data. 

```javascript
function main() {
    const model = new Model({count: 0})
}
main()
```

We just created our model which stores count that we want to display on ui. Next step is to add view which will help us display count in browser 

```javascript
function main() {
    const model = new Model({count: 0})
    const view = new View((data) => `<div>
        <span>
            ${data}
        </span>
    </div>`)
}
main()
```

Now Let's add button and events to increment and decrement our counter

```javascript
function main() {
    const model = new Model({count: 0})
    const view = new View((data) => `<div>
        <span>
            ${data}
        </span>
        <button mv-on="{click:increment}">Increment+<button>
        <button mv-on="{click:decrement}">Decrement+<button>
    </div>`)
}
main()
```

Lets breakdown the syntax that we used for adding event listeners.

we register event listeners using attribute named `mv-on` and we have to wrap content inside this attribute in `{}`. prefix part of `:` is event name and `increment` is function which we want to call when element is clicked.


now lets add controller to handle this events

```javascript
function main() {
    const model = new MVC.Model({count: 0})
    const view = new MVC.View((data) => `<div>
        <span>
            ${data}
        </span>
        <button mv-on="{click:increment}">Increment+<button>
        <button mv-on="{click:decrement}">Decrement+<button>
    </div>`)
    const controller = new MVC.Controller(model, view, {
        increment(e) {
            model.reactiveData.count = model.reactiveData.count + 1
        },
        decrement(e) {
            model.reactiveData.count = model.reactiveData.count - 1
        },
    }) 
}
main()
```


So all we have to do is pass our model and view to controller and add object with all functions which are going to handle events we registered in view.

One point we should be aware of is that you all updates that we want to do should be on `model.reactiveData`. instead of directly updating model. `model.reactiveData` mimics object that we passed to our model so you can.


Once steps above are done its time to add route and render it i browser


```javascript
function main() {
    const model = new MVC.Model({count: 0})
    const view = new MVC.View((data) => `<div>
        <span>
            ${data}
        </span>
        <button mv-on="{click:increment}">Increment+<button>
        <button mv-on="{click:decrement}">Decrement+<button>
    </div>`)
    const controller = new MVC.Controller(model, view, {
        increment(e) {
            model.reactiveData.count = model.reactiveData.count + 1
        },
        decrement(e) {
            model.reactiveData.count = model.reactiveData.count - 1
        },
    }) 

    const route = new MVC.Route("/", controller);

    const app = new MVC.App();

    app.registerRoute(route);

    app.render()
}
main()
```


Boom! its done. our counter app is ready.


If you prefer to use `ejs` templating language and you are fine with additional 4kb JS you can add 

```html
<script src="https://cdn.jsdelivr.net/npm/ejs@3.1.8/ejs.min.js"></script>
<script src="mvc-ejs.js"></script>
```

instead of `<script src="mvc.js"></script>`

One thing that would change if you go ahead with ejs template is that you will have to pass ejs template string to view instead of function 

e.g 

```javascript
function main() {
    const model = new Model({count: 0})
    const view = new View((data) => `<div>
        <span>
            ${data}
        </span>
    </div>`)
}
main()
```

would be replaced with 

```javascript
function main() {
    const model = new Model({count: 0})
    const view = new View(`<div>
        <span>
            <%= count %>
        </span>
    </div>`)
}
main()
```

You can checkout more examples in `test.js file`


## Pros of using this MVC framework

1. Zero tooling requirement (just add script in html and we are done)
2. Minimal JS size (1.57 KB) and additional 4KB if you use ejs which is optional
3. Cleaner Code 
4. Routing is completely optional you can just make some part of site interective. (example to be added) 
5. No redundant boiler plate code for finding and attaching event listeners.
6. Clean and Simple API
7. Separation of concern 


## Cons

1. No Fine grain dom element updates
2. Not suitable for large apps or views with large number of dom nodes
3. No Component support like React, Angular or other frameworks 