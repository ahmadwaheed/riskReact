import {
  STORE_POOLS_DATA,
  MORTGAGE_DROP_LIST,
  POOL_MORTGAGE_LIST,
  POOL_HISTORY_MORTGAGE_LIST,
  POOL_LEVEL_REPORTING,
  GET_POOL_PERIODS,
  GET_POOL_PROPERTIES,
  IS_SUCCESS,
  IS_ERROR,
  GET_BUSINESS_LIST,
  GET_USER_DATA,
  GET_COMPANY_DATA,
  GET_CSV_DATA
} from '../../actions/types';
import store from '../../store';
import Axios from 'axios';
import {
  add_pool_name,
  getPoolList,
  deletePoolList,
  getMortgageListDrop,
  getSelectdPoolMortgageList,
  addpoolmortgage,
  getPoolMortgageHistory,
  getPoolLevelReportingUrl,
  getPeriodPoolById,
  getPoolPropertieList,
  getBusiness,
  addBusiness,
  getUserData,
  addUserDataByAdmin,
  getCompanyData,
  addUserData,
  deleteUserData,
  deleteBusinessData,
  getUserInPools,
  getPoolCsv,
  getPoolPropertyDetail,
  hpiData,
  associateUserList,
  getLogs,
  update_fee,
  getSubscriptionFee,
  getUserInProperties,
  getPropertiesPool,
  getPoolHistoryExport,
  removepoolmortgage
} from '../../ConfigUri';
const { dispatch } = store;

// const dataHeader = JSON.parse(sessionStorage.getItem('user'));
export const savePoolData = (poolsData, userData, description, poolId, monthlyFee, annulayFee) => {
  let body;

  if (poolId === '') {
    body = {
      pool_name: poolsData,
      created_date: new Date(),
      pool_description: description,
      subscription_monthly_fee: Number(monthlyFee),
      subscription_annual_basis_point_fee: Number(annulayFee)
    };
  } else {
    body = {
      pool_name: poolsData,
      updated_date: new Date(),
      pool_description: description,
      pool_id: poolId,
      subscription_monthly_fee: Number(monthlyFee),
      subscription_annual_basis_point_fee: Number(annulayFee)
    };
  }

  const url = add_pool_name;

  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: userData.token
    }),
    body: JSON.stringify(body)
  })
    .then(Response => Response.json())
    .then(res => {
      if (res.success) {
        dispatch({
          type: IS_SUCCESS,
          isSuccess: true,
          payload: res.success
        });
      }

      return res;
    })
    .catch(err => {
      if (err) {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: err.message
        });
        return err;
      }
    });
};

export const updateFee = (userData, poolId, monthlyFee, annulayFee) => {
  let body;

  body = {
    pool_id: poolId,
    subscription_monthly_fee: Number(monthlyFee),
    subscription_annual_basis_point_fee: Number(annulayFee)
  };
  const url = update_fee;

  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: userData.token
    }),
    body: JSON.stringify(body)
  })
    .then(Response => Response.json())
    .then(res => {
      if (res.message === 'success') {
        dispatch({
          type: IS_SUCCESS,
          isSuccess: true,
          payload: res.message
        });
        return res;
      } else {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.message
        });
      }
    })
    .catch(err => {
      if (err) {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: err.message
        });
        return err;
      }
    });
};

export const storeMortgagePools = async (auth_token, check) => {
  const url = getPoolList + check;

  try {
    const res = await Axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res) {
      dispatch({
        type: STORE_POOLS_DATA,
        poolsData: res.data
      });
      return res.data;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const deleteMortgagePools = (auth_token, poolId, check) => {
  const url = deletePoolList;
  const body = {
    id: poolId,
    isarchive: check
  };

  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    }),
    body: JSON.stringify(body)
  })
    .then(Response => Response.json())
    .then(res => {
      if (res.data) {
        dispatch({
          type: IS_SUCCESS,
          isSuccess: true,
          payload: res.data
        });
      }
    })
    .catch(err => {
      if (err) {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: err.message
        });
        return err;
      }
    });
};

export const getMotgageDropList = auth_token => {
  const url = getMortgageListDrop;

  return fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(poolsData => {
      return dispatch({
        type: MORTGAGE_DROP_LIST,
        payload: poolsData
      });
    })
    .catch(err => {
      dispatch({
        type: IS_ERROR,
        isError: true,
        payload: err.message
      });
      return err;
    });
};

