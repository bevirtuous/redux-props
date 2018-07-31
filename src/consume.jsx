import React from 'react';
import PropTypes from 'prop-types';
import StoreContext from './context';

const defaultMapProps = () => undefined;

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
      return options.stateChanged({
        prevState: state,
        nextState: nextProps.state,
        props,
      });
    }

    if (typeof options.propsChanged === 'function') {
      return options.propsChanged({
        prevProps: props,
        nextProps: nextProps.props,
      });
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

    return <Component {...mergedProps} />;
  }
}

/**
 * @param {Object} props The consumer properties.
 * @return {Function}
 */
function consume({ mapProps = defaultMapProps, ...options }) {
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
            options={options || null}
            props={props}
            state={state}
          />
        )}
      </StoreContext.Consumer>
    );

    return StoreConsumer;
  };
}

export default consume;
