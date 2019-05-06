import { ACCOUNT_LIST, SWAP_BALANCE_DATA, REPORT_SCREEN_DATAS } from '../types';

export const OnAccountList = (data, total_count, pre, next) => {
  return {
    type: ACCOUNT_LIST,
    val: data,
    total_count,
    pre,
    next
  };
};

export const OnSwapBalanceData = data => {
  return {
    type: SWAP_BALANCE_DATA,
    val: data
  };
};

export const OnReportScreenData = data => {
  return {
    type: REPORT_SCREEN_DATAS,
    val: data
  };
};
