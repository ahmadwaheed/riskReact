import { MONTH_DATA, INFO_WINDOW_DATA, REPORT_SCREEN_DATA, ACCOUNT_INFO_DATA } from '../types';

export const OnMonthData = data => {
  return {
    type: MONTH_DATA,
    val: data
  };
};

export const OninfoWindowData = data => {
  return {
    type: INFO_WINDOW_DATA,
    val: data
  };
};

export const OnreportScreenData = data => {
  return {
    type: REPORT_SCREEN_DATA,
    val: data
  };
};

export const OnAccountInfoData = data => {
  return {
    type: ACCOUNT_INFO_DATA,
    val: data
  };
};
