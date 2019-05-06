import { RECENT_METRO_DATA, UPLOAD_ERROR_METRO, UPLOAD_FILE, ADD } from '../types';

export function handleUploadFileMetro(file, val) {
  return {
    type: UPLOAD_FILE,
    file: file,
    val
  };
}

export function handleUploadErrorMetro(val) {
  return {
    type: UPLOAD_ERROR_METRO,
    val
  };
}

export const handleRecentDataMetro = (payload, value) => {
  return {
    type: RECENT_METRO_DATA,
    payload: payload,
    val: value
  };
};

export const OnIncrementCounter = () => {
  return {
    type: ADD,
    val: 10
  };
};
