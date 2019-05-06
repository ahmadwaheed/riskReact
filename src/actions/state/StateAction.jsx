import { RECENT_DATA_STATE, UPLOAD_ERROR, UPLOAD_FILE, ADD } from '../types';

export function handleUploadFileState(file, val) {
  return {
    type: UPLOAD_FILE,
    file: file,
    val
  };
}

export function handleUploadErrorState(val) {
  return {
    type: UPLOAD_ERROR,
    val
  };
}

export const handleRecentDataState = (payload, value) => {
  return {
    type: RECENT_DATA_STATE,
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
