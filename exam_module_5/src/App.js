import logo from './logo.svg';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import BookList from './components/BookList';
import AddBook from './components/AddBook';
import './App.css';

function App() {
  return (
      <Router>
        <div>
          <Routes>
            <Route path="/" element={<BookList />} />
              <Route path="/add" element={<AddBook />} />
          </Routes>
        </div>
      </Router>
  );
}

export default App;
