import React from 'react';
import '../../../css/SwipeableList.css';

const SwipeableList = ({ children, background }) => {
  const childrenWithProps = React.Children.map(children, child => {
    if (!child.props.background) {
      return React.cloneElement(child, { background });
    }
    return child;
  });
  return <div className="List">{childrenWithProps}</div>;
};

export default SwipeableList;
