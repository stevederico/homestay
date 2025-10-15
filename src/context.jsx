import React, { createContext, useContext, useReducer } from 'react';
import constants from './constants.json';

const context = createContext();

// Helper to generate storage key based on app name
function getStorageKey() {
  const appName = constants.appName || 'bxrental';
  return `${appName.toLowerCase().replace(/\s+/g, '-')}_user`;
}

// Safely parse user from localStorage, fallback to null on error
const getInitialUser = () => {
  try {
    const storageKey = getStorageKey();
    const storedUser = localStorage.getItem(storageKey);
    if (!storedUser || storedUser === "undefined") return null;
    return JSON.parse(storedUser);
  } catch (e) {
    return null;
  }
};

const initialState = { user: getInitialUser()};

function reducer(state, action) {
  try {
    const storageKey = getStorageKey();
    const appName = constants.appName || 'bxrental';
    const csrfKey = `${appName.toLowerCase().replace(/\s+/g, '-')}_csrf`;

    switch (action.type) {
      case 'SET_USER':
        localStorage.setItem(storageKey, JSON.stringify(action.payload));
        return { ...state, user: action.payload };
      case 'CLEAR_USER':
        localStorage.removeItem(storageKey);
        localStorage.removeItem(csrfKey);
        return { ...state, user: null };
      default:
        return state;
    }
  } catch (e) {
    return state;
  }
}

export function ContextProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <context.Provider value={{ state, dispatch }}>
      {children}
    </context.Provider>
  );
}

export function getState() {
  return useContext(context);
}