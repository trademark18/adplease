import React from 'react';
import { Button, Icon } from 'react-onsenui';

import MyPage from '../components/MyPage';
import SwipeableList from '../components/SwipeableList/SwipeableList';
import SwipeableListItem from '../components/SwipeableList/SwipeableListItem';
import TimeEntry from './TimeEntry';

const background = (
  <Icon
    size={{ default: 32, material: 40 }}
    icon={{ default: 'ion-ios-trash-outline' }}
  />);

// TODO: Array of Objects with Headings and Subheadings
const dummyData = [
  'Task 8459: 8:00AM - 8:30AM',
  'Planning: 8:30 AM - 8:45AM',
];

const TimeCard = ({ navigator }) => (
  <MyPage headerOptions={{ title: 'TimeCard', add: true, rightCallback: () => navigator.pushPage({ component: TimeEntry, props: { back: true } }) }}>
    <SwipeableList >
      {dummyData.map((value, idx) => (
        <SwipeableListItem background={background} key={idx} onClick={() => navigator.pushPage({ component: TimeEntry, props: { back: true, data: { startDate: new Date() } } })}>
          <Button modifier="quiet" style={{ color: 'black' }}>
            <div className="ItemContent">{value}</div>
          </Button>
        </SwipeableListItem>
      ))}
    </SwipeableList>
  </MyPage>
);

export default TimeCard;
