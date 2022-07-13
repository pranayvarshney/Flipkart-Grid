import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'
import Landing from './components/Landing';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import CreateProduct from './components/CreateProduct';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider>
    <BrowserRouter>
      <React.StrictMode>
        <Routes>
          <Route path="/" element={<Landing />}>             
          </Route>
          <Route path='/create' element={<CreateProduct/>}/>
        </Routes>
       
      </React.StrictMode>
    </BrowserRouter>
  </ChakraProvider>
);

