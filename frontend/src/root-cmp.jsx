import { Route, Routes } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { CanvasBackground } from './cmps/CanvasBg'
import { Homepage } from './pages/Homepage'
import './assets/styles.scss'
import { ChatApp } from './pages/ChatApp'
import { ChatWindow } from './cmps/chat-app/ChatWindow'


function App() {
  return (
    <ChakraProvider>
      <div className="app">
        <CanvasBackground />
        <Routes>
          <Route path='/' element={<Homepage />}></Route>
          <Route path='/chat' element={<ChatApp />}>
            <Route path=':chatId' element={<ChatWindow />} />
          </Route>
        </Routes>
      </div>
    </ChakraProvider>
  );
}

export default App;
