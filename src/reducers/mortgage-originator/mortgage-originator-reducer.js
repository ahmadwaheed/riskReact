import { MONTH_DATA, INFO_WINDOW_DATA, REPORT_SCREEN_DATA, ACCOUNT_INFO_DATA } from '../../actions/types';

const initialState = {
  monthData: [],
  windowData: [],
  ReportScreenData: [],
  AccountInfoData: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case MONTH_DATA: {
      return {
        ...state,
        monthData: action.val
      };
    }

    case INFO_WINDOW_DATA: {
      return {
        ...state,
        windowData: action.val
      };
    }

    case REPORT_SCREEN_DATA: {
      return {
        ...state,
        ReportScreenData: action.val
      };
    }

    case ACCOUNT_INFO_DATA: {
      return {
        ...state,
        AccountInfoData: action.val
      };
    }

    default:
      return state;
  }
};

export default reducer;
