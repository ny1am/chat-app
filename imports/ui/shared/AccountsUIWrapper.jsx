// Meteor Dependencies
import { Template } from 'meteor/templating';
import { Blaze } from 'meteor/blaze';

// React Dependencies
import React, { Component } from 'react';

export default class AccountsUIWrapper extends Component {
  componentDidMount() {
    this.view = Blaze.render(Template.loginButtons, this.node);
  }

  componentWillUnmount() {
    Blaze.remove(this.view);
  }

  render() {
    return <span ref={node => this.node = node} />;
  }
}