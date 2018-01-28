import React from 'react';
import enzyme, { shallow } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import EventItem from './EventItem';
import { WEEKDAYS, MONTHS } from '../date.helper';

enzyme.configure({ adapter: new Adapter() });

const EVENT = {
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
    wrapper = shallow(<EventItem event={EVENT} onJoinClick={joinCallback} />);
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
    ).toContain(EVENT.title);
    expect(
      wrapper
        .find('.description')
        .at(0)
        .text()
    ).toContain(EVENT.description);
    expect(
      wrapper
        .find('.location')
        .at(0)
        .text()
    ).toContain(`@ ${EVENT.location}`);
    expect(
      wrapper
        .find('.guests')
        .at(0)
        .text()
    ).toContain(`Guests: ${EVENT.guestList.length}`);
  });

  it('it should show day (of week), date and time', () => {
    const date = new Date(EVENT.date);
    const minutes = date.getMinutes();
    const timeString = `${date.getHours()}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
    expect(
      wrapper
        .find('.weekday')
        .at(0)
        .text()
    ).toContain(WEEKDAYS[date.getDay()]);
    expect(
      wrapper
        .find('.date')
        .at(0)
        .text()
    ).toContain(`${MONTHS[date.getMonth()]} ${date.getDate()}`);
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
      <EventItem event={EVENT} joined onJoinClick={joinCallback} />
    );
    expect(
      wrapper
        .find('button')
        .at(0)
        .text()
    ).toContain('Joined');
  });

  it(`should have a onJoinClick prop callback
      which is called with event id`, () => {
    wrapper = shallow(<EventItem event={EVENT} onJoinClick={joinCallback} />);
    const joinButton = wrapper.find('button');
    joinButton.simulate('click');
    expect(joinCallback.calledWith(EVENT.id)).toEqual(true);
    expect(joinCallback.calledOnce).toEqual(true);
  });

  it(`should do nothing if clicking on (already)
      "Joined" button`, () => {
    const joinCallback = sinon.spy();
    wrapper = shallow(
      <EventItem event={EVENT} joined onJoinClick={joinCallback} />
    );
    const joinButton = wrapper.find('button');
    joinButton.simulate('click');
    expect(joinCallback.called).toEqual(false);
  });
});
