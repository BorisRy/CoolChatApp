import { Route, Routes } from 'react-router-dom'
import { ChakraProvider } from '@chakra-ui/react'
import { CanvasBackground } from './cmps/CanvasBg'
import { Homepage } from './pages/Homepage'
import './assets/styles.scss'
import { ChatApp } from './pages/ChatApp'
import { ChatWindow } from './cmps/chat-app/ChatWindow'
import { useMediaQuery } from '@chakra-ui/react'
import { SideBar } from './cmps/chat-app/SideBar'


function App() {

  const [isLargerThan800] = useMediaQuery('(min-width: 800px)')
  return (
    <ChakraProvider>
      <div className="application">
        <CanvasBackground />
        {isLargerThan800 ? (
          <Routes>
            <Route path='/' element={<Homepage />}></Route>
            <Route path='/chat' element={<ChatApp />}>
              <Route path=':chatId' element={<ChatWindow />} />
            </Route>
          </Routes>
        )
          :
          (
            <Routes>
              {/* <Route path='/' element={<ChatWindow />}></Route> */}
              <Route path='/' element={<Homepage />}></Route>
              <Route path='/chat' element={<SideBar />} />
              <Route path='/chat/:chatId' element={<ChatWindow />} />
            </Routes>
          )}
      </div>
    </ChakraProvider>
  );
}

export default App;
