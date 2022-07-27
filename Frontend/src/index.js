import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import CreateProduct from './components/CreateProduct';
import ClientLanding from './components/ClientLanding';
import { extendTheme } from '@chakra-ui/react'
import Home from './components/Home';
import Leaderboard from './components/Leaderboard';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({ config })
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider theme={theme}>
    <BrowserRouter>     
        <Routes>
          <Route path="/" element={<App />}/>     
          <Route path="/claim" element={<ClientLanding />}/> 
          <Route path='/create' element={<CreateProduct/>}/>
          <Route path='/home' element={<Home/>}/>
          <Route path='/leaderboard' element={<Leaderboard/>}/>
        </Routes>
       

    </BrowserRouter>
  </ChakraProvider>
);

