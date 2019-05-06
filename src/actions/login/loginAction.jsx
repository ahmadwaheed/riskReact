import { LOGIN, LOGOUT, IS_SUCCESS, IS_ERROR } from '../../actions/types';
import {
  forgetPasswordUrl,
  redirtUrl,
  resetPassword,
  checkFirstLogIn,
  renewPasswordUrl,
  getUserProfile
} from '../../ConfigUri';
import store from '../../store';
const { dispatch } = store;

export function login(userData, val) {
  sessionStorage.setItem('isLogin', val);
  sessionStorage.setItem('user', JSON.stringify(userData));

  return {
    type: LOGIN,
    payload: userData,
    val
  };
}

export function logout2(val) {
  sessionStorage.clear();
  return {
    type: LOGOUT,
    val
  };
}

export function error(message) {
  return dispatch({
    type: IS_ERROR,
    isError: true,
    payload: message
  });
}

export function success(message) {
  return dispatch({
    type: IS_SUCCESS,
    isSuccess: true,
    payload: message
  });
}

export const forgetPassword = value => {
  const url = forgetPasswordUrl;
  const body = {
    email: value,
    host: redirtUrl
  };

  return fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body)
  })
    .then(Response => Response.json())
    .then(findresponse => {
      if (findresponse.message === 'Password Reset. Please Check Your Email') {
        dispatch({
          type: IS_SUCCESS,
          isSuccess: true,
          payload: findresponse.message
        });
        return findresponse.message;
      } else {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: findresponse.description
        });
      }
    })
    .catch(err => {});
};

export const changePassword = (password, token) => {
  const url = resetPassword;
  const body = {
    password: password,
    resettoken: token
  };

  return fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body)
  })
    .then(Response => Response.json())
    .then(findresponse => {
      if (findresponse.message === 'Password is Updated') {
        dispatch({
          type: IS_SUCCESS,
          isSuccess: true,
          payload: findresponse.message
        });
        return findresponse.message;
      } else {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: findresponse.description
        });
      }
    })
    .catch(err => {
      dispatch({
        type: IS_ERROR,
        isError: true,
        payload: err.message
      });
      return err.message;
    });
};

export const renewPassword = (newPassword, current) => {
  const url = renewPasswordUrl;
  const body = {
    password: newPassword,
    tempPassword: current
  };

  return fetch(url, {
    method: 'POST',
    headers: new Headers({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body)
  })
    .then(Response => Response.json())
    .then(findresponse => {
      if (findresponse.message === 'Password is Updated') {
        dispatch({
          type: IS_SUCCESS,
          isSuccess: true,
          payload: findresponse.message
        });
        return findresponse.message;
      } else {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: findresponse.description
        });
      }
    })
    .catch(err => {
      dispatch({
        type: IS_ERROR,
        isError: true,
        payload: err.message
      });
      return err.message;
    });
};

export const isFirstLogIn = (username, props) => {
  const url = checkFirstLogIn + username;

  return fetch(url, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json' })
  })
    .then(Response => Response.json())
    .then(findresponse => {
      if (findresponse.isloggedin || !findresponse.isloggedin) {
        return findresponse.isloggedin;
      } else {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: findresponse.description
        });
        return null;
      }
    })
    .catch(err => {
      dispatch({
        type: IS_ERROR,
        isError: true,
        payload: err.message
      });
      return err.message;
    });
};

export const socialLogin = token => {
  const url = getUserProfile;

  return fetch(url, {
    method: 'GET',
    headers: new Headers({ 'Content-Type': 'application/json', auth_token: token }),
  })
    .then(Response => Response.json())
    .then(findresponse => {
      if (findresponse) {
        return findresponse;
      } else {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: findresponse.description
        });
      }
    })
    .catch(err => {
      dispatch({
        type: IS_ERROR,
        isError: true,
        payload: err.message
      });
      return err.message;
    });
};
