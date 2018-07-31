# redux-props

[![Build Status](https://travis-ci.org/bevirtuous/redux-props.svg?branch=master)](https://travis-ci.org/bevirtuous/redux-props)
[![Coverage Status](https://coveralls.io/repos/github/bevirtuous/redux-props/badge.svg?branch=master)](https://coveralls.io/github/bevirtuous/redux-props?branch=master)
[![GitHub (pre-)release](https://img.shields.io/github/release/bevirtuous/redux-props/all.svg)](https://github.com/bevirtuous/redux-props/releases)

A tiny package to connect React components to a Redux store.

* [API](#api)
  * [Provider](#provider)
  * [consume](#consume)
    * [mapProps](#mapprops))
    * [stateChanged](#statechanged))
    * [propsChanged](#propschanged)
* [Usage](#usage)
  * [Simple example](#simple-example)

## Installation

```sh
npm i redux-props -S
```

## API

### Provider

The Provider component exposes the store to your React component tree. It must receive a Redux store instance via the `store` prop.

### consume

The consume function is used to inject props, derived from the store, into a React component. The function accepts two parameters `mapProps` and `options`. By default, each consume function will map props each time the Redux store is updated. This can be controlled by the `options` parameter.

#### mapProps({ state, props, dispatch })

The function to create the mapped props. The mapped props will be merged with the component props. In the case of a naming conflict, the mapped props will override the component props.

> The mapProps function will only be called once the `stateChanged` and `propsChanged` options have passed.

#### stateChanged({ prevState, nextState })

Use this function to prevent unnecessary updates if the relevant values in the store have not changed.

#### propsChanged({ prevProps, nextProps })

Use this function to prevent unnecessary updates if the component props have not changed.

## Usage

### Simple example

Install the Provider at the top of your React tree.

```jsx
import { createStore } from 'redux';
import { Provider } from 'redux-props';

const store = createStore();

const App = () => (
  <Provider store={store}>
    {/* Components */}
  </Provider>
);

export default App;
```

Consume the store inside a component.

```jsx
import React from 'react';
import { consume } from 'redux-props';

// A little React component.
const MyComponent = ({ content }) => (
  <div>{content}</div>
);

// Function to map props from the state.
const mapProps = ({ state }) => ({
  content: state.messages.greeting,
});

// Only update when the value of the mapped prop has changed.
const stateChanged = ({ prevState, nextState }) => (
  prevState.messages.greeting !== nextState.messages.greeting
);

// Wrap the component with the consumer on export.
export default consume({ mapProps, stateChanged })(MyComponent);
```

### Using `reselect` for simple selectors

```js
import React from 'react';
import { createSelector } from 'reselect';
import { consume } from 'redux-props';

// A little React component.
const MyComponent = ({ content }) => (
  <div>{content}</div>
);

// Grab the messages state.
const getMessagesState = state => state.messages;

// Greb the greeting message.
const getGreeting = createSelector(
  getMessagesState,
  messages => messages.greeting
)

// Function to map props from the state.
const mapProps = ({ state }) => ({
  content: getGreeting(state),
});

// Only update when the value of the mapped prop has changed.
const stateChanged = ({ prevState, nextState }) => (
  getGreeting(prevState) !== getGreeting(nextState)
);

// Wrap the component with the consumer on export.
export default consume({ mapProps, stateChanged })(MyComponent);
```

### Usage `reselect` with performance in mind

If you are interested in performance optimization you can also use
reselect's selector creators.

```js

/**
 * selectors.js
 */
import { createSelector } from 'reselect';

// Grab the messages state.
const getMessagesState = state => state.messages;

// Grab the greeting message.
export const makeGetGreeting = () => createSelector(
  getMessagesState,
  messages => messages.greeting
);

/**
 * MyComponentContainer.js
 */
import { consume } from 'redux-props';
import { makeGetGreeting } from './selectors';
import MyComponent from './MyComponent';

// Create a new instance of the selector.
const getGreeting = makeGetGreeting();

// Function to map props from the state.
const mapProps = ({ state }) => ({
  content: getGreetings(state),
});

// Only update when the value of the mapped prop has changed.
const stateChanged = ({ prevState, nextState }) => (
  getGreetings(prevState) !== getGreetings(nextState)
);

// Wrap the component with the consumer on export.
export default consume({ mapProps, stateChanged });

/**
 * MyComponent.js
 */
import React from 'react';
import consume from './consumer';

const MyComponent = ({ content }) => (
  <div>{content}</div>
);

export default consume(MyComponent);
```
