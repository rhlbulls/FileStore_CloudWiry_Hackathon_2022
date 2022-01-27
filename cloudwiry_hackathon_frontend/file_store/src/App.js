import logo from './logo.svg';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import Lock from './components/Lock';
import { LoginContext, UserData } from './dataStore/Context';
import { useState } from 'react';
function App() {
  const [auth, setAuth]=useState(false);
  const [userData, setUserData]=useState([]);
  return (
    <LoginContext.Provider value={{auth, setAuth}} className="App">
      <UserData.Provider value={{userData, setUserData}} >
      <BrowserRouter>
      <Routes>
        <Route exact path='/' element={<Lock />} />
          <Route exact path='/home' element={<Home />} />
      </Routes>
    </BrowserRouter>
    </UserData.Provider>
    </LoginContext.Provider>
  );
}

export default App;
