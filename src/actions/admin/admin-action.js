import Axios from 'axios';
import {
  OPEN_MORTGAGE_UPDATION_FORM,
  CLOSE_MORTGAGE_UPDATION_FORM,
  START_LOADING,
  STOP_LOADING,
  FILTERED_MORTGAGE_LIST,
  UPDATED_SEARCH,
  GET_PORTFOLIO_PERFORMANCE,
  GET_SWAP_TO_PORTFOLIO_INDEX,
  GET_SWAP_VALUES,
  GET_POOL_HISTORY_DATA,
  IS_ERROR,
  IS_SUCCESS,
  ASSOCIATE_HOMEOWNER
} from '../../actions/types';
import store from '../../store';
import {
  getPortfolioPerformances,
  getWeightAvg,
  poolHistory,
  searchMortgage,
  propertyUserList,
  addProperty,
  companyList
} from '../../ConfigUri';

export const saveSelectedMortgageData = (selectedMortgageData, paymentsData, poolId) => {
  return {
    type: OPEN_MORTGAGE_UPDATION_FORM,
    selectedMortgageData,
    paymentsData,
    poolId
  };
};

export const clearSelectedMortgageData = (searchMortgage, searchAdminText) => {
  return {
    type: CLOSE_MORTGAGE_UPDATION_FORM,
    searchMortgage,
    searchAdminText
  };
};

export const startLoading = () => {
  return {
    type: START_LOADING
  };
};

export const stopLoading = () => {
  return {
    type: STOP_LOADING
  };
};

export const filteMortgageList = searchText => {
  return {
    type: FILTERED_MORTGAGE_LIST,
    searchText
  };
};

export const updatedMortgageSearch = searchText => {
  return {
    type: UPDATED_SEARCH,
    searchText
  };
};

export const getPortfolioPerformance = auth_token => {
  const url = getPortfolioPerformances;

  return fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(portfolioData => {
      store.dispatch({
        type: GET_PORTFOLIO_PERFORMANCE,
        payload: portfolioData
      });
      return portfolioData;
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

export const getSwapToPortfolioIndex = auth_token => {
  const url = getWeightAvg;

  return fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(Response => {
      store.dispatch({
        type: GET_SWAP_TO_PORTFOLIO_INDEX,
        valueArray: Response.valueArray,
        avgArray: Response.avgData
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

export const getSwapValue = auth_token => {
  const url = getWeightAvg;

  return fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(Response => {
      store.dispatch({
        type: GET_SWAP_VALUES,
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

export const getPoolHistoryData = (auth_token, propertyId) => {
  const url = poolHistory;

  return fetch(url + propertyId, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(Response => {
      store.dispatch({
        type: GET_POOL_HISTORY_DATA,
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

export const disableMessage = () => {
  return dispatch => {
    store.dispatch({
      type: IS_SUCCESS,
      isSuccess: false,
      payload: ''
    });

    store.dispatch({
      type: IS_ERROR,
      isError: false,
      payload: ''
    });
  };
};

export const getSearchMortgageList = async (auth_token, value) => {
  const url = searchMortgage;
  const body = {
    searchText: value
  };

  return await Axios.post(url, body, {
    headers: {
      'Content-Type': 'application/json',
      auth_token: auth_token
    }
  })
    .then(({ data }) => {
      return data;
    })
    .catch(err => {
      store.dispatch({
        type: IS_ERROR,
        isError: true,
        payload: err.message
      });
      return err;
    });
};

export const addPropertyData = async (auth_token, value) => {
  const url = addProperty;
  const body = {
    address1: value.address1,
    city: value.city,
    state: value.state,
    postalcode: value.postalcode,
    lat: value.lat,
    long: value.long,
    __type: value.type,
    icensusyear: value.icensusyear,
    scountycode: value.scountycode,
    scountyname: value.scountyname,
    first_mortgage_loan_amount: value.firstMortgageAmount
  };

  return await Axios.post(url, body, {
    headers: {
      'Content-Type': 'application/json',
      auth_token: auth_token
    }
  })
    .then(({ data }) => {
      if (data.message === 'New Property Added') {
        store.dispatch({
          type: IS_SUCCESS,
          isSuccess: true,
          payload: data.message
        });
        return data;
      } else {
        store.dispatch({
          type: IS_ERROR,
          isError: true,
          payload: data.message
        });
      }
    })
    .catch(err => {
      store.dispatch({
        type: IS_ERROR,
        isError: true,
        payload: err.message
      });
      return err;
    });
};

export const getCompanyList = auth_token => {
  const url = companyList;

  return fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(Response => {
      if (Response && Response.data) {
        return Response.data;
      }
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

export const getAssociatedHomeowner = (auth_token, id) => {
  const url = propertyUserList + id;

  return fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(Response => {
      store.dispatch({
        type: ASSOCIATE_HOMEOWNER,
        payload: Response.properties
      });
      if (Response && Response.properties) {
        return Response.properties;
      }
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
