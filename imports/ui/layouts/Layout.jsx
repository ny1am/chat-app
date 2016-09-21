// Meteor Dependencies
import { FlowRouter } from 'meteor/kadira:flow-router';

// React Dependencies
import React from 'react';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';

import AccountsUIWrapper from '/imports/ui/shared/AccountsUIWrapper.jsx';

export default function Layout ({content}) {
  const titleLinkStyles = {
    textDecoration: 'none',
    color: 'white',
  }

  return (
    <MuiThemeProvider>
      <div>
        <AppBar
          title={
            <a style={titleLinkStyles} href={FlowRouter.path('enhancedChats')}>Awesome Chat App</a>
          }
          showMenuIconButton={false}
          iconElementRight={<AccountsUIWrapper />}
        />
        <div>{content}</div>
      </div>
    </MuiThemeProvider>
  );
}