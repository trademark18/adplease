import React from 'react';
import '../../../css/SwipeableList.css';

const SwipeableList = ({ children, background }) => (
  <div className="List">{
    React.Children
      .map(children, child => !child.props.background
        ? React.cloneElement(child, { background })
        : child)}
  </div>
);

export default SwipeableList;
