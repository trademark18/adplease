import React from 'react';
import ReactDOM from 'react-dom';
import { platform } from 'onsenui';
import 'rmc-picker/assets/index.css';
import 'rmc-date-picker/assets/index.css';
import 'rmc-picker/assets/popup.css';

import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const render = () => {
  ReactDOM.render(<App />, document.getElementById('root'));
  if (platform.isIPhoneX()) {
    document.documentElement.setAttribute('onsflag-iphonex-portrait', '');
    document.documentElement.setAttribute('onsflag-iphonex-landscape', '');
  }
};

registerServiceWorker();

render();
