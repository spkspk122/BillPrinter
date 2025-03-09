import {DEV_APP_SERVER_API} from '@env';
import axios from 'axios';
//constants, screens , store
import NavigationServices from '../navigation/navigationServices';
import {SCREENS} from '../navigation/screens';
import {getToken} from '../redux/selectors';

const request = ({url, method, data = null, headers = null, params = null}) => {
  const token = getToken();
  return new Promise((resolve, reject) => {
    let finalUrl = `${DEV_APP_SERVER_API}${url}`;
    let config = {
      url: finalUrl,
      method: method,
      // data: data ? data : {},
      data: headers?.data,
      headers: {
        'Content-Type': 'application/json',
        accept: '*/*',
        Authorization: token ? `Bearer ${token?.accessToken}` : '',
      },
    };
    const errorHandler = err => {
      if (err.toJSON().status === 400) {
        return reject(err);
      }
      reject(err);
    };

    //responseHandler

    const responseHandler = response => {
      if (response.status === 401) {
        NavigationServices.navigate(SCREENS.SPLASH);
        return reject(response);
      }
      resolve(response?.data);
    };

    axios.defaults.withCredentials = true;
    //satrt loader

    axios(config)
      .then(response => {
        let res = response?.data?.body;

        responseHandler(response);
      })
      .catch(error => {
        console.warn(error, 'Error');

        errorHandler(error);
      });
  });
};

export default request;
