import logo from './logo.svg';
import './App.css';
import Dropdown from './components/Dropdown';

function App() {
  return (
    <div className="App">
      <div>
        <Dropdown/>
      </div>
      <div>
      <input
        type="text"
        placeholder="Enter Playlist ID">
      </input>
      <button>
        Sort Playlist
      </button>
      </div>
    </div>
  );
}

export default App;
