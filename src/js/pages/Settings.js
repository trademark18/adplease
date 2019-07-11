import React from 'react';
import { List, ListItem } from 'react-onsenui';

import MyPage from '../components/MyPage';

const Settings = () => {
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
    <MyPage headerOptions={{ title: 'Settings' }}>
      <List dataSource={listViewData} renderRow={_renderRow} />
    </MyPage>
  );
};

export default Settings;
