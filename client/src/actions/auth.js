import axios from 'axios';
import setAuthToken from '../utils/setAuthToken';
import { setAlert } from './alert';
import { REGISTER_SUCCESS, REGISTER_FAIL, USER_LOADED, AUTH_ERROR, LOGIN_SUCCESS, LOGIN_FAIL, LOGOUT, CLEAR_PROFILE} from './types';



//Load User
export const loadUser = () => async dispatch => {
    if(localStorage.token){
        setAuthToken(localStorage.token)
    }

    try {
        const res = await axios.get('/api/auth')

        dispatch({
            type: USER_LOADED,
            payload:res.data
        });
    }catch (err) {
        dispatch({
            type: AUTH_ERROR
        })
    }
}


//Register User
export const register = ({ firstname, lastname, email, password }) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ firstname, lastname, email, password }); 

    try {
        const res = await axios.post('/api/users', body, config);

        dispatch({
            type: REGISTER_SUCCESS,
            payload: res.data
        });
    }catch (err) {
        const errors = err.response.data.errors;

        if(errors){
            //loop through errors to display
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch ({
            type: REGISTER_FAIL
        });

        dispatch(loadUser())
    }
}

//Login User
export const login = (  email, password ) => async dispatch => {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        }
    }

    const body = JSON.stringify({ email, password }); 

    try {
        const res = await axios.post('/api/auth', body, config);

        dispatch({
            type: LOGIN_SUCCESS,
            payload: res.data
        });

        dispatch(loadUser())
    }catch (err) {
        const errors = err.response.data.errors;

        if(errors){
            //loop through errors to display
            errors.forEach(error => dispatch(setAlert(error.msg, 'danger')))
        }
        dispatch ({
            type: LOGIN_FAIL
        });
    }
}

// Logout / Clear Profile
export const logout = () => dispatch =>{
     dispatch({type: CLEAR_PROFILE}) 
     dispatch({type: LOGOUT });
    
};