import homeReducer from "./reducers/homeReducer";
import authReducer from "./reducers/authReducer";
import cardReducer from "./reducers/cardReducer";
import orderReducer from "./reducers/orderReducer";
import dashboardReducer from "./reducers/dashboardReducer";
import chatReducer from "./reducers/chatReducer";
import linksReducer from "./reducers/linksReducer";
import contactReducer from "./reducers/contactReducer";
const rootReducers = {
  home: homeReducer,
  auth: authReducer,
  card: cardReducer,
  order: orderReducer,
  dashboard: dashboardReducer,
  chat: chatReducer,
  content: linksReducer,
  contact: contactReducer,
};
export default rootReducers;
