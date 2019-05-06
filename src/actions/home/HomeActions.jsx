import { FETCH_RECORDS_ZIP, INPUT_ADDRESS, FETCH_RECORDS_ADDRESS, INPUT_ZIPCODE } from '../types';

export function handleFetchingRecordsZip(records, status) {
  return {
    type: FETCH_RECORDS_ZIP,
    fechedRecordsZip: records,
    statusZip: status
  };
}

export function inputZipCode(zipCode) {
  return {
    type: INPUT_ZIPCODE,
    zipCode: zipCode
  };
}

export function handleFetchingRecordsAddress(records, status) {
  return {
    type: FETCH_RECORDS_ADDRESS,
    fetchedRecordsAddress: records,
    statusAddress: status
  };
}

export function inputAddress(address) {
  return {
    type: INPUT_ADDRESS,
    address: address,
    statusAddress: ''
  };
}
