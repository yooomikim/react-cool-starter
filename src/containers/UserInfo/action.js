/* @flow */

import type {
  Dispatch,
  GetState,
  ThunkAction,
  Reducer,
} from '../../types';

export const AN_USER_REQUESTING = 'AN_USER_REQUESTING';
export const AN_USER_SUCCESS = 'AN_USER_SUCCESS';
export const AN_USER_FAILURE = 'AN_USER_FAILURE';

const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Export this function for testing
export const fetchData = (userId: string, axios: any): ThunkAction =>
  (dispatch: Dispatch) => {
    dispatch({ type: AN_USER_REQUESTING, userId });

    return axios.get(`${API_URL}/${userId}`)
      .then((res) => {
        dispatch({ type: AN_USER_SUCCESS, userId, data: res.data });
      })
      .catch((err) => {
        dispatch({ type: AN_USER_FAILURE, userId, err });
      });
  };

// Using for preventing dobule fetching data
/* istanbul ignore next */
const shouldFetchData = (state: Reducer, userId: string): boolean => {
  // In development, we will allow action dispatching
  // or your reducer hot reloading won't updated on the view
  if (__DEV__) return true;

  const userInfo = state.userInfo[userId];

  // Preventing dobule fetching data in production
  if (userInfo && userInfo.readyState === AN_USER_SUCCESS) return false;

  return true;
};

/* istanbul ignore next */
export const fetchDataIfNeeded = (userId: string): ThunkAction =>
  (dispatch: Dispatch, getState: GetState, axios: any) => {
    /* istanbul ignore next */
    if (shouldFetchData(getState(), userId)) {
      /* istanbul ignore next */
      return dispatch(fetchData(userId, axios));
    }

    /* istanbul ignore next */
    return null;
  };
