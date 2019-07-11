import React from 'react';
import { Toolbar, BackButton, ToolbarButton, Icon } from 'react-onsenui';

const Header = ({ back, title, add, save, rightCallback }) => (
  <Toolbar>
    <div className={`left ${back ? '' : 'hidden'}`}>
      <BackButton>Back</BackButton>
    </div>
    <div className="center">{title}</div>
    <div className={`right ${add || save ? '' : 'hidden'}`}>
      <ToolbarButton onClick={rightCallback}>
        {add && (
          <Icon
            size={{ default: 32, material: 40 }}
            icon={{ default: 'ion-compose' }}
          />)}
        {save && 'Save'}
      </ToolbarButton>
    </div>
  </Toolbar>
);

export default Header;