export const addMortgageData = (mortageData, auth_token) => {
  const url = addpoolmortgage;

  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    }),

    body: JSON.stringify(mortageData)
  })
    .then(Response => Response.json())
    .then(res => {
      if (res && res.success) {
        dispatch({
          type: IS_SUCCESS,
          isSuccess: true,
          payload: res.success
        });
        return res;
      } else {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.description
        });
      }
    })
    .catch(err => {
      if (err) {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: err.message
        });
        return err;
      }
    });
};

export const removeMortgageData = (mortageData, auth_token) => {
  const url = addpoolmortgage;

  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    }),

    body: JSON.stringify(mortageData)
  })
    .then(Response => Response.json())
    .then(res => {
      if (res && res.success) {
        dispatch({
          type: IS_SUCCESS,
          isSuccess: true,
          payload: res.success
        });
        return res;
      } else {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.details
        });
      }
    })
    .catch(err => {
      if (err) {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: err.message
        });
        return err;
      }
    });
};

export const getSelectedPoolMortgageList = (auth_token, id, pool_name, poolDate, value) => async dispatch => {
  const url = getSelectdPoolMortgageList + id + '/' + value;

  return await fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(mortgages => {
      dispatch({
        type: POOL_MORTGAGE_LIST,
        payload: mortgages,
        poolName: pool_name,
        poolId: id,
        poolDate: poolDate,
        description: mortgages.pool_description
      });
    })
    .catch(err => {
      dispatch({
        type: IS_ERROR,
        isError: true,
        payload: err.message
      });
      return err;
    });
};

export const getHistoryPoolMortgageList = (auth_token, poolId) => async dispatch => {
  const url = getPoolMortgageHistory + poolId;

  return await fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(mortgages => {
      dispatch({
        type: POOL_HISTORY_MORTGAGE_LIST,
        payload: mortgages
      });
    })
    .catch(err => {
      dispatch({
        type: IS_ERROR,
        isError: true,
        payload: err.message
      });
      return err;
    });
};

export const getPoolLevelReporting = (auth_token, poolId) => async dispatch => {
  const url = getPoolLevelReportingUrl + poolId;

  return await fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(poolreporting => {
      dispatch({
        type: POOL_LEVEL_REPORTING,
        payload: poolreporting
      });
    })
    .catch(err => {
      dispatch({
        type: IS_ERROR,
        isError: true,
        payload: err.message
      });
      return err;
    });
};

export const getPoolPeriod = async (auth_token, poolID) => {
  const url = getPeriodPoolById;

  try {
    const res = await Axios.get(url + poolID, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res.data) {
      dispatch({
        type: GET_POOL_PERIODS,
        payload: res.data.period
      });
      return res.data.period;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const getPoolProperties = async (auth_token, period, minimumQuater, minimumYear, id) => {
  let body = {
    minquater: minimumQuater,
    minyear: minimumYear,
    entry_quarter: period.quarter,
    year: period.year,
    pool_id: id
  };
  const url = getPoolPropertieList;

  try {
    const res = await Axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res.data) {
      dispatch({
        type: GET_POOL_PROPERTIES,
        payload: res.data.propertyData
      });
      return res.data.propertyData;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const addUpdateBusiness = (
  userData,
  businessName,
  phoneNo,
  address,
  publicUrl,
  businessType,
  businessId,
  notes
) => {
  let body;

  if (businessId === '') {
    body = {
      phone_no: phoneNo,
      company_name: businessName,
      partner_type: businessType,
      address: address,
      public_url: publicUrl,
      note: notes
    };
  } else {
    body = {
      phone_no: phoneNo,
      company_name: businessName,
      partner_type: businessType,
      address: address,
      public_url: publicUrl,
      id: businessId,
      note: notes
    };
  }

  const url = addBusiness;

  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: userData.token
    }),
    body: JSON.stringify(body)
  })
    .then(Response => Response.json())
    .then(res => {
      if (res.message !== 'Company already exists') {
        dispatch({
          type: IS_SUCCESS,
          isSuccess: true,
          payload: res.message
        });
        return res.message;
      }

      if (res.message === 'Company already exists') {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.message
        });
      }
    })
    .catch(err => {
      if (err) {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: err.message
        });
        return err;
      }
    });
};

