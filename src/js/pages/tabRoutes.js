import React from 'react';

import TimeCard from './TimeCard';
import Settings from './Settings';

const withTabProps = (InputComponent, key, activeIndex, tabbar, navigator) => (
  <InputComponent
    active={activeIndex === key}
    key={key}
    tabbar={tabbar}
    navigator={navigator}
  />
);

const tabRoutes = [
  {
    component: TimeCard,
    title: 'TimeCard',
    icon: 'md-info',
  },
  {
    component: Settings,
    title: 'Settings',
    icon: 'md-settings',
  },
];

export { tabRoutes, withTabProps };
