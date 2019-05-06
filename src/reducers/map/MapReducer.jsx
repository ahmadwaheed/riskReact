import {
  FETCH_MARKERS,
  CLEAR_MARKERS,
  GET_SMS_CODE,
  GET_SMS_CODE_DATA,
  GET_ADVANCE_SEARCH_DATA,
  BACK_TO_MAP,
  ADD_LAYER,
  GET_ADDRESS_DATA,
  BEFORE_GET_ADDRESS_DATA,
  HANDLE_ISVIEWMAP_INFO,
  HANDLE_ISPAYMENT,
  HANDLE_VIEW_PAYMENT,
  HANDLE_ISDETAIL,
  HANDLE_VIEW_DETAIL,
  HANDLE_ADVANCED_FILTER,
  HANDLE_CLOSE_PAYMENT,
  SWITCHING_TAB_MAP
} from '../../actions/types';

const initialState = {
  infoArray: [],
  payment: [],
  smsacode: [],
  markers: [],
  addressList: [],
  isdata: false,
  isDetails: false,
  ispayment: false,
  detailedData: {},
  paymentData: {},
  isAdvanceSearch: false,
  ispaymentAdvanse: false,
  isdisplaykml: false,
  isViewLoader: false,
  isViewMapInfo: true,
  totalValues: 0,
  totalPages: 0,
  limit: 10,
  offset: 0,
  prev: false,
  next: false,
  lat: 36.950901,
  lang: -122.04681,
  zoom: 3
};

const MapReducer = (state = initialState, action) => {
  switch (action.type) {
    case FETCH_MARKERS: {
      return {
        ...state,
        markers: action.markers
      };
    }

    case CLEAR_MARKERS: {
      return {
        ...state,
        markers: []
      };
    }

    case GET_SMS_CODE: {
      return {
        ...state,
        smsacode: action.data
      };
    }

    case GET_SMS_CODE_DATA: {
      return {
        ...state,
        infoArray: action.data,
        isDetails: false,
        isdata: false,
        ispayment: false
      };
    }

    case GET_ADVANCE_SEARCH_DATA: {
      let list = { ...action.data };

      return {
        ...state,
        isAdvanceSearch: true,
        addressList: list.items,
        totalValues: action.data.total_count,
        totalPages: Math.ceil(action.data.total_count / state.limit),
        prev: action.data.hasPrev,
        next: action.data.hasNext
      };
    }

    case BACK_TO_MAP: {
      return {
        ...state,
        isAdvanceSearch: false
      };
    }

    case ADD_LAYER: {
      return {
        ...state,
        isdisplaykml: !state.isdisplaykml
      };
    }

    case GET_ADDRESS_DATA: {
      return {
        ...state,
        infoArray: action.data,
        isDetails: false,
        isViewLoader: false,
        isViewMapInfo: true,
        isdata: false,
        ispayment: false
      };
    }

    case BEFORE_GET_ADDRESS_DATA: {
      return {
        ...state,
        isViewLoader: true,
        isViewMapInfo: false
      };
    }

    case HANDLE_ISVIEWMAP_INFO: {
      return {
        ...state,
        isDetails: false,
        isdata: false,
        isViewMapInfo: true
      };
    }

    case HANDLE_ISPAYMENT: {
      return {
        ...state,
        ispayment: false,
        isDetails: true
      };
    }

    case HANDLE_VIEW_PAYMENT: {
      if (action.ispaymentAdvanse) {
        return {
          ...state,
          payment: action.findresponse,
          paymentData: action.paymentlist,
          ispaymentAdvanse: action.ispaymentAdvanse
        };
      } else {
        return {
          ...state,
          payment: action.findresponse,
          paymentData: action.paymentlist,
          ispayment: true,
          isDetails: false,
          isdata: true,
          isViewMapInfo: false,
          ispaymentAdvanse: action.ispaymentAdvanse
        };
      }
    }

    case HANDLE_ISDETAIL: {
      return {
        ...state,
        isDetails: action.isDetails,
        isdata: true,
        isViewMapInfo: false,
        detailedData: action.data,
        lat: Number(action.data.lat),
        lang: Number(action.data.long),
        zoom: 5
      };
    }

    case HANDLE_VIEW_DETAIL: {
      return {
        ...state,
        isDetails: true,
        isdata: true,
        ispayment: false,
        detailedData: action.data,
        lat: Number(action.data.lat),
        lang: Number(action.data.long),
        zoom: 5
      };
    }

    case HANDLE_ADVANCED_FILTER: {
      return {
        ...state,
        isAdvanceSearch: action.isAdvanceSearch,
        addressList: action.findresponse,
        prev: false,
        next: false
      };
    }

    case HANDLE_CLOSE_PAYMENT: {
      return {
        ...state,
        ispaymentAdvanse: !state.ispaymentAdvanse
      };
    }

    case SWITCHING_TAB_MAP: {
      return {
        ...state,
        isAdvanceSearch: false
      };
    }

    default:
      return state;
  }
};

export default MapReducer;
