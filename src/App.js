import LoginComponent from './Login';
import { Route, Routes } from 'react-router-dom';
import Dash from './dashboard';


function App() {
  return (
    <div>
     {/* <LoginComponent /> */}
     <Routes>
      <Route path='/' element={<LoginComponent />}/>
      <Route path='/dashboard' element={<Dash />}/>
     </Routes>
    </div>
  );
}

export default App;
