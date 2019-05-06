import { ACCOUNT_LIST, SWAP_BALANCE_DATA, REPORT_SCREEN_DATAS } from '../../actions/types';

const initialState = {
  AccountList: [],
  swapBalance: [],
  ReportScreenData: [],
  prev: false,
  next: false,
  limit: 200,
  totalPages: 0,
  totalValues: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ACCOUNT_LIST: {
      return {
        ...state,
        AccountList: action.val,
        searchAdminText: '',
        prev: action.pre,
        next: action.next,
        totalValues: action.total_count,
        totalPages: Math.ceil(action.total_count / state.limit)
      };
    }

    case SWAP_BALANCE_DATA: {
      return {
        ...state,
        swapBalance: action.val
      };
    }

    case REPORT_SCREEN_DATAS: {
      return {
        ...state,
        ReportScreenData: action.val
      };
    }

    default:
      return state;
  }
};

export default reducer;
