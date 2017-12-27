import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import App from './App';
import Main from './components/main/Main';

enzyme.configure({ adapter: new Adapter() });

describe('App', () => {
  it('should contain Nav and Main components', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.find('Nav').length).toBe(1);
    expect(wrapper.find(Main).length).toBe(1);
  });
});
