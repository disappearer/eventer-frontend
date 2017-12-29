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
  it('should call getEvents() and show results if route is "/events"', async () => {
    let wrapper = await mount(
      <EventList
        getEvents={EventAPI.future.bind(EventAPI)}
        onJoinClick={() => {}}
      />
    );
    wrapper.update();
    expect(wrapper.find(EventItem).length).toEqual(3);
    wrapper = await mount(
      <EventList
        getEvents={EventAPI.all.bind(EventAPI)}
        onJoinClick={() => {}}
      />
    );
    wrapper.update();
    expect(wrapper.find(EventItem).length).toEqual(2);
  });

  it('should show "No events found." message if no events found', async () => {
    const wrapper = await mount(
      <EventList getEvents={() => Promise.resolve([])} onJoinClick={() => {}} />
    );
    wrapper.update();
    expect(wrapper.contains('No events found.')).toBe(true);
  });

  it(`should have an "eventsJoined" prop and use it to send
      "joined" prop to appropriate EventItems`, async () => {
    const wrapper = await mount(
      <EventList
        getEvents={EventAPI.future.bind(EventAPI)}
        eventsJoined={['0', '2']}
        onJoinClick={() => {}}
      />
    );
    wrapper.update();
    expect(wrapper.findWhere(n => n.key() === '0').prop('joined')).toEqual(
      true
    );
    expect(wrapper.findWhere(n => n.key() === '1').prop('joined')).toEqual(
      false
    );
    expect(wrapper.findWhere(n => n.key() === '2').prop('joined')).toEqual(
      true
    );
  });

  it('should forward prop.onJoinClick to EventItems', async () => {
    const callback = () => {};
    const wrapper = await mount(
      <EventList
        getEvents={EventAPI.future.bind(EventAPI)}
        onJoinClick={callback}
      />
    );
    wrapper.update();
    wrapper.find(EventItem).forEach(eventItem => {
      expect(eventItem.prop('onJoinClick')).toEqual(callback);
    });
  });
});
