import { RECENT_DATA_MASTER, UPLOAD_ERROR_MASTER, UPLOAD_FILE, ADD } from '../types';

export function handleUploadFileMaster(file, val) {
  return {
    type: UPLOAD_FILE,
    file: file,
    val
  };
}

export function handleUploadErrorMaster(val) {
  return {
    type: UPLOAD_ERROR_MASTER,
    val
  };
}

export const handleRecentDataMaster = (payload, value) => {
  return {
    type: RECENT_DATA_MASTER,
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
