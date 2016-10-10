// Meteor Dependencies and collections
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Tracker } from 'meteor/tracker';
import { Accounts } from 'meteor/accounts-base';
import '/imports/startup/accounts-config.js';

// React Dependencies
import React from 'react';
import { mount } from 'react-mounter';

// App Components
import Layout from '/imports/ui/layouts/Layout.jsx';

import Landing from '/imports/ui/pages/Landing.jsx';
import EnhancedChat from '/imports/ui/pages/EnhancedChat.jsx';

// Tap Events Hack
import injectTapEventPlugin from 'react-tap-event-plugin';
injectTapEventPlugin();

// Routes
FlowRouter.route('/', {
  name: 'root',
  action() {
    mount(Layout, {
      content: (<Landing />),
    });
  },
});

const chatRoutes = FlowRouter.group({
  prefix: '/chat',
  triggersEnter: [() => {
    if (!Meteor.userId()) FlowRouter.go('root');
  }],
});

chatRoutes.route('/', {
  name: 'chats',
  action() {
    mount(Layout, {
      content: (<EnhancedChat />),
    });
  },
});

chatRoutes.route('/:chatId', {
  name: 'chat',
  action() {
    mount(Layout, {
      content: (<EnhancedChat chatId={FlowRouter.current().params}/>),
    });
  },
});


// triggers
// Login
// Accounts.onLogin(() => FlowRouter.go('chats'));
// Logout
Tracker.autorun(() => {
  if (!Meteor.userId()) FlowRouter.go('root');
});