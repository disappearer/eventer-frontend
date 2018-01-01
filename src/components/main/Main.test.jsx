import React from 'react';
import enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router';
import Main from './Main';

enzyme.configure({ adapter: new Adapter() });

describe('Main', () => {
  it('should show event list if route is "/events"', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/events']}>
        <Main
          eventApi={{ future: () => Promise.resolve([]) }}
          getFunction="future"
          onJoinClick={() => {}}
        />
      </MemoryRouter>
    );
    expect(wrapper.find('EventList').length).toBe(1);
  });

  it('should show "new event" form if route is "/events/new" and user is authenticated', () => {
    const wrapper = mount(
      <MemoryRouter initialEntries={['/events/new']}>
        <Main
          eventApi={{ future: () => Promise.resolve([]) }}
          getFunction="future"
          onJoinClick={() => {}}
          eventsJoined={[]}
        />
      </MemoryRouter>
    );
    expect(wrapper.find('NewEventForm').length).toBe(1);
  });

  it('should forward prop.onJoinClick to EventList', () => {
    const callback = () => {};
    const wrapper = mount(
      <MemoryRouter initialEntries={['/events']}>
        <Main
          eventApi={{ future: () => Promise.resolve([]) }}
          getFunction="future"
          onJoinClick={callback}
        />
      </MemoryRouter>
    );
    expect(wrapper.find('EventList').prop('onJoinClick')).toEqual(callback);
  });

  it('should forward prop.eventsJoined to EventList', () => {
    const eventsJoined = ['12', '45'];
    const wrapper = mount(
      <MemoryRouter initialEntries={['/events']}>
        <Main
          eventApi={{ future: () => Promise.resolve([]) }}
          getFunction="future"
          onJoinClick={() => {}}
          eventsJoined={eventsJoined}
        />
      </MemoryRouter>
    );
    expect(wrapper.find('EventList').prop('eventsJoined')).toEqual(
      eventsJoined
    );
  });
});
