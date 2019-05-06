import { RECENT_DATA_STATE, UPLOAD_ERROR, UPLOAD_FILE, LOCAL_STORE, ADD } from '../../actions/types';

const initialState = {
  isRecentView: false,
  file: null,
  noFileState: false,
  recentDataState: []
};

const StateReduers = (state = initialState, action) => {
  switch (action.type) {
    case RECENT_DATA_STATE: {
      return {
        ...state,
        recentDataState: action.payload,
        isRecentView: action.val
      };
    }

    case UPLOAD_ERROR: {
      return {
        ...state,
        noFileState: action.val
      };
    }

    case UPLOAD_FILE: {
      return {
        ...state,
        file: action.file,
        noFileState: action.val
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

export default StateReduers;
