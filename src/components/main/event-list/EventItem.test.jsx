import React from 'react';
import enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import EventItem from './EventItem';
import { join } from 'path';

enzyme.configure({ adapter: new Adapter() });

const Weekdays = {
  1: 'Monday',
  2: 'Tuesday',
  3: 'Wednesday',
  4: 'Thursday',
  5: 'Friday',
  6: 'Saturday',
  0: 'Sunday'
};

const Months = {
  0: 'January',
  1: 'February',
  2: 'March',
  3: 'April',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'August',
  8: 'September',
  9: 'October',
  10: 'November',
  11: 'December'
};

const event = {
  id: 0,
  creatorId: 123,
  title: 'Some Event 1',
  description: 'Some random event with id 0',
  date: '2017-10-15T20:00:00.000Z',
  location: 'Somewhere',
  guestList: [123]
};

describe('EventItem', () => {
  let wrapper;
  let joinCallback = sinon.spy();

  beforeEach(() => {
    wrapper = shallow(<EventItem event={event} onJoinClick={joinCallback} />);
  });

  it('should have a css class "event"', () => {
    expect(wrapper.find('.event').length).toEqual(1);
  });

  it('should show title, location, description and guest count', () => {
    expect(
      wrapper
        .find('.title')
        .at(0)
        .text()
    ).toContain(event.title);
    expect(
      wrapper
        .find('.description')
        .at(0)
        .text()
    ).toContain(event.description);
    expect(
      wrapper
        .find('.location')
        .at(0)
        .text()
    ).toContain(`@ ${event.location}`);
    expect(
      wrapper
        .find('.guests')
        .at(0)
        .text()
    ).toContain(`Guests: ${event.guestList.length}`);
  });

  it('it should show day (of week), date and time', () => {
    const date = new Date(event.date);
    const minutes = date.getMinutes();
    const timeString = `${date.getHours()}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
    expect(
      wrapper
        .find('.weekday')
        .at(0)
        .text()
    ).toContain(Weekdays[date.getDay()]);
    expect(
      wrapper
        .find('.date')
        .at(0)
        .text()
    ).toContain(`${Months[date.getMonth()]} ${date.getDate()}`);
    expect(
      wrapper
        .find('.time')
        .at(0)
        .text()
    ).toContain(timeString);
  });

  it('should have a "Join" button if "joined" prop is false', () => {
    expect(
      wrapper
        .find('button')
        .at(0)
        .text()
    ).toContain('Join');
  });

  it('should have a "Joined" button if "joined" prop is true', () => {
    wrapper = shallow(
      <EventItem event={event} joined onJoinClick={joinCallback} />
    );
    expect(
      wrapper
        .find('button')
        .at(0)
        .text()
    ).toContain('Joined');
  });

  it(`should have a onJoinClick prop callback
      which is called with prop.joined value`, () => {
    let joinButton = wrapper.find('button');
    joinButton.simulate('click');
    expect(joinCallback.calledWith(false)).toEqual(true);
    wrapper = shallow(
      <EventItem event={event} joined onJoinClick={joinCallback} />
    );
    joinButton = wrapper.find('button');
    joinButton.simulate('click');
    expect(joinCallback.calledWith(true)).toEqual(true);
    expect(joinCallback.calledTwice).toEqual(true);
  });
});
