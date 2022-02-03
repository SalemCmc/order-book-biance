
import './App.css';
import { Link } from "react-router-dom";
import OrderBookHome from './components/orderBookHome'
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <div className="App">
      <header className="App-header"><p>Binance's Order Book</p></header>
      <div className='App-content'>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<OrderBookHome />} />
            <Route path="/orderbook" element={<OrderBookHome />} />
            <Route path="/orderbook/:symbol" element={<OrderBookHome />} />
            <Route path="*" element={<main style={{ padding: "1rem" }}><p>There's nothing here!</p><Link to="/orderbook">Go to order book </Link></main>} />
          </Routes>
        </BrowserRouter>

      </div>
    </div>
  );
}

export default App;



