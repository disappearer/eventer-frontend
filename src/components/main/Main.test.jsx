import React from 'react';
import enzyme, { shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router';
import Main from './Main';
import EventList from './event-list/EventList';

enzyme.configure({ adapter: new Adapter() });

describe('Main', () => {
  it('should show event list if route is "/events"', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/events']}>
        <Main
          eventApi={{ future: () => Promise.resolve([]) }}
          getFunction="future"
        />
      </MemoryRouter>
    );
    expect(wrapper.find(EventList).length).toBe(1);
  });

  it('should show "new event" form if route is "/events/new"', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/events/new']}>
        <Main
          eventApi={{ future: () => Promise.resolve([]) }}
          getFunction="future"
        />
      </MemoryRouter>
    );
    expect(wrapper.find('NewEventForm').length).toBe(1);
  });
});
