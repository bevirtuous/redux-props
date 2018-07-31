import React from 'react';
import PropTypes from 'prop-types';
import { StoreContext } from './context';

/**
 * @return {undefined}
 */
const defaultMapProps = () => ({});

/**
 * The consume HOC.
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
   * @param {Object} nextProps The next component props.
   * @returns {boolean}
   */
  shouldComponentUpdate(nextProps) {
    const { options, props, state } = this.props;

    if (!options) {
      return true;
    }

    if (typeof options.stateChanged === 'function') {
      const stateChanged = options.stateChanged({
        prevState: state,
        nextState: nextProps.state,
        props,
      });

      if (!stateChanged) {
        return false;
      }
    }

    if (typeof options.propsChanged === 'function') {
      const stateChanged = options.propsChanged({
        prevProps: props,
        nextProps: nextProps.props,
      });

      if (!stateChanged) {
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
      ...mapProps({
        state,
        props,
        dispatch,
      }),
    };

    return <Component {...mergedProps} />;
  }
}

/**
 * @param {Object} props The consumer properties.
 * @returns {Function}
 */
export function consume({ mapProps = defaultMapProps, ...options }) {
  const consumeOptions = Object.keys(options).length ? options : null;

  return (Component) => {
    /**
     * @param {Object} props The StoreConsumer props.
     * @return {JSX}
     */
    const StoreConsumer = props => (
      <StoreContext.Consumer>
        {({ dispatch, state }) => (
          <Consume
            component={Component}
            dispatch={dispatch}
            mapProps={mapProps}
            options={consumeOptions}
            props={props}
            state={state}
          />
        )}
      </StoreContext.Consumer>
    );

    return StoreConsumer;
  };
}
