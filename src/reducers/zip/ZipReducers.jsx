import { RECENT_DATA_ZIP, UPLOAD_ERROR_ZIP, UPLOAD_FILE, LOCAL_STORE, ADD } from '../../actions/types';

const initialState = {
  isRecentView: false,
  file: null,
  noFileZip: false,
  recentDataState: []
};

const ZipReduers = (state = initialState, action) => {
  switch (action.type) {
    case RECENT_DATA_ZIP: {
      return {
        ...state,
        recentDataState: action.payload,
        isRecentView: action.val
      };
    }

    case UPLOAD_ERROR_ZIP: {
      return {
        ...state,
        noFileZip: action.val
      };
    }

    case UPLOAD_FILE: {
      return {
        ...state,
        file: action.file,
        noFileZip: action.val
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

export default ZipReduers;
