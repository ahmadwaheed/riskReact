import {
  ADD,
  LOCAL_STORE,
  HPI_DATA_CBSA,
  HPI_DATA_STATE,
  HPI_DATA_ZIP,
  HPI_DATA_MASTER,
  HPI_DATA_ZIP3
} from '../../actions/types';

const initialState = {
  counter: 0,
  authData: {},
  hpiCbsaData: [],
  hpiStateData: [],
  hpiMasterData: [],
  hpiZip3Data: [],
  hpiZipData: [], //this holds the information of the the authentication
  swapBalanceData: [] //data recived from the stateHpi the recentUpdates
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD: {
      return {
        ...state,
        counter: state.counter + action.val
      };
    }

    case LOCAL_STORE: {
      return {
        ...state,
        authData: action.val
      };
    }

    case HPI_DATA_CBSA: {
      return {
        ...state,
        hpiCbsaData: action.payload
      };
    }

    case HPI_DATA_STATE: {
      return {
        ...state,
        hpiStateData: action.payload
      };
    }

    case HPI_DATA_ZIP: {
      return {
        ...state,
        hpiZipData: action.payload
      };
    }
    case HPI_DATA_ZIP3: {
      return {
        ...state,
        hpiZip3Data: action.payload
      };
    }

    case HPI_DATA_MASTER: {
      return {
        ...state,
        hpiMasterData: action.payload
      };
    }

    default:
      return state;
  }
};

export default reducer;