export const getBusinessList = async auth_token => {
  const url = getBusiness;

  try {
    const res = await Axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res.data.data) {
      dispatch({
        type: GET_BUSINESS_LIST,
        poolsData: res.data.data
      });
      return res.data.data;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const getUserList = async (auth_token, data, search, showArchive) => {
  const url = getUserData;
  const body = {
    limit: data.limit,
    offset: data.offset,
    searchText: search || '',
    show_archieved: showArchive
  };

  try {
    const res = await Axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res.data.data) {
      dispatch({
        type: GET_USER_DATA,
        poolsData: res.data.data
      });
      return res.data;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const getCompanyList = async (auth_token, role) => {
  const url = getCompanyData + role;

  try {
    const res = await Axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res.data) {
      dispatch({
        type: GET_COMPANY_DATA,
        poolsData: res.data
      });
      return res.data;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const addUpdateUserData = (
  userData,
  firstName,
  lastName,
  email,
  role,
  companyName,
  userId,
  password,
  hashcode,
  phoneNumber,
  countryCode
) => {
  let body;
  let partner;

  if (companyName === '') {
    partner = 'null';
  } else {
    partner = companyName;
  }

  if (userId === '') {
    body = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      role: role,
      avatar_url:
        'http://www.linkuagentdemo.com/website/agent_zseries_files/9413/cropped_10192017122323-copy-userphotos_dir_agentphotomale.jpg',
      partner_id: partner,
      password: password,
      hashcode: hashcode,
      phoneNumber: phoneNumber,
      countryCode: countryCode
    };
  } else {
    body = {
      email: email,
      first_name: firstName,
      last_name: lastName,
      role: role,
      avatar_url:
        'http://www.linkuagentdemo.com/website/agent_zseries_files/9413/cropped_10192017122323-copy-userphotos_dir_agentphotomale.jpg',
      partner_id: partner,
      id: userId,
      phoneNumber: phoneNumber,
      countryCode: countryCode
    };
  }

  let url;

  if (role == 'Homeowner') {
    url = addUserDataByAdmin;
  } else {
    url = addUserData;
  }

  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: userData.token
    }),
    body: JSON.stringify(body)
  })
    .then(Response => Response.json())
    .then(res => {
      if (res.message === 'Property Hashcode exist with Homeowner') {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.message
        });
      } else if (res.message === 'Property hashcode not correct') {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.message
        });
      } else if (res.message) {
        dispatch({
          type: IS_SUCCESS,
          isSuccess: true,
          payload: res.message
        });
        return res.message;
      } else if (res.description) {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.details
        });
      }
    })
    .catch(err => {
      if (err) {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: err.message
        });
        return err;
      }
    });
};

