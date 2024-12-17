import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { Toaster } from 'react-hot-toast'; 

import AppRouter from './routes/AppRouter';
const App = () => {
  return (
    <>
      <Toaster
        position="top-center" // Adjust position
        toastOptions={{
          duration: 5000, // Auto close after 5 seconds
        }}
      />
      <Router>
        <AppRouter />
      </Router>
    </>
  );
};

export default App;

