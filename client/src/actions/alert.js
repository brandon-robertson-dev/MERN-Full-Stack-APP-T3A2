import { SET_ALERT, REMOVE_ALERT } from './types';
import { v4 as uuidv4 } from 'uuid'; //change version

export const setAlert = (msg, alertType, timeout = 5000) => dispatch => {
    const id = uuidv4();
    dispatch({
        type: SET_ALERT,
        payload: { msg , alertType, id }
    });

    //will remove Alert from page based on payload id when passwords do not match
    setTimeout(() =>dispatch({ type: REMOVE_ALERT, payload: id}), timeout)
};