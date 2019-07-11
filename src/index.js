import React from 'react';
import ReactDOM from 'react-dom';
import { platform } from 'onsenui';

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
