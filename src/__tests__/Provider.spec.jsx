import React from 'react';
import { shallow } from 'enzyme';
import { Provider } from '../Provider';

const store = {
  subscribe: jest.fn(),
  dispatch() {},
  getState: jest.fn(),
};

describe('<Provider />', () => {
  it('should fail if no store is provided', (done) => {
    try {
      shallow(<Provider />);
      done('Did not error');
    } catch (e) {
      done();
    }
  });

  it('it should render with a proper store', () => {
    const wrapper = shallow((
      <Provider store={store}>
        <div>
          Some
        </div>
      </Provider>
    ));
    expect(store.subscribe).toHaveBeenCalledTimes(1);
    expect(store.getState).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
  });
});
