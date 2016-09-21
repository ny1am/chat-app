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

import Conversations from '/imports/ui/pages/Conversations.jsx';
import Conversation from '/imports/ui/pages/Conversation.jsx';

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

const enhancedChatRoutes = FlowRouter.group({
  prefix: '/enhancedChat',
  triggersEnter: [() => {
    if (!Meteor.userId()) FlowRouter.go('root');
  }],
});

enhancedChatRoutes.route('/', {
  name: 'enhancedChats',
  action() {
    mount(Layout, {
      content: (<EnhancedChat />),
    });
  },
});

enhancedChatRoutes.route('/:chatId', {
  name: 'enhancedChat',
  action() {
    mount(Layout, {
      content: (<EnhancedChat chatId={FlowRouter.current().params}/>),
    });
  },
});


const chatRoutes = FlowRouter.group({
  prefix: '/chats',
  triggersEnter: [() => {
    if (!Meteor.userId()) FlowRouter.go('root');
  }],
});


chatRoutes.route('/', {
  name: 'chats',
  action() {
    mount(Layout, {
      content: (<Conversations />),
    });
  },
});

chatRoutes.route('/:chatId', {
  name: 'chat',
  action() {
    mount(Layout, {
      content: (<Conversation />),
    });
  },
});


// triggers
// Login
// Accounts.onLogin(() => FlowRouter.go('enhancedChats'));
// Logout
Tracker.autorun(() => {
  if (!Meteor.userId()) FlowRouter.go('root');
});