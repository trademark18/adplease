import React, { useState } from 'react';
import MyPage from '../components/MyPage';
import TimePicker from '../components/TimePicker';

const TimeEntry = ({ navigator, ...props }) => {
  const [timeDisplay, setTimeDisplay] = useState({
    startTime: null,
    endTime: null,
  });
  const [tempTimeDisplay, setTempTimeDisplay] = useState({
    startTime: null,
    endTime: null,
  });
  const [formData, setFormData] = useState({
    startTime: null,
    endTime: null,
  });

  const handleDismiss = key => {
    setTimeDisplay({ ...timeDisplay, [key]: null });
    setFormData({ ...formData, [key]: null });
  };

  const setTempTimeDisplayData = (key, value) => {
    setTempTimeDisplay({ ...tempTimeDisplay, [key]: value });
  };

  const setTimeData = (key, value) => {
    setTimeDisplay({ ...timeDisplay, [key]: tempTimeDisplay[key] });
    setFormData({ ...formData, [key]: value });
  };

  const handleValueChange = (timeProp, valueArr) => {
    let [hh] = valueArr;
    const [, mm, xm] = valueArr;
    if (hh === '0') hh = '12';
    setTempTimeDisplayData(
      timeProp,
      `${hh.padStart(2, 0)}:${mm.padStart(2, 0)} ${!Number(xm) ? 'AM' : 'PM'}`,
    );
  };

  // TODO: Rig up data from props
  return (
    <MyPage headerOptions={{ title: 'TimeCard', back: true, save: true }}>
      {JSON.stringify(props.data)}
      <TimePicker
        title="Choose Start Time"
        defaultText={timeDisplay.startTime || 'Start Time...'}
        defaultDate={formData.startTime}
        setTimeData={setTimeData}
        handleDismiss={handleDismiss}
        timeProp="startTime"
        handleValueChange={handleValueChange}
      />
      <TimePicker
        title="Choose End Time"
        defaultText={timeDisplay.endTime || 'End Time...'}
        defaultDate={formData.endTime || formData.startTime} // Stay relative to start time
        setTimeData={setTimeData}
        handleDismiss={handleDismiss}
        timeProp="endTime"
        handleValueChange={handleValueChange}
      />
    </MyPage>
  );
};

export default TimeEntry;
