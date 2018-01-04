import React from 'react';
import enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import sinon from 'sinon';
import NewEventForm from './NewEventForm';

enzyme.configure({ adapter: new Adapter() });

describe('NewEventForm', () => {
  let wrapper;

  const event = {
    id: 0,
    creatorId: 123,
    title: 'Some Event 1',
    description: 'Some random event with id 0',
    date: '2017-10-15T20:00:00.000Z',
    location: 'Somewhere',
    guestList: [123]
  };

  const EventAPI = {
    create: () => Promise.resolve(event)
  };

  const accessToken = 'randomString';

  beforeEach(() => {
    wrapper = shallow(
      <NewEventForm eventApi={EventAPI} accessToken={accessToken} />
    );
  });

  it('has a controlled input for the title', () => {
    const titleInput = wrapper.find({ name: 'title' });
    titleInput.simulate('change', {
      target: { name: 'title', value: 'Event Title' }
    });
    expect(wrapper.state('title')).toEqual('Event Title');
  });

  it('has a controlled input for the location', () => {
    const locationInput = wrapper.find({ name: 'location' });
    locationInput.simulate('change', {
      target: { name: 'location', value: 'Event location' }
    });
    expect(wrapper.state('location')).toEqual('Event location');
  });

  it('has a controlled input for date/time', () => {
    const date = new Date();
    const datePicker = wrapper.find('DateTimePicker');
    datePicker.simulate('change', date);
    wrapper.update();
    expect(wrapper.state('date')).toEqual(date);
  });

  it('has a controlled input for the description', () => {
    const descriptionInput = wrapper.find({ name: 'description' });
    descriptionInput.simulate('change', {
      target: { name: 'description', value: 'Event description' }
    });
    expect(wrapper.state('description')).toEqual('Event description');
  });

  it(`calls eventApi create method when "Create" button clicked
      and sets returned event in the state`, async () => {
    const state = {
      title: 'Some Title',
      location: 'Somewhere',
      description: 'Something',
      date: new Date()
    };
    wrapper.setState(state);
    const joinStub = sinon
      .stub(EventAPI, 'create')
      .returns(Promise.resolve({ event }));
    const button = wrapper.find('button');
    button.simulate('click');
    expect(joinStub.calledWith(accessToken, state)).toBe(true);
    await joinStub();
    expect(wrapper.state('event')).toEqual(event);
  });

  it(`when event is created (in the state) hides form 
      and renders created event data`, () => {
    expect(wrapper.find('#new-event-form').length).toEqual(1);
    wrapper.setState({ event });
    expect(wrapper.find('#new-event-form').length).toEqual(0);
    expect(wrapper.find('#new-event-data').length).toEqual(1);
  });

  it(`when event is set in state, it renders a "New Event" button
      that clears event from state`, () => {
    wrapper.setState({ event });
    const newEventButton = wrapper.find('button');
    newEventButton.simulate('click');
    expect(wrapper.state('event')).toBeNull();
  });
});
