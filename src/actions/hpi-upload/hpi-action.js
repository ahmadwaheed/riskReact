import {
  ADD,
  LOCAL_STORE,
  HPI_DATA_CBSA,
  HPI_DATA_STATE,
  HPI_DATA_ZIP,
  HPI_DATA_ZIP3,
  IS_ERROR,
  HPI_DATA_MASTER
} from '../types';
import { exportCsv } from '../../ConfigUri';

export const OnIncrementCounter = () => {
  return {
    type: ADD,
    val: 10
  };
};

export const OnAuthenticateDataSave = data => {
  return {
    type: LOCAL_STORE,
    val: data
  };
};

export const exportCsvData = (auth_token, type) => {
  const url = exportCsv + type;

  return fetch(url, {
    method: 'GET',
    headers: new Headers({
      'Content-Type': 'application/json',
      auth_token: auth_token
    })
  })
    .then(Response => Response.json())
    .then(Response => {
      if (Response && Response.length > 0) {
        return Response;
      }
    })
    .catch(error => {
      return {
        type: IS_ERROR,
        isError: true,
        payload: error.message
      };
    });
};

export const getCbsaData = data => {
  return {
    type: HPI_DATA_CBSA,
    payload: data
  };
};

export const getStateData = data => {
  return {
    type: HPI_DATA_STATE,
    payload: data
  };
};

export const getZipData = data => {
  return {
    type: HPI_DATA_ZIP,
    payload: data
  };
};

export const getZip3Data = data => {
  return {
    type: HPI_DATA_ZIP3,
    payload: data
  };
};

export const getMasterData = data => {
  return {
    type: HPI_DATA_MASTER,
    payload: data
  };
};

