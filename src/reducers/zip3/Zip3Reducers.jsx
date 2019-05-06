import { RECENT_DATA_ZIP, UPLOAD_ERROR_ZIP3, UPLOAD_FILE, LOCAL_STORE, ADD } from '../../actions/types';

const initialState = {
  isRecentView: false,
  file: null,
  noFileZip3: false,
  recentDataState: []
};

const Zip3Reduers = (state = initialState, action) => {
  switch (action.type) {
    case RECENT_DATA_ZIP: {
      return {
        ...state,
        recentDataState: action.payload,
        isRecentView: action.val
      };
    }

    case UPLOAD_ERROR_ZIP3: {
      return {
        ...state,
        noFileZip3: action.val
      };
    }

    case UPLOAD_FILE: {
      return {
        ...state,
        file: action.file,
        noFileZip3: action.val
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

export default Zip3Reduers;
