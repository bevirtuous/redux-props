import React from 'react';
import PropTypes from 'prop-types';
import StoreContext from './context';

const defaultMapProps = () => undefined;
const defaultOptions = null;

/**
 * 
 */
class Consume extends React.Component {
  static propTypes = {
    component: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    mapProps: PropTypes.func.isRequired,
    props: PropTypes.shape().isRequired,
    state: PropTypes.shape().isRequired,
    options: PropTypes.shape({
      propsChanged: PropTypes.func,
      stateChanged: PropTypes.func,
    }),
  }

  static defaultProps = {
    options: {},
  }

  /**
   * 
   */
  shouldComponentUpdate(nextProps) {
    const { options, props, state } = this.props;

    if (!options) {
      return true;
    }

    if (typeof options.stateChanged === 'function') {
      const stateChange = options.stateChanged(state, nextProps.state, props);
      
      if (!stateChange) {
        return false;
      }
    }

    if (typeof options.propsChanged === 'function') {
      const propsChange = options.propsChanged(props, nextProps.props);

      if (!propsChange) {
        return false;
      }
    }

    return true;
  }

  /**
   * @returns {JSX}
   */
  render() {
    const {
      component: Component,
      dispatch,
      mapProps,
      props,
      state,
    } = this.props;

    const mergedProps = {
      ...props,
      ...mapProps(state, props, dispatch),
    };

    return <Component {...mergedProps} />
  }
}

/**
 * 
 * @param {*} mapProps 
 * @param {*} options 
 */
const consume = (mapProps = defaultMapProps, options = defaultOptions) => (Component) => {
  /**
   * 
   * @param {*} props 
   */
  const StoreConsumer = props => (
    <StoreContext.Consumer>
      {({ dispatch, state }) => (
        <Consume
          component={Component}
          dispatch={dispatch}
          mapProps={mapProps}
          options={options}
          props={props}
          state={state}
        />
      )}
    </StoreContext.Consumer>
  );

  return StoreConsumer;
};

export default consume;
