import React from 'react';
import enzyme, { mount } from 'enzyme';
import sinon from 'sinon';
import Adapter from 'enzyme-adapter-react-16';
import { MemoryRouter } from 'react-router-dom';
import Nav from './Nav';

enzyme.configure({ adapter: new Adapter() });

describe('Nav', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(
      <MemoryRouter>
        <Nav />
      </MemoryRouter>
    );
  });

  it('should have an "Eventer" brand link', () => {
    const brand = wrapper.find('Link.navbar-brand');
    expect(brand.text()).toEqual('Eventer');
  });

  it('should have "Events" nav link', () => {
    const eventLink = wrapper.find('LiNavLink Link').find({ to: '/events' });
    expect(eventLink.text()).toEqual('Events');
  });

  it('should show "New Event" nav link if props.user', () => {
    expect(
      wrapper.find('LiNavLink').find({ to: '/events/new' }).length
    ).toEqual(0);
    wrapper = mount(
      <MemoryRouter>
        <Nav user="Aleksa" />
      </MemoryRouter>
    );
    const eventLink = wrapper
      .find('LiNavLink Link')
      .find({ to: '/events/new' });
    expect(eventLink.text()).toEqual('New Event');
  });

  it('should show "Login" button if no props.user', () => {
    expect(wrapper.find('button#login-btn').text()).toEqual('Log in');
    wrapper = mount(
      <MemoryRouter>
        <Nav user="Aleksa" />
      </MemoryRouter>
    );
    expect(wrapper.find('button#login-btn').length).toEqual(0);
  });

  it('should call login callback when "Log in" button is clicked', () => {
    const loginSpy = sinon.spy();
    wrapper = mount(
      <MemoryRouter>
        <Nav loginCallback={loginSpy} />
      </MemoryRouter>
    );
    const loginButton = wrapper.find('button#login-btn');
    loginButton.simulate('click');
    expect(loginSpy.called).toBe(true);
  });

  it('should show dropdown menu with "props.user" text if props.user', () => {
    expect(wrapper.find('a.dropdown-toggle').length).toEqual(0);
    wrapper = mount(
      <MemoryRouter>
        <Nav user="Aleksa" />
      </MemoryRouter>
    );
    expect(wrapper.find('a.dropdown-toggle').text()).toEqual('Aleksa');
    wrapper = mount(
      <MemoryRouter>
        <Nav user="Nada" />
      </MemoryRouter>
    );
    expect(wrapper.find('a.dropdown-toggle').text()).toEqual('Nada');
    expect(wrapper.find('div.dropdown-menu a.dropdown-item').text()).toEqual(
      'Log out'
    );
  });

  it('should call logout callback when "Log out" dropdown link is clicked', () => {
    const logoutSpy = sinon.spy();
    wrapper = mount(
      <MemoryRouter>
        <Nav user="Aleksa" logoutCallback={logoutSpy} />
      </MemoryRouter>
    );
    const logoutMenuLink = wrapper.find('#logout-link');
    logoutMenuLink.simulate('click');
    expect(logoutSpy.called).toBe(true);
  });
});
