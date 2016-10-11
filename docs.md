Junctions are a way of describing the different locations within your React application. They're what Routes would look like if they were designed with React in mind.

## Why Use Junctions?

### Junctions are composable.

Routes tie parts of your application to a specific path, making it difficult to re-use components within different applications or paths:

```
<Link to=`/the/complete/url/for/invoices`>Invoices</Link>
```

But Junctions you to link within a *Component* as opposed to the entire application, making composition easy:

```
<Link to=`locate(Content.Invoices())`>Invoices</Link>
```

### Junctions can be superimposed.

Routes only let you choose one option at a time. For example, your app can either be in a modal, or it can be somewhere else. And this all has to be represented with URLs:

**Show how we need a separate modal URL for each page which the modal can appear on**

Junctions allow multiple branches to be active at one time. And it does so without cramming all the information into the URL, too:

**Same animation, URL only changes when the main screen changes**

### Junctions are designed for React.

The authors of React's most popular Route library say their API is "fighting against React" ([seriously](https://github.com/ReactTraining/react-router/commit/743832c559e7f9a5c8278c247e52730917333f82)). And they aint kidding:

- It relies on context. A feature which the React documentation warns: "If you have to use context, use it sparingly."
- It *prevents* props from being passed to components.
- Its API never stops changing

On the other hand, Junctions were built from the ground up for React. And its API shows it*

- It doesn't rely on context.
- You *have* to pass props to components.
- Its API only has 6 exports.

But how do Junctions make everything so simple?

## How Junctions Work

- At its most basic, a React application is a hierarachy of components, with the "active" parts switched by the current URL and Location State.
- Diagram: A tree, and an active part of a tree.
- See how there are parts where the active flow follows one of multiple choices, and some branches where the active flow splits?
- Let's call the "one of" parts junctions, and the "many" parts splitters
- By defining the junctions and splitters which a component has, it is possible to take your location (represnted by a URL, etc.) and turn it into an object which represents the current Route through your tree.
- And then you can use those routes to render the application with pure React.

## The API


### Route

Routes are objects which represent your application's current state. Routes can contain further Routes as children -- the `Route` at the top-most level of your application will contain exactly the same information as your `Location` -- just in a different format.

### createConverter(junctionSet)

Create a `Converter` object with two methods two help you switch between `Route` and `Location` objects

#### converter.getLocationFromRouteSet(routeSet): Location

Accepts an object mapping JunctionSet key to Route object, and converts it to a Location which can be used with `<Link>` components or with `history.pushState`.

#### converter.getRouteSetFromLocation(location): RouteSet

Accepts a Location object (such as the current location from a history object), and converts it into a set of routes following the specification in the converter's JunctionSet

### JunctionSet({ [key: string]: Junction }, primaryJunctionKey): JunctionSet

Represents a group of Junctions, where your application will have at most one Route for each Junction 

The `primaryJunctionKey` is the route whose state will be stored in `location.pathname` and `location.query` if possible. All other state will be stored in `location.state`

### Junction({ [key: string]: BranchTemplate }, defaultBranchKey): Junction

Represents a point in your application where one of multiple branches must be selected

### Branch({ path, children, params, data }): BranchTemplate

Represents one possible type of Route which can be taken on a given Junction.

`path` will be automatically generated from the available params if not specified.

### Param({ default, required, serializer })

### Serializer({ serialize, deserialize })

