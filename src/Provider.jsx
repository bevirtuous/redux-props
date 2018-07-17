import React, { Component } from 'react';
import PropTypes from 'prop-types';
import StoreContext from './context';

/**
 * 
 */
class StoreProvider extends Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
  };

  /**
   * 
   * @param {*} props 
   */
  constructor(props) {
    super(props);
    props.store.subscribe(() => this.forceUpdate());
  }

  /**
   * 
   */
  render() {
    return (
      <StoreContext.Provider
        value={{
          dispatch: this.props.store.dispatch,
          state: this.props.store.getState(),
        }}
      >
        {this.props.children}
      </StoreContext.Provider>
    );
  }
}

export default StoreProvider;
