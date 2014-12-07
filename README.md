EMF
===

Classes and integrations for Flux. Dispatcher, Store, and Actor ES6 classes. Directly extends the Flux Dispatcher, so upgrading is as simple as changing the module name.

```bash
npm install emf
```

```js
var Dispatcher = require('emf').Dispatcher;
```

EMF is a conservative [Flux](https://github.com/facebook/flux) implementation. The only goal of EMF is reducing the boilerplate of Flux applications. Putting logic into classes, most of Flux's inherit verbosity is reduced significantly and extending is much more convenient.

# Classes

## Dispatcher

Extends Facebook's Dispatcher class. Only adds the convenience of passing a Store instance directly to `waitFor()`, removing the need to deal with dispatch tokens.

## Actor

This would be the Action Creator class. This removes the verbosity of having to talk to the Dispatcher directly by wrapping those interactions with the `fire()` method. It also enforces a consistent payload structure.

### constructor(dispatcher)

Actors are created by by passing a Dispatcher instance. Any events fired from the Actor go to the Dispatcher.

### fire()

- `fire(source String, actionType String, action Any)`
- `fire(actionType String, action Any)`
- `fire(action Any)`

Dispatches payloads to the dispatcher as a struct.

```js
Payload {
	source Maybe String,
	actionType Maybe String,
	action Any	
}
```

### Actor Example

```js
var Actor = require('emf').Actor,
	myDispatcher = require('../my/dispatcher');

class DogActor extends Actor {
	addDog(name, sex, breed) {
		this.fire('addDog', {
			name: name,
			sex: sex,
			breed: breed
		});
	}
}

module.exports = new DogActor(myDispatcher);
```

## Store

### constructor(dispatcher)

Stores are created by by passing a Dispatcher instance. Any events fired from the Dispatcher go to the Store.

### getInitialState() Any

This method is meant to be overridden. On construction, the result of this method is set as the Store's initial state.

### onDispatch(payload, dispatcher)

All dispatched payloads flow though this method. In plain Flux, this is where the giant switch statement should be located. This is essentially the wildcard payload handler.

The Store class, however, does not stop here with dealing with dispatches. The Store can also call it's own methods based on the `source` or `actionType` properties of the payload. 

For example, a payload with `source: 'view'` will be sent to the Store method `onViewSource()` if it exists. A payload with `actionType: 'createUser'` will be sent to the Store method `onCreateUserAction()` if it exists. These help to reduce the length and tediousness of just using the wildcard `onDispatch()` method for everything.

### EventEmitter methods

The Store class extends EventEmitter so it has all of the common Emitter methods, but it also adds some Flux helper methods to make change watching easier.

- `addChangeListener(callback)`
- `removeChangeListener(callback)`
- `emitChange()`

### toJSON() Any

This method returns the state of the store. State may not be JSON, but it is best to have JSON-only state. 

### Store Example
```js
var Store = require('emf').Store,
	myDispatcher = require('../my/dispatcher');

class DogStore extends Store {
	getInitialState() {
		return [];
	}
	onAddDogAction(payload) {
		this.state.push(payload.action.dog);
		this.emitChange();
	}
}

module.exports = new DogStore(myDispatcher);
```

## HistoryStore

This class is in development, but would essentially extend the Store class, allowing redo/undo of state. This class is most effective when combined with the [`immutable`](http://facebook.github.io/immutable-js/) module as diffs between state are easy to compute as they are immutable.

Unlike all other classes, this one has not been tested. 

## A Note on Extending

EMF classes are compiled with the [`react-tools`](http://facebook.github.io/react/) transform using the harmony flag. This transform also expands JSX and other React and ES6 features. If you want to extend these classes in a build environment, take a look at [`gulp-react`](https://github.com/sindresorhus/gulp-react), [`grunt-react`](https://github.com/ericclemmons/grunt-react), or (when the owner gets off his butt and [passes the harmony flag](https://github.com/eddhannay/broccoli-react/issues/3)) [`broccoli-react`](https://github.com/eddhannay/broccoli-react). I am not certain whether the tranformed code is compaible with other ES6 transforms.

# Non-classes

## StoreMixin

- `StoreMixin(stores [Store], pure Boolean, fn Function) Mixin`
- `StoreMixin(stores [Store], fn Function) Mixin`

This is a React Mixin factory to help bind a component to Stores. The component will compute its state following any change to either its `props` or a Store's state. 

Setting the `pure` parameter to `true` will mutate state solely by this mixin, using `replaceState()` instead of `setState()`. This is useful and faster when all state will be set based on the value computed by `fn`.

The `fn` function has the signature `fn(props Any) Any`. The component's `props` will be passed to the function and whatever is returned will be set on the component's `state`. **This is the only place React should be communicating with the stores.**

# The Name and the Philosophy

In physics, EMF is electromotive force. Electromotive force is defined in relation to magnetic **flux** over **time**. Thus EMF was designed to be derived from Flux (extending the Dispatcher class directly instead of inventing a new one), change with the times (being ready to shift over to ES6 whenever it is supported), and only build on Flux with no other dependencies (sans EventEmitter). I also call it Even More Flux when I'm trying to explain it is an extension of Flux.

# Development and Contributing

As ES6 support increases, every effort will be made to bring EMF up to date, while also affording backwards compatibility for older systems. Once ES6 classes become available to Node, EMF classes will be exported as such. 

Until then, EMF will be following the build steps taken by the original Flux project. Thus, classes are compiled by the [`react-tools`](http://facebook.github.io/react/) module and tests are written in [Jest](https://facebook.github.io/jest/).

```bash
npm test # run tests
npm install # dependencies
gulp # to build
gulp publish # to pre-publish for pull requests
```

Follow me on [Twitter](https://twitter.com/compooter) for updates or just for the lolz and please check out my other [repositories](https://github.com/andrejewski) if I have earned it. I thank you for reading.