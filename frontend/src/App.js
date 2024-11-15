import './App.css';
import SortingAttrDropdown from './components/SortingAttrDropdown';
import { useState } from 'react';

function App() {

  //const dropdownContainerRef = useRef(null);
  //const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sortingAttr, setSortingAttr] = useState({ name: "Select a Sorting Attribute", id: null });
  //useClickOutside(dropdownContainerRef, () => setIsDropdownOpen(false));

  const attributes = [
    { name: "Danceability", id: 1 },
    { name: "Energy", id: 2 },
    { name: "Key", id: 3 },
    { name: "BPM", id: 4 },
  ];

  return (
    <div className="App">
      <div>
        <SortingAttrDropdown
          attributes={attributes}
          sortingAttr={sortingAttr}
          setSortingAttr={setSortingAttr}>
            <SortingAttrDropdown.Button />
        </SortingAttrDropdown>
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
