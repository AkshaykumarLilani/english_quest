import './App.css';
import { ConfigProvider } from 'antd';
import AllRoutes from './Router';
import { Provider } from "react-redux";
import store, { persistor } from './Redux/store';
import { PersistGate } from 'redux-persist/integration/react';

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ConfigProvider
          theme={{
            token: {
              borderRadius: 2
            }
          }}
        >
          <AllRoutes />
        </ConfigProvider>
      </PersistGate>
    </Provider>
  );
}

export default App;