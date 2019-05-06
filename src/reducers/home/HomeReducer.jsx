import { FETCH_RECORDS_ZIP, INPUT_ADDRESS, FETCH_RECORDS_ADDRESS, INPUT_ZIPCODE } from '../../actions/types';

const initialState = {
  zipCode: '',
  fetchedRecordsZIP: [],
  statusZip: '',
  fetchedRecordsAddress: [],
  statusAddress: '',
  address: ''
};

const HomeReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_RECORDS_ZIP: {
      return {
        ...state,
        fetchedRecordsZIP: action.fechedRecordsZip,
        statusZip: action.statusZip
      };
    }

    case INPUT_ZIPCODE: {
      return {
        ...state,
        zipCode: action.zipCode
      };
    }

    case INPUT_ADDRESS: {
      return {
        ...state,
        address: action.address
      };
    }

    case FETCH_RECORDS_ADDRESS: {
      return {
        ...state,
        fetchedRecordsAddress: action.fetchedRecordsAddress,
        statusAddress: action.statusAddress
      };
    }

    default:
      return state;
  }
};

export default HomeReducer;
