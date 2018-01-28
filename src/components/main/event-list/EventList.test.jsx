import React from 'react';
import enzyme, { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import EventList from './EventList';
import EventItem from './EventItem';

enzyme.configure({ adapter: new Adapter() });

const EVENT_API = {
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
    return Promise.resolve({ events: this.events });
  },
  all: function() {
    return Promise.resolve({ events: this.events.slice(1) });
  }
};

describe('EventList', () => {
  it('should call api.future() and show results if route is "/events"', async () => {
    const wrapper = await mount(
      <EventList api={EVENT_API} onJoinClick={() => {}} />
    );
    wrapper.update();
    expect(wrapper.find(EventItem).length).toEqual(3);
  });

  it('should show "No events found." message if no events found', async () => {
    const wrapper = await mount(
      <EventList
        api={{ future: () => Promise.resolve({ events: [] }) }}
        onJoinClick={() => {}}
      />
    );
    wrapper.update();
    expect(wrapper.contains('No events found.')).toBe(true);
  });

  it(`should have an "eventsJoined" prop and use it to send
      "joined" prop to appropriate EventItems`, async () => {
    const wrapper = await mount(
      <EventList
        api={EVENT_API}
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

  it(`handleEventJoin calls onJoinClick prop and
      sets the updated event in state`, async () => {
    const event = EVENT_API.events[0];
    const updatedEvent = { ...event, guestList: [...event.guestList, 246] };
    const callback = () => Promise.resolve(updatedEvent);
    const wrapper = await mount(
      <EventList api={EVENT_API} onJoinClick={callback} />
    );
    wrapper.update();
    wrapper.instance().handleEventJoin(0);
    await callback();
    let updatedEvents = [updatedEvent, ...EVENT_API.events.slice(1)];
    expect(wrapper.state('events')).toEqual(updatedEvents);
  });

  it('should forward handleEventJoin to EventItems', async () => {
    const callback = () => {};
    const wrapper = await mount(
      <EventList api={EVENT_API} onJoinClick={callback} />
    );
    wrapper.update();
    wrapper.find(EventItem).forEach(eventItem => {
      expect(eventItem.prop('onJoinClick')).toEqual(
        wrapper.instance().handleEventJoin
      );
    });
  });

  it('should update events on checkbox change', async () => {
    const wrapper = await mount(
      <EventList api={EVENT_API} onJoinClick={() => {}} />
    );
    wrapper.update();
    const checkbox = wrapper.find('input');
    checkbox.simulate('change', { target: { checked: false } });
    await EVENT_API.all();
    wrapper.update();
    expect(wrapper.find(EventItem).length).toEqual(2);
  });
});
