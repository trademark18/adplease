import React from 'react';
import { Page } from 'react-onsenui';
import Header from './Header';

const MyPage = ({ children, headerOptions }) => (
  <Page renderToolbar={() => <Header {...headerOptions} />}>
    {children}
  </Page>
);

export default MyPage;
