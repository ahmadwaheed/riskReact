import { LOGIN, LOGOUT } from '../../actions/types';

const initialState = {
  isLogin: sessionStorage.getItem('isLogin') === 'true' ? true : false,
  userData: sessionStorage.getItem('user') ? JSON.parse(sessionStorage.getItem('user')) : {}
};

const LoginReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN: {
      return {
        ...state,
        isLogin: action.val,
        userData: action.payload
      };
    }

    case LOGOUT: {
      return {
        ...state,
        isLogin: action.val,
        userData: {}
      };
    }

    default:
      return state;
  }
};

export default LoginReducer;
