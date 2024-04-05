import axios from 'axios';
import { GET_CONTACTS_LIST, SET_ERROR } from '../constants';
import { Base64 } from 'js-base64';
import { ContactsListProps_Data } from '../../src/types/dataTypes';

interface GetContactsListProps {
  onSuccess?: () => void;
  onError?: () => void;
}

const setError = err => {
  return {
    type: SET_ERROR,
    payload: err,
  };
};

export default (props: GetContactsListProps) => {
  return async dispatch => {
    return axios
      .get('https://contact.herokuapp.com/contact', {
        headers: { Accept: 'application/json' },
      })
      .then(res => {
        if (res.status === 200) {
          let data = res.data.data.map((item: ContactsListProps_Data) => {
            if (item.photo) {
              const photo = item.photo?.includes('base64') ? '' : item.photo;
              return { ...item, photo };
            }
          });
          data = JSON.parse(JSON.stringify(data).replace(/'/g, '"'));
          const resData = {
            message: res.data.message,
            data,
          };
          dispatch({
            type: GET_CONTACTS_LIST,
            payload: resData,
          });
          if (props.onSuccess) {
            props.onSuccess();
          }
        }
      })
      .catch(err => {
        dispatch(setError(err));
        if (props.onError) {
          props.onError();
        }
      });
  };
};
