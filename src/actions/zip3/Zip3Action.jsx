import { RECENT_DATA_ZIP, UPLOAD_ERROR_ZIP3, UPLOAD_FILE, ADD } from '../types';

export function handleUploadFileZip3(file, val) {
  return {
    type: UPLOAD_FILE,
    file: file,
    val
  };
}

export function handleUploadErrorZip3(val) {
  return {
    type: UPLOAD_ERROR_ZIP3,
    val
  };
}

export const handleRecentDataZip3 = (payload, value) => {
  return {
    type: RECENT_DATA_ZIP,
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
