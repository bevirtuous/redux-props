import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StoreContext } from './context';

/**
 * The store provider.
 */
export class Provider extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    store: PropTypes.shape().isRequired,
  };

  /**
   * @param {Object} props The component props.
   */
  constructor(props) {
    super(props);
    props.store.subscribe(() => this.forceUpdate());
  }

  /**
   * @return {JSX}
   */
  render() {
    const { store, children } = this.props;
    const value = {
      dispatch: store.dispatch,
      state: store.getState(),
    };

    return (
      <StoreContext.Provider value={value}>
        {children}
      </StoreContext.Provider>
    );
  }
}
