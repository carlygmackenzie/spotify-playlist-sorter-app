import Dropdown from "../components/Dropdown";
import { useState } from 'react';
import axios from 'axios';
import '../styles/SortPlaylist.css';
import { PiDiscoBallThin } from "react-icons/pi";

const SortPlaylist = () => {

    const [sortingAttr, setSortingAttr] = useState({ name: "Select Attribute", id: null});
    const [playlist, setPlaylist] = useState({ name: "Select Playlist", id: null});
    const [ascending, setAscending] = useState({ name: "Select Order", id: null});

    const attributes = [
        { name: "Danceability", id: 1 },
        { name: "Energy", id: 2 },
        { name: "Key", id: 3 },
        { name: "BPM", id: 4 },
    ];

    const options = [
      { name: "Ascending", id: true},
      { name: "Descending", id: false},
    ];

    const playlists = [
      { name: "Testing", id: '0dImfiNG4niPrytXqAUxhN'},
    ]

    const handleSortPlaylist = async () => {
        if(playlist.id != null && sortingAttr.id != null && ascending.id != null){
            // TODO: error handling for response
            // TODO: add try/catch block
            const response = await axios.post(
                '/sort-playlist',
                {
                    playlistId: playlist.id,
                    sortingAttr: sortingAttr.id,
                    ascending: ascending.id
                }
            )
        }
        else{
            // TODO: display prompt for use to enter missing info
        }
    }

    return (

        <div>
          <div class="disco-line"/>

          <h1>Welcome to the Spotify Playlist Sorter &lt;3</h1>
          
          <PiDiscoBallThin className="disco-ball"/>

          <p>First, choose a playlist to sort</p>

          {/*Playlist dropdown*/}
          <div className="dropdown-container">
            <Dropdown
              options={playlists}
              choice={playlist}
              setChoice={setPlaylist}>
              <Dropdown.Button />
            </Dropdown>
          </div>

          <p>Next, choose how you would like to sort it</p>

          {/*Sorting attribute dropdown*/}
          <div className="dropdown-container">
            <Dropdown
              options={attributes}
              choice={sortingAttr}
              setChoice={setSortingAttr}>
              <Dropdown.Button />
            </Dropdown>

            {/*Ascending/descending dropdown*/}
            <div className="dropdown-container-2">
              <Dropdown
                options={options}
                choice={ascending}
                setChoice={setAscending}>
                <Dropdown.Button />
              </Dropdown>
            </div>
          </div>

          {/*Sort playlist button*/}
          <div className="sort-playlist-container">
            <button 
              className="sort-playlist-button"
              onClick={handleSortPlaylist}>
                <span className="sort-playlist-text">
                  Sort <br/> Playlist
                </span>
            </button>
          </div>
        </div>
    );
};

export default SortPlaylist;