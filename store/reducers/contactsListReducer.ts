import { GET_CONTACTS_LIST, GET_CONTACTS_LIST_ERROR } from '../constants';

const initialState = {
  data: '',
  error: null,
};

export default (state = initialState, action: any) => {
  switch (action.type) {
    case GET_CONTACTS_LIST:
      return {
        data: action.payload,
        error: null,
      };

    case GET_CONTACTS_LIST_ERROR:
      return {
        ...state,
        error: action.payload,
      };

    default:
      return state;
  }
};
