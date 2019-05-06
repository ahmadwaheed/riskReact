import { BALANCE_DATA, GET_BORROWER_PAYMENT_HISTORY, GET_HOME_OWNER_PROPERTY, SETPOOLID } from '../../actions/types';

const initialState = {
  swapBalanceData: [],
  borrowerPaymentHistory: [],
  propertiesList: [],
  poolId: ''
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case BALANCE_DATA: {
      return {
        ...state,
        swapBalanceData: action.val
      };
    }

    case SETPOOLID: {
      return {
        ...state,
        poolId: action.val
      };
    }

    case GET_BORROWER_PAYMENT_HISTORY: {
      return {
        ...state,
        borrowerPaymentHistory: action.payload
      };
    }

    case GET_HOME_OWNER_PROPERTY: {
      return {
        ...state,
        propertiesList: action.payload
      };
    }

    default:
      return state;
  }
};

export default reducer;
