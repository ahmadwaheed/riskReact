import { RECENT_DATA_MASTER, UPLOAD_ERROR_MASTER, UPLOAD_FILE, LOCAL_STORE, ADD } from '../../actions/types';

const initialState = {
  isRecentView: false,
  file: null,
  noFileMaster: false,
  recentDataState: []
};

const MasterReducer = (state = initialState, action) => {
  switch (action.type) {
    case RECENT_DATA_MASTER: {
      return {
        ...state,
        recentDataState: action.payload,
        isRecentView: action.val
      };
    }

    case UPLOAD_ERROR_MASTER: {
      return {
        ...state,
        noFileMaster: action.val
      };
    }

    case UPLOAD_FILE: {
      return {
        ...state,
        file: action.file,
        noFileMaster: action.val
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

export default MasterReducer;
