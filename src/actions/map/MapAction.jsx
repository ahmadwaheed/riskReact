import {
  FETCH_MARKERS,
  CLEAR_MARKERS,
  GET_SMS_CODE,
  GET_SMS_CODE_DATA,
  GET_ADVANCE_SEARCH_DATA,
  BACK_TO_MAP,
  ADD_LAYER,
  GET_ADDRESS_DATA,
  BEFORE_GET_ADDRESS_DATA,
  HANDLE_ISVIEWMAP_INFO,
  HANDLE_ISPAYMENT,
  HANDLE_VIEW_PAYMENT,
  HANDLE_ISDETAIL,
  HANDLE_VIEW_DETAIL,
  HANDLE_ADVANCED_FILTER,
  HANDLE_CLOSE_PAYMENT,
  SWITCHING_TAB_MAP
} from '../types';

export function handleFetchingMarkers(markers) {
  return {
    type: FETCH_MARKERS,
    markers: markers
  };
}

export function handleSwitchingTab() {
  return {
    type: SWITCHING_TAB_MAP
  };
}

export function clearMarkers() {
  return {
    type: CLEAR_MARKERS
  };
}

export function getSmsCode(data) {
  return {
    type: GET_SMS_CODE,
    data: data
  };
}

export function handleSmsaCodeData(data) {
  return {
    type: GET_SMS_CODE_DATA,
    data: data
  };
}

export function handleAdvanceSearchData(data) {
  return {
    type: GET_ADVANCE_SEARCH_DATA,
    data: data
  };
}

export function handleBackButtonFromAdavanceSearch() {
  return {
    type: BACK_TO_MAP
  };
}

export function addLayer() {
  return {
    type: ADD_LAYER
  };
}

export function handleAddressData(data) {
  return {
    type: GET_ADDRESS_DATA,
    data
  };
}

export function beforeGetAddressData() {
  return {
    type: BEFORE_GET_ADDRESS_DATA
  };
}

export function handleIspayment() {
  return {
    type: HANDLE_ISPAYMENT
  };
}

export function handleIsViewMapInfo() {
  return {
    type: HANDLE_ISVIEWMAP_INFO
  };
}

export function handleViewPayment(findresponse, paymentlist, ispaymentAdvanse) {
  return {
    type: HANDLE_VIEW_PAYMENT,
    findresponse,
    paymentlist,
    ispaymentAdvanse
  };
}

export function handleIsDetail(isDetails, data) {
  return {
    type: HANDLE_ISDETAIL,
    isDetails,
    data
  };
}

export function handleViewDetail(data, isDetails) {
  return {
    type: HANDLE_VIEW_DETAIL,
    isDetails,
    data
  };
}

export function handleAdvancedSearchFilter(isAdvanceSearch, findresponse) {
  return {
    type: HANDLE_ADVANCED_FILTER,
    isAdvanceSearch,
    findresponse
  };
}

export function handleClosePayment() {
  return {
    type: HANDLE_CLOSE_PAYMENT
  };
}
