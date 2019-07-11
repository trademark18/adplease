import React from 'react';
import MyPage from '../components/MyPage';

const TimeEntry = ({ navigator, ...props }) => (
  <MyPage headerOptions={{ title: 'TimeCard', back: true, save: true }}>
    {JSON.stringify(props.data)}
  </MyPage>
);

export default TimeEntry;
