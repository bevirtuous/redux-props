# redux-props

[![Build Status](https://travis-ci.org/bevirtuous/redux-props.svg?branch=master)](https://travis-ci.org/bevirtuous/redux-props)
[![Coverage Status](https://coveralls.io/repos/github/bevirtuous/redux-props/badge.svg?branch=master)](https://coveralls.io/github/bevirtuous/redux-props?branch=master)
[![GitHub (pre-)release](https://img.shields.io/github/release/bevirtuous/redux-props/all.svg)](https://github.com/bevirtuous/redux-props/releases)

A tiny package to connect React components to a Redux store.

* [Setup](#setup)
* [Usage](#usage)
  * [Basic example](#basic-example)
  * [Using `reselect` for memoization](#using-reselect-for-memoization)
  * [Advanced `reselect` using shared selectors](#advanced-reselect-using-shared-selectors)
* [API](#api)
  * [Provider](#provider)
  * [consume](#consume)
    * [mapProps](#mapprops-state-props-dispatch-)
    * [stateChanged](#statechanged-prevstate-nextstate-)
    * [propsChanged](#propschanged-prevprops-nextprops-)

## Installation

```sh
npm i redux-props -S
```

## Setup

Before using the `consume` functio, you must setup the `Provider` at the top of your React tree:

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

## Usage

### Basic example

This example will inject a prop named `content` into the component `MyComponent`.

```jsx
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

```js
/**
 * consumer.js
 */
import { consume } from 'redux-props';

const mapProps = ({ state }) => ({
  content: state.messages.greeting,
});

const stateChanged = ({ prevState, nextState }) => (
  prevState.messages.greeting !== nextState.messages.greeting
);

export default consume({ mapProps, stateChanged });
```

### Using `reselect` for memoization

Using the simple example but with changes to the `consumer.js` file and a new file to consider called `selectors.js`.

```js
/**
 * consumer.js
 */
import { consume } from 'redux-props';
import { getGreeting } from './selectors';

const mapProps = ({ state }) => ({
  content: getGreeting(state),
});

const stateChanged = ({ prevState, nextState }) => (
  getGreeting(prevState) !== getGreeting(nextState)
);

export default consume({ mapProps, stateChanged });
```

```js
/**
 * selectors.js
 */
import { createSelector } from 'reselect';

const getMessagesState = state => state.messages;

export const getGreeting = createSelector(
  getMessagesState,
  messages => messages.greeting || null
);
```

### Advanced `reselect` using shared selectors

This examples shows how to use `redux-props` with selectors that are shared between multiple component instances.

```js
/**
 * consumer.js
 */
import { consume } from 'redux-props';
import { makeGetGreeting } from './selectors';

const getGreeting = makeGetGreeting();

const mapProps = ({ state }) => ({
  content: getGreetings(state),
});

const stateChanged = ({ prevState, nextState }) => (
  getGreetings(prevState) !== getGreetings(nextState)
);

export default consume({ mapProps, stateChanged });
```

```js
/**
 * selectors.js
 */
import { createSelector } from 'reselect';

const getMessagesState = state => state.messages;

export const makeGetGreeting = () => createSelector(
  getMessagesState,
  messages => messages.greeting
);

```

## API

### Provider

The Provider component exposes the store to your React component tree. It must receive a Redux store instance via the `store` prop.

### consume

The consume function is used to inject props, derived from the store, into a React component. The function accepts two parameters `mapProps` and `options`. By default, each consume function will map props each time the Redux store is updated. This can be controlled by the `options` parameter.

#### mapProps({ state, props, dispatch })

The function to create the mapped props. The mapped props will be merged with the component props. In the case of a naming conflict, the mapped props will override the component props.

> The `mapProps` function will only be called once the `stateChanged` and `propsChanged` options have passed.

#### options({ stateChanged, propsChanged })

You can use the `options` to prevent unnecessary updates when unrelated parts of the store change.

##### stateChanged({ prevState, nextState })

Use this function to prevent unnecessary updates if the relevant values in the store have not changed.

##### propsChanged({ prevProps, nextProps })

Use this function to prevent unnecessary updates if the component props have not changed.
