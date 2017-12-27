import React from 'react';
import enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import EventList from './EventList';
import EventItem from './EventItem';

enzyme.configure({ adapter: new Adapter() });

const EventAPI = {
  events: [
    {
      id: 0,
      creatorId: 123,
      title: 'Some Event 1',
      description: 'Some random event with id 0',
      date: '2017-10-15T20:00:00.000Z',
      location: 'Somewhere',
      guestList: [123]
    },
    {
      id: 1,
      creatorId: 123,
      title: 'Some Event 2',
      description: 'Some random event with id 1',
      date: '2017-10-14T20:00:00.000Z',
      location: 'Somewhere',
      guestList: [123]
    },
    {
      id: 2,
      creatorId: 123,
      title: 'Some Event 3',
      description: 'Some random event with id 2',
      date: '2017-10-18T18:00:00.000Z',
      location: 'Somewhere',
      guestList: [123]
    }
  ],
  future: function() {
    return Promise.resolve(this.events);
  },
  all: function() {
    return Promise.resolve(this.events.slice(1));
  }
};

describe('EventList', () => {
  it('should call getEvents() and show results if route is "/events/future"', async () => {
    const wrapper = await mount(
      <EventList getEvents={EventAPI.future.bind(EventAPI)} />
    );
    wrapper.update();
    expect(wrapper.find(EventItem).length).toEqual(3);
  });

  it('should call getEvents() and show results if route is "/events/all"', async () => {
    const wrapper = await mount(
      <EventList getEvents={EventAPI.all.bind(EventAPI)} />
    );
    wrapper.update();
    expect(wrapper.find(EventItem).length).toEqual(2);
  });

  it('should show "No events found." message if no events found', async () => {
    const wrapper = await mount(
      <EventList getEvents={() => Promise.resolve([])} />
    );
    wrapper.update();
    expect(wrapper.contains('No events found.')).toBe(true);
  });
});
