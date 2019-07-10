import React from 'react';
import { Page, Button, Icon } from 'react-onsenui';

import Header from '../components/Header';
import SwipeableList from '../components/SwipeableList/SwipeableList';
import SwipeableListItem from '../components/SwipeableList/SwipeableListItem';
import Settings from './Settings';

const renderToolbar = () => <Header title="TimeCard" add />;

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

const TimeCard = ({ navigator }) => {
  console.log(navigator);
  return (
    <Page renderToolbar={renderToolbar}>
      <SwipeableList >
        {dummyData.map((value, idx) => (
          <SwipeableListItem background={background} key={idx} onClick={() => navigator.pushPage({ component: Settings, props: { back: true } })}>
            <Button modifier="quiet" style={{ color: 'black' }}>
              <div className="ItemContent">{value}</div>
            </Button>
          </SwipeableListItem>
      ))}
      </SwipeableList>
    </Page>
  );
};

export default TimeCard;
