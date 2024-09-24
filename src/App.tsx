import './index.css';
import { BrowserRouter as Router } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import AppRouter from './routes/AppRouter';

const App = () => {
  return (
    <Router>
      <div>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
        {/* Use AppRouter to handle all routes */}
        <AppRouter />
      </div>
    </Router>
  );
};

export default App;
