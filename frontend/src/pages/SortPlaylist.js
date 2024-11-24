import SortingAttrDropdown from "../components/SortingAttrDropdown";
import { useState } from 'react';
import axios from 'axios';

const SortPlaylist = () => {

    const [sortingAttr, setSortingAttr] = useState({ name: "Select a Sorting Attribute", id: null});
    const [playlistId, setPlaylistId] = useState('');

    const attributes = [
        { name: "Danceability", id: 1 },
        { name: "Energy", id: 2 },
        { name: "Key", id: 3 },
        { name: "BPM", id: 4 },
    ];

    const handleSortPlaylist = async () => {
        console.log(playlistId);
        if(playlistId && playlistId.length > 0 && sortingAttr != null){
            // TODO: error handling for response
            // TODO: add try/catch block
            const response = await axios.post(
                '/sort-playlist',
                {
                    playlistId: playlistId,
                    sortingAttr: sortingAttr
                }
            )
        }
        else{
            // TODO: display prompt for use to enter missing info
        }
    }

    return (

        <div>
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
                onClick={handleSortPlaylist}>
                    Sort Playlist
              </button>

            </SortingAttrDropdown>
          </div>
        </div>
    );
};

export default SortPlaylist;