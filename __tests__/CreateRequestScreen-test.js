// import 'jsdom-global/register';
import 'react-native';
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import {AppStore} from '../AppStore';
import Enzyme, { render } from 'enzyme';
import {shallow} from 'enzyme';
import { mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { fetchPOSTMethod } from '../src/utilities/fetchService';
// import { loginActionCreator } from '../src/scenes/login/LoginAction';
// import * as actions from '../src/scenes/login/LoginAction'
// import { LOGIN_ACTION, LOGIN_LOADING } from '../src/scenes/login/constants';
// import LoginReducer from '../src/scenes/login/LoginReducer';
import properties from '../src/resource/properties';
import CreateRequestScreen from '../src/scenes/serviceDeskIT/createRequest';
jest.mock('react-redux');
Enzyme.configure({ adapter: new Adapter() });
function AbortControl(){
  this.abort = jest.fn()
}
global.AbortController = AbortControl
jest.mock('react-native-splash-screen', () => {
    return {
      hide: jest.fn(),
      show: jest.fn()
    };
  })
jest.mock('react-native-gesture-handler', () => {})
jest.mock('react-native-device-info', () => {
    return {
        getModel: jest.fn(),
        isTablet: jest.fn(),
        getVersion: jest.fn(),
      }
});
jest.mock("react-native-modal-dropdown",()=>{});
jest.mock("rn-fetch-blob",async()=>{});
jest.mock("react-native-fs", () => {});
jest.mock("@react-native-community/netinfo", () => {});
jest.mock("@react-native-community/async-storage", () => {});
jest.mock("react-native-document-picker",()=>{});
const initialState = {};
describe("IT ServiceDesk" ,()=>{
  beforeEach(() => {
    fetch.resetMocks();
  });
  const props={
    // login: () => {},
  }
  component = renderer.create(<CreateRequestScreen.reactComponent {...props}/>);
  instance = component.getInstance();
  it('IT Service Desk rendered correctly', () => {
    expect(component).toMatchSnapshot();
  })
  
//   it("User Id rendered",()=>{
//     expect(findById(component.toJSON(),"username")).toBeDefined();
//   })

//   it("Password rendered",()=>{
//     expect(findById(component.toJSON(),"password")).toBeDefined();
//   })

//   it("User Id entered correct",()=>{
//     let userIdField = findById(component.toJSON(),"username");
//     userIdField.props.onChangeText("some_UserId");
//     expect(instance.state.employeeId).toEqual('some_UserId')
//   })

//   it("Password entered correct",()=>{
//     let passwordField = findById(component.toJSON(),"password");
//     passwordField.props.onChangeText("some_password");
//     expect(instance.state.password).toEqual('some_password')
//   })
 
//   it('Login Action is of correct type', () => {
//     const expectedAction = {
//             type: LOGIN_ACTION
//            }
//     expect(actions.loginAction()).toEqual(expectedAction)
// })

 
// it("Login Reducer is of correct type ", ()=>{
//   const initialState = {
//     loginData:[],
//     login_loading:false,
//     modal_loading:false,
//     version:""
// }
//   expect(LoginReducer(undefined,initialState)).toEqual(initialState)
// })
// it("Should handle login Loading ",()=>{
//   const initialState = {
//     loginData:[],
//     login_loading:false,
//     modal_loading:false,
//     version:""
// }
//   expect(LoginReducer(initialState,{type:LOGIN_LOADING})).toEqual({ login_loading: true,loginData:[],modal_loading:false,version:"",login_loading: undefined })
// })
// it('User successfully logged on',async() => {
//   const mockFn = jest.fn(() => Promise.resolve({}));
//   instance.checkDetails = mockFn;
//   let loginButton = findById(component.toJSON(),"loginButton");
//   loginButton.props.onClick();
//   // await instance.checkDetails()
//   expect(mockFn).toHaveBeenCalledTimes(1);
// });
// it('Login Api test', async() => {
//   fetch.mockResponseOnce(JSON.stringify([{ id: 1 }]));
//       let formData = {};
//       formData["EmpCode"]="1234";
//       formData["Password"]="*****";
//       formData["SMCode"]="1234";
//       formData["Version"]="99.99.99";
//       let response = await fetchPOSTMethod("https://iniitian.niit-tech.com/iNIITian/CommonHandler/AuthenticateUserapp",formData)
//   expect(response[0].id).toEqual(1);
// });
  
// })

// let findById = function(tree, testID) {
//   if(tree.props && tree.props.testID === testID) {
//       return tree
//   }
//   if(tree.children && tree.children.length > 0)
//   {   
//       let childs = tree.children
//       for(let i = 0; i < childs.length; i++)
//       {
//           let item = findById(childs[i], testID)
//           if(typeof(item) !== 'undefined') {
//               return item
//           }
//       }
//   }
})