import { RECENT_METRO_DATA, UPLOAD_ERROR_METRO, UPLOAD_FILE, LOCAL_STORE, ADD } from '../../actions/types';

const initialState = {
  isRecentView: false,
  file: null,
  noFileMetro: false,
  recentDataMetro: []
};

const MetroReducers = (state = initialState, action) => {
  switch (action.type) {
    case RECENT_METRO_DATA: {
      return {
        ...state,
        recentDataMetro: action.payload,
        isRecentView: action.val
      };
    }

    case UPLOAD_ERROR_METRO: {
      return {
        ...state,
        noFileMetro: action.val
      };
    }

    case UPLOAD_FILE: {
      return {
        ...state,
        file: action.file,
        noFileMetro: action.val
      };
    }

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

    default: {
      return state;
    }
  }
};

export default MetroReducers;
