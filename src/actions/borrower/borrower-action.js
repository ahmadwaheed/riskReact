import store from '../../store';
import {
  getBorrowerPayment,
  getBorrowerBill,
  getBorrowerPaid,
  getUserProperties,
  getUserPool,
  addUserProperty,
  unassociateUser,
  getExit
} from '../../ConfigUri';
import {
  BALANCE_DATA,
  GET_BORROWER_PAYMENT_HISTORY,
  IS_ERROR,
  IS_SUCCESS,
  GET_HOME_OWNER_PROPERTY,
  SETPOOLID
} from '../types';
// export const OnIncrementCounter = () => {
//     return {
//         type: actionType.ADD,
//         val: 10
//     };
// };

export const OnSwapBalanceData = data => {
  return {
    type: BALANCE_DATA,
    val: data
  };
};

export const setPoolId = Id => {
  return {
    type: SETPOOLID,
    val: Id
  };
};

export const getBorrowerPaymentHistory = (auth_token, propertyId, poolId) => {
  const url = getBorrowerPayment;

  return fetch(url + propertyId + '/' + poolId, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(Response => {
      store.dispatch({
        type: GET_BORROWER_PAYMENT_HISTORY,
        payload: Response
      });
      return Response;
    })
    .catch(error => {
      store.dispatch({
        type: IS_ERROR,
        isError: true,
        payload: error.message
      });
      return error;
    });
};

export const getBorrowerBillDetail = (auth_token, id, poolId) => {
  const url = getBorrowerBill;

  return fetch(url + id + '/' + poolId, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(Response => {
      // store.dispatch({
      //   type: GET_BORROWER_PAYMENT_HISTORY,
      //   payload: Response,
      // });
      return Response;
    })
    .catch(error => {
      store.dispatch({
        type: IS_ERROR,
        isError: true,
        payload: error.message
      });
      return error;
    });
};

export const getBorrowerPaidDetail = (auth_token, id, poolId) => {
  const url = getBorrowerPaid;

  return fetch(url + id + '/' + poolId, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(Response => {
      // store.dispatch({
      //   type: GET_BORROWER_PAYMENT_HISTORY,
      //   payload: Response,
      // });
      return Response[0];
    })
    .catch(error => {
      store.dispatch({
        type: IS_ERROR,
        isError: true,
        payload: error.message
      });
      return error;
    });
};

export const getHomeOwnerProperties = (auth_token, userId) => {
  const url = getUserProperties;

  return fetch(url + userId, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(Response => {
      store.dispatch({
        type: GET_HOME_OWNER_PROPERTY,
        payload: Response
      });
      return Response;
    })
    .catch(error => {
      store.dispatch({
        type: IS_ERROR,
        isError: true,
        payload: error.message
      });
      return error;
    });
};

export const getUserPoolData = (auth_token, propertyId, poolId) => {
  const url = getUserPool;

  return fetch(url + poolId + '/' + propertyId, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(Response => {
      // store.dispatch({
      //   type: GET_BORROWER_PAYMENT_HISTORY,
      //   payload: Response,
      // });
      return Response;
    })
    .catch(error => {
      store.dispatch({
        type: IS_ERROR,
        isError: true,
        payload: error.message
      });
      return error;
    });
};

export const addProperty = (token, hash, data) => {
  const url = addUserProperty;
  const body = {
    hashcode: hash,
    userid: data.id
  };

  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: token
    }),
    body: JSON.stringify(body)
  })
    .then(Response => Response.json())
    .then(res => {
      if (res.message === 'Property Hashcode exist with Homeowner') {
        store.dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.message
        });
      } else if (res.message === 'Property hashcode not correct') {
        store.dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.message
        });
      } else if (res.message) {
        store.dispatch({
          type: IS_SUCCESS,
          isSuccess: true,
          payload: data.first_name + ' ' + data.last_name + ' has been associated with this property.'
        });
        return res.message;
      } else if (res.description) {
        store.dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.details
        });
      }
    })
    .catch(err => {
      store.dispatch({
        type: IS_ERROR,
        isError: true,
        payload: err.message
      });
      return err.message;
    });
};

export const unAssociate = (token, data) => {
  const url = unassociateUser;
  const body = {
    userid: data.id,
    propertyid: data.propertyid
  };

  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: token
    }),
    body: JSON.stringify(body)
  })
    .then(Response => Response.json())
    .then(res => {
      if (res && res.message) {
        store.dispatch({
          type: IS_SUCCESS,
          isSuccess: true,
          payload: res.message
        });
        return res.message;
      } else if (res && res.description) {
        store.dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.details
        });
      }
    })
    .catch(err => {
      store.dispatch({
        type: IS_ERROR,
        isError: true,
        payload: err.message
      });
      return err.message;
    });
};

export const getExitDate = (token, poolid, propertyid) => {
  const url = getExit;
  const body = {
    propertyid: propertyid,
    poolid: poolid
  };

  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: token
    }),
    body: JSON.stringify(body)
  })
    .then(Response => Response.json())
    .then(res => {
      if (res) {
        return res;
      } else if (res && res.description) {
        store.dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.details
        });
      }
    })
    .catch(err => {
      store.dispatch({
        type: IS_ERROR,
        isError: true,
        payload: err.message
      });
      return err.message;
    });
};
