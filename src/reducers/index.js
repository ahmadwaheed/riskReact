import { combineReducers } from 'redux';
import hpiReducer from './hpi-upload/hpi-reducer';
import reducerBorrower from './borrower/borrower';
import reducerMortageOriginator from './mortgage-originator/mortgage-originator-reducer';
import reducerMortageService from './mortgage-service/mortgage-service-reducer';
import adminReducer from './admin/adminReducer';
import LoginReducer from './login/LoginReducer';
import MetroReducers from './metro/MetroReducers';
import StateReduers from './state/StateReducers';
import ZipReduers from './zip/ZipReducers';
import HomeReducer from './home/HomeReducer';
import MapReducer from './map/MapReducer';
import MasterReducers from './master/MasterReducer';
import Zip3Reduers from './zip3/Zip3Reducers';

const rootReducer = combineReducers({
  hpi: hpiReducer,
  borrow: reducerBorrower,
  mortService: reducerMortageService,
  originator: reducerMortageOriginator,
  admin: adminReducer,
  login: LoginReducer,
  metro: MetroReducers,
  stateReducer: StateReduers,
  zipReducer: ZipReduers,
  zip3Reducer: Zip3Reduers,
  home: HomeReducer,
  map: MapReducer,
  masterReducer: MasterReducers
});

export default rootReducer;
