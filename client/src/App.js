import './App.css';
import React from 'react';
import Server from './services/Server/Server';
 
export const ServerContext = React.createContext();

function App() {

  const server = new Server();

  return (
      <ServerContext.Provider value={server}>

      </ServerContext.Provider>
  );
}

export default App;
