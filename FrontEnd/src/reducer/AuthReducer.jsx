// src/reducer/AuthReducer.jsx
export const AuthReducer = (state, action) => {
    switch (action.type) {
      case 'LOGIN_SUCCESS':
        return {
          ...state,
          isLogin: true,
          error: '',
          userId:action.payload
        };
      case 'LOGIN_FAILURE':
        return {
          ...state,
          isLogin: false,
          error: action.payload,
          userId: ''
        };
      case 'LOGOUT':
        return {
          ...state,
          isLogin: false,
          error: '',
          userId: ''
        };
      default:
        return state;
    }
  };
  