export const deleteUser = async (auth_token, id, isArchive) => {
  const url = deleteUserData + id + '/' + isArchive;

  try {
    const res = await Axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res.data.message) {
      dispatch({
        type: IS_SUCCESS,
        isSuccess: true,
        payload: res.data.message
      });
      return res.data.message;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const deleteBusiness = async (auth_token, id) => {
  const url = deleteBusinessData + id;

  try {
    const res = await Axios.delete(url, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res.data.message === 'delete successfully') {
      dispatch({
        type: IS_SUCCESS,
        isSuccess: true,
        payload: res.data.message
      });
      return res.data.message;
    } else {
      dispatch({
        type: IS_ERROR,
        isError: true,
        payload: res.data.message
      });
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const getUserInPool = async (auth_token, id) => {
  const url = getUserInPools + id;

  try {
    const res = await Axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res.data) {
      return res.data;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const getCsvPoolData = async (auth_token, minimumYear, minimumQuater, id) => {
  let body = {
    minquater: minimumQuater,
    minyear: minimumYear,
    pool_id: id
  };
  const url = getPoolCsv;

  try {
    const res = await Axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res.data) {
      dispatch({
        type: GET_CSV_DATA,
        payload: res.data
      });
      return res.data;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const getPoolPropertiesDetail = async (auth_token, body) => {
  const url = getPoolPropertyDetail;

  try {
    const res = await Axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res) {
      return res;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const getHpiData = async (auth_token, id, date) => {
  const url = hpiData + id + '/' + date;

  try {
    const res = await Axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res.data) {
      return res.data;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const userRegistration = data => {
  let body = {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    role: data.role,
    avatar_url:
      'http://www.linkuagentdemo.com/website/agent_zseries_files/9413/cropped_10192017122323-copy-userphotos_dir_agentphotomale.jpg',
    password: data.password,
    hashcode: data.hashcode,
    phoneNumber: data.phoneNumber,
    countryCode: data.countryCode
  };

  const url = addUserData;

  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(body)
  })
    .then(Response => Response.json())
    .then(res => {
      if (res.message === 'Property Hashcode exist with Homeowner') {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.message
        });
      } else if (res.message === 'Property hashcode not correct') {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.message
        });
      } else if (res.message) {
        dispatch({
          type: IS_SUCCESS,
          isSuccess: true,
          payload: res.message
        });
        return res.message;
      } else if (res.description) {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.details
        });
      }
    })
    .catch(err => {
      if (err) {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: err.message
        });
      }
    });
};

export const userCreationInProperty = (data, auth_token)=> {
  let body = {
    email: data.email,
    first_name: data.firstName,
    last_name: data.lastName,
    role: data.role,
    avatar_url:
      'http://www.linkuagentdemo.com/website/agent_zseries_files/9413/cropped_10192017122323-copy-userphotos_dir_agentphotomale.jpg',
    password: data.password,
    hashcode: data.hashcode,
    phoneNumber: data.phoneNumber,
    countryCode: data.countryCode
  };

  const url = addUserDataByAdmin;

  return fetch(url, {
    method: 'POST',
    headers: new Headers({
      auth_token: auth_token,
      'Content-Type': 'application/json'
    }),
    body: JSON.stringify(body)
  })
    .then(Response => Response.json())
    .then(res => {
      if (res.message === 'Property Hashcode exist with Homeowner') {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.message
        });
      } else if (res.message === 'Property hashcode not correct') {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.message
        });
      } else if (res.message) {
        dispatch({
          type: IS_SUCCESS,
          isSuccess: true,
          payload: res.message
        });
        return res.message;
      } else if (res.description) {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: res.details
        });
      }
    })
    .catch(err => {
      if (err) {
        dispatch({
          type: IS_ERROR,
          isError: true,
          payload: err.message
        });
      }
    });
};

export const getAssociateUserList = async (auth_token, id, data, search) => {
  const url = associateUserList + id;
  const body = {
    limit: data.limit,
    offset: data.offset,
    searchText: search || ''
  };

  try {
    const res = await Axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res.data.Users) {
      dispatch({
        type: GET_USER_DATA,
        poolsData: res.data.Users
      });
      return res.data;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const getLogsData = async (auth_token, data, search) => {
  const url = getLogs;
  const body = {
    limit: data.limit,
    offset: data.offset,
    searchText: search || ''
  };

  try {
    const res = await Axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res.data.activity) {
      return res.data;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const getSubscritionHistory = async (auth_token, id) => {
  const url = getSubscriptionFee + id;

  try {
    const res = await Axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res.data) {
      return res.data;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const getUserInProperty = async (auth_token, id) => {
  const url = getUserInProperties + id;

  try {
    const res = await Axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res.data) {
      return res.data;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const getPropertiesForPool = async (auth_token, data, search, poolId) => {
  const url = getPropertiesPool + poolId;
  const body = {
    limit: data.limit,
    offset: data.offset,
    searchText: search || ''
  };

  try {
    const res = await Axios.post(url, body, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res.data.property) {
      // dispatch({
      //   type: GET_USER_DATA,
      //   poolsData: res.data.Users,
      // });
      return res.data;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export const getPoolHistoryToExport = async (auth_token, id) => {
  const url = getPoolHistoryExport + id;

  try {
    const res = await Axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        auth_token: auth_token
      }
    });

    if (res && res.data) {
      return res.data;
    }
  } catch (err) {
    dispatch({
      type: IS_ERROR,
      isError: true,
      payload: err.message
    });
    return err;
  }
};

export function noPoolHistoryExportError() {
  dispatch({
    type: IS_ERROR,
    isError: true,
    payload: 'No pool history to export.'
  });
}
