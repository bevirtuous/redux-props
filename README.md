# redux-props
A tiny package to connect React components to a Redux store.

## Installation
```
npm i redux-props -S
```

## Usage

##### Install the Provider as a top-level component in your application.

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

##### Consume the store inside a component.

```jsx
import React from 'react';
import { consume } from 'redux-props';

// A little React component.
const MyComponent = ({ content }) => (
  <div>{content}</div>
);

// Function to map props from the state.
const mapProps = (state, props, dispatch) => ({
  content: state.greeting,
});

// Only update when the value of the mapped prop has changed.
const stateChanged = (prevState, nextState) => (
  prevState.greeting !== nextState.greeting
);

// HOC to inject the mapped props.
const Consumer = consume(mapProps, { stateChanged });

export default Consumer(MyComponent);
```

## API

### Provider
The Provider component exposes the store to your React component tree. It must receive a Redux store instance via the `store` prop.

### consume
The consume function is used to inject props, derived from the store, into a React component. The function accepts two parameters `mapProps` and `options`. By default, each consume function will map props each time the Redux store is updated. This can be controlled by the `options` parameter.

#### mapProps(state, props, dispatch)
The function to create the mapped props. The mapped props will be merged with the component props. In the case of a naming conflict, the mapped props have priority.
> The mapProps function will only be called once the `stateChanged` and `propsChanged` options have passed.

#### options
The options object is used to control when the `consume` function should map the props. It will consider 2 keys, `stateChanged` and `propsChanged`, which are both functions.

##### stateChanged(prevState, nextState)
Use this function to prevent unnecessary updates if the relevant values in the store have not changed. 

##### propsChanged(prevProps, nextProps)
Use this function to prevent unnecessary updates if the component props have not changed. 
