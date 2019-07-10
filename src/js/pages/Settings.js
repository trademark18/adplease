import React from 'react';
import { Page, List, ListItem } from 'react-onsenui';

import Header from '../components/Header';

const Settings = ({ back }) => {
  const listViewData = [
    {
      key: 'onDataClear',
      callback: () => onDataClear(),
      displayItems: ['Clear Data'],
      type: 'alert',
    },
  ];

  const onDataClear = () => {
    // TODO: Call Alert Prompt
    localStorage.clear();
    window.location.reload();
  };

  const _renderRow = row => (
    <ListItem key={row.key} tappable onClick={row.callback}>
      <div className="center">{row.displayItems}</div>
    </ListItem>
  );

  return (
    <Page renderToolbar={() => <Header title="Settings" back={back} />}>
      <List dataSource={listViewData} renderRow={_renderRow} />
    </Page>
  );
};

export default Settings;
