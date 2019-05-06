import { RECENT_DATA_ZIP, UPLOAD_ERROR_ZIP, UPLOAD_FILE, ADD } from '../types';

export function handleUploadFileZip(file, val) {
  return {
    type: UPLOAD_FILE,
    file: file,
    val
  };
}

export function handleUploadErrorZip(val) {
  return {
    type: UPLOAD_ERROR_ZIP,
    val
  };
}

export const handleRecentDataZip = (payload, value) => {
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
