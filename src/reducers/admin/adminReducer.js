import {
  OPEN_MORTGAGE_UPDATION_FORM,
  CLOSE_MORTGAGE_UPDATION_FORM,
  START_LOADING,
  STOP_LOADING,
  FILTERED_MORTGAGE_LIST,
  UPDATED_SEARCH,
  ON_LOGOUT,
  STORE_POOLS_DATA,
  MORTGAGE_DROP_LIST,
  POOL_MORTGAGE_LIST,
  POOL_HISTORY_MORTGAGE_LIST,
  POOL_LEVEL_REPORTING,
  GET_PORTFOLIO_PERFORMANCE,
  GET_SWAP_TO_PORTFOLIO_INDEX,
  GET_SWAP_VALUES,
  GET_POOL_HISTORY_DATA,
  GET_POOL_PERIODS,
  GET_POOL_PROPERTIES,
  IS_SUCCESS,
  IS_ERROR,
  SEARCH_MORTGAGE_LIST,
  GET_BUSINESS_LIST,
  GET_USER_DATA,
  GET_COMPANY_DATA,
  GET_CSV_DATA,
  ASSOCIATE_HOMEOWNER
} from '../../actions/types';

const initialState = {
  isMortgageUpdate: false,
  selectedMortgageData: {},
  selectedMortgagePaymentsData: [],
  isLoading: false,
  searchAdminText: '',
  searchMortgage: '',
  mortgageListLoading: false,
  pools: [],
  MortgageDropList: [],
  selectedPoolMortgageList: [],
  poolName: '',
  poolId: '',
  poolHistoryMortgageList: [],
  poolDate: '',
  poolreporting: [],
  portfolioPerformanceData: [],
  swapValues: [],
  isPool: false,
  poolDescription: '',
  poolHistoryData: [],
  poolPeriods: [],
  poolProperties: [],
  isError: false,
  isSuccess: false,
  message: '',
  searchMortgageList: [],
  businessList: [],
  userDataList: [],
  companyList: [],
  poolPropertiesCsvData: [],
  associateHomeowner: [],
  valueArray: [],
  avgArray: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case OPEN_MORTGAGE_UPDATION_FORM: {
      return {
        ...state,
        selectedMortgageData: action.selectedMortgageData,
        selectedMortgagePaymentsData: action.paymentsData,
        isMortgageUpdate: true,
        poolId: action.poolId
      };
    }

    case CLOSE_MORTGAGE_UPDATION_FORM: {
      return {
        ...state,
        selectedMortgageData: {},
        selectedMortgagePaymentsData: [],
        isMortgageUpdate: false,
        searchAdminText: action.searchAdminText,
        searchMortgage: action.searchMortgage,
        mortgageListLoading: true
      };
    }

    case START_LOADING: {
      return {
        ...state,
        isLoading: true
      };
    }

    case STOP_LOADING: {
      return {
        ...state,
        isLoading: false,
        mortgageListLoading: false
      };
    }

    case FILTERED_MORTGAGE_LIST: {
      return {
        ...state,
        searchAdminText: action.searchText
      };
    }

    case UPDATED_SEARCH: {
      return {
        ...state,
        searchMortgage: action.searchText,
        searchAdminText: ''
      };
    }

    case ON_LOGOUT: {
      state = undefined;
      return {
        ...state
      };
    }

    case STORE_POOLS_DATA: {
      return {
        ...state,
        pools: action.poolsData,
        isPool: !state.isPool
      };
    }

    case MORTGAGE_DROP_LIST: {
      return {
        ...state,
        MortgageDropList: action.payload
      };
    }

    case POOL_MORTGAGE_LIST: {
      return {
        ...state,
        selectedPoolMortgageList: action.payload,
        poolName: action.poolName,
        poolId: action.poolId,
        poolDate: action.poolDate,
        poolDescription: action.description
      };
    }

    case POOL_HISTORY_MORTGAGE_LIST: {
      return {
        ...state,
        poolHistoryMortgageList: action.payload
      };
    }

    case POOL_LEVEL_REPORTING: {
      return {
        ...state,
        poolreporting: action.payload
      };
    }

    case GET_PORTFOLIO_PERFORMANCE: {
      return {
        ...state,
        portfolioPerformanceData: action.payload
      };
    }

    case GET_SWAP_TO_PORTFOLIO_INDEX: {
      return {
        ...state,
        valueArray: action.valueArray,
        avgArray: action.avgArray
      };
    }

    case GET_SWAP_VALUES: {
      return {
        ...state,
        swapValues: action.payload
      };
    }

    case GET_POOL_HISTORY_DATA: {
      return {
        ...state,
        poolHistoryData: action.payload
      };
    }

    case GET_POOL_PERIODS: {
      return {
        ...state,
        poolPeriods: action.payload
      };
    }

    case GET_POOL_PROPERTIES: {
      return {
        ...state,
        poolProperties: action.payload
      };
    }

    case IS_SUCCESS: {
      return {
        ...state,
        message: action.payload,
        isSuccess: action.isSuccess
      };
    }

    case IS_ERROR: {
      return {
        ...state,
        message: action.payload,
        isError: action.isError
      };
    }

    case SEARCH_MORTGAGE_LIST: {
      return {
        ...state,
        searchMortgageList: action.payload
      };
    }

    case GET_BUSINESS_LIST: {
      return {
        ...state,
        businessList: action.payload
      };
    }

    case GET_USER_DATA: {
      return {
        ...state,
        userDataList: action.payload
      };
    }

    case GET_COMPANY_DATA: {
      return {
        ...state,
        companyList: action.payload
      };
    }

    case GET_CSV_DATA: {
      return {
        ...state,
        poolPropertiesCsvData: action.payload
      };
    }

    case ASSOCIATE_HOMEOWNER: {
      return {
        ...state,
        associateHomeowner: action.payload
      };
    }

    default:
      return state;
  }
};

export default reducer;
