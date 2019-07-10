import React from 'react';
import { Toolbar, BackButton, ToolbarButton, Icon } from 'react-onsenui';

const Header = ({ back, title, add }) => (
  <Toolbar>
    <div className={`left ${back ? '' : 'hidden'}`}>
      <BackButton>Back</BackButton>
    </div>
    <div className="center">{title}</div>
    <div className={`right ${add ? '' : 'hidden'}`}>
      <ToolbarButton onClick={() => console.log('push add TimeCardEntry page')}>
        <Icon
          size={{ default: 32, material: 40 }}
          icon={{ default: 'ion-compose' }}
        />
      </ToolbarButton>
    </div>
  </Toolbar>
);

export default Header;
