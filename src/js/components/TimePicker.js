import React, { useState } from 'react';
import DatePicker from 'rmc-date-picker';
import Popup from 'rmc-picker/lib/Popup';

const TimePicker = ({
  title,
  defaultText,
  defaultDate,
  setTimeData,
  handleDismiss,
  timeProp,
  handleValueChange,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const onVisibleChange = () => {
    setIsVisible(!isVisible);
  };

  const datePicker = (
    <DatePicker
      rootNativeProps={{ 'data-xx': 'yy' }}
      defaultDate={defaultDate || new Date()}
      onValueChange={valueArr => handleValueChange(timeProp, valueArr)}
      mode="time"
      use12Hours
    />
  );
  return (
    <div>
      <Popup
        onVisibleChange={onVisibleChange}
        picker={datePicker}
        onOk={value => setTimeData(timeProp, value)}
        transitionName="rmc-picker-popup-slide-fade"
        maskTransitionName="rmc-picker-popup-fade"
        title={title || 'Time picker'}
        onDismiss={() => handleDismiss(timeProp)}
      >
        <input type="text" value={defaultText} readOnly />
      </Popup>
    </div>
  );
};

export default TimePicker;
