import React, { useReducer, createContext } from "react";

export const UserContext = createContext();

const initialState = {
  user: {
    "userid":-1,
    "username":"",
    "password":"",
    "firstName":"testName",
    "lastName":"L",
    "preferredName":"testName",
    "emailId":"",
    "subscriptionType":"free",
    "emailVerified":true,
    "authorities":null,
    "enabled":true,
    "accountNonLocked":true,
    "accountNonExpired":true,
    "credentialsNonExpired":true,
    "totalFollowing": 0,
    "totalFollowers": 0,
    "bio": null,
    "createdAt": null,
  },
  userImage:null,
  sessions:[],
  passcode:"",
  loading: false,
  error: null,
  selectedFile: null
};

const reducer = (state, action) => {
  switch (action.type) {
    case "LOAD_USER":
      return {
        user: action.payload
      };
    case "CREATE_SESSION":
        return {
          sessions: action.payload
        };
    case "STORE_PASSCODE":
      return {
        passcode: action.payload
      };
    case "STORE_IMAGE":
      return {
        userImage: action.payload
      };
    case "STORE_AUDIO":
      return {
        selectedFile: action.payload
      };
    case "DEL_CONTACT":
      return {
        contacts: state.contacts.filter(
          contact => contact.id !== action.payload
        )
      };
    case "START":
      return {
        loading: true
      };
    case "COMPLETE":
      return {
        loading: false
      };
    default:
      throw new Error();
  }
};

const UserContextProvider = props => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <UserContext.Provider value={[state, dispatch]}>
        {props.children}
        </UserContext.Provider>
    );
};

export default UserContextProvider
