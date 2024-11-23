import './App.css';
import SortingAttrDropdown from './components/SortingAttrDropdown';
import { useState, useEffect } from 'react';
import axios from 'axios';

// todo: separate this into different files
function App() {

  const [message, setMessage] = useState("")

  // just for testing
  useEffect(() => {

    const fetchData = async () => {
      const response = await axios.get('/data');
      setMessage(response.data.message);
    }

    fetchData();
  }, []);

  const [sortingAttr, setSortingAttr] = useState({ name: "Select a Sorting Attribute", id: null });
  const [playlistId, setPlaylistId] = useState(''); 

  const attributes = [
    { name: "Danceability", id: 1 },
    { name: "Energy", id: 2 },
    { name: "Key", id: 3 },
    { name: "BPM", id: 4 },
  ];

  // TODO: error and exception handling
  const handleSortPlaylist = async () => {
    console.log(playlistId);
    if(playlistId && playlistId.length > 0){
      const response = await axios.post(
        '/sort-playlist',
        {
          playlistId: playlistId,
          sortingAttr: sortingAttr
        }
      )
    }
  }

  return (

    <div className="App">
      <p>{message}</p>
      <div>
        <SortingAttrDropdown
          attributes={attributes}
          sortingAttr={sortingAttr}
          setSortingAttr={setSortingAttr}>
          <SortingAttrDropdown.Button />
          <input
            type="text"
            placeholder="Enter Playlist ID"
            value={playlistId}
            onChange={(input) => setPlaylistId(input.target.value)}
          />
          <button
            onClick={handleSortPlaylist}
          >
            Sort Playlist
          </button>
        </SortingAttrDropdown>
      </div>
    </div>

    
  );
}

export default App;
