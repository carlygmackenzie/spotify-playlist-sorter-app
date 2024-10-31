"""
File: sort_playlist_services.py
Author: Carly MacKenzie
Description: Contains all worker functions related to sorting a playlist
"""

import requests
from flask import session

base_url = 'https://api.spotify.com/v1'

# get all track names and ids from a playlist
def get_playlist_track_ids(playlist_id):

    url = base_url + f'/playlists/{playlist_id}/tracks'
    headers = {
        "Authorization": f"Bearer {session.get('access_token')}"
    }
    all_tracks = []
    offset = 0
    limit = 100

    while True:
        response = requests.get(url, headers=headers, params={"limit": limit, "offset": offset})
        
        if response.status_code == 200:
            playlist_data = response.json()
            
            # add tracks to list
            tracks = playlist_data.get("items", [])
            all_tracks.extend(tracks)

            # exit loop if last page
            if len(tracks) < limit:
                break

            offset += limit

        else:
            print(f"error getting playlist tracks: {response}")
            return None
        
    track_ids = []
    local_files = []

    for track in all_tracks:
        if track['track']['id'] != None:
            track_ids.append(track['track']['id'])
        else:
            local_files.append(track['track']['name'])

    num_tracks = len(track_ids) + len(local_files)

    print(f'Number of tracks in playlist: {num_tracks}')
    #print("local files in playlist:")
    #print(local_files)

    return track_ids  
        
    
def get_several_track_details(track_ids):

    headers = {
        "Authorization": f"Bearer {session.get('access_token')}"
    }
    all_details = []
    offset = 0
    limit = 100

    while True:
        track_ids_chunk = track_ids[offset:(offset + limit)]
        track_ids_comma = ','.join(track_ids_chunk)
        url = base_url + f'/audio-features?ids={track_ids_comma}'

        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                audio_data = response.json().get('audio_features', [])
                all_details.extend(audio_data)

                if len(audio_data) < limit:
                    break

                offset += limit
                
            else:
                print(f"error getting track details: {response}")
                return None
            
        except Exception as e:
            print(f"exception!!! :( {e}")
            return None 

    return all_details      


def get_specific_detail_tuple(track_ids, track_details, sort_by):
    # danceability
    if sort_by == 1:
        to_sort = [track['danceability'] for track in track_details]
    # energy
    elif sort_by == 2:
        to_sort = [track['energy'] for track in track_details]
    # key
    elif sort_by == 3:
        to_sort = [track['key'] for track in track_details]
    # bpm
    # TODO: fix this. if over 150 bpm maybe use halftime bpm
    elif sort_by == 4:
        to_sort = [track['tempo'] for track in track_details]

    return list(zip(track_ids, to_sort))
        
# sort the playlist
def sort_playlist_tuple(playlist_tuple, ascending):
    if ascending:
        sorted_playlist = sorted(playlist_tuple, key = lambda x: x[1])
    else:
        sorted_playlist = sorted(playlist_tuple, key = lambda x: x[1], reverse=True)

    return list(map(lambda x: x[0], sorted_playlist))
    
def reorder_playlist(playlist_id, new_ids):

    # clear all tracks of the playlist before adding new ordered ones
    cleared_tracks = clear_tracks(playlist_id)
    if cleared_tracks != True:
        return None

    url = base_url + f'/playlists/{playlist_id}/tracks'
    headers = {
        "Authorization": f"Bearer {session.get('access_token')}",
        "Content-Type": "application/json"
    }
    offset = 0
    limit = 100

    while True:
        new_ids_chunk = new_ids[offset:(limit+offset)]

        uris =[f'spotify:track:{id}' for id in new_ids_chunk]

        response = requests.post(url=url, headers=headers, json={"uris": uris})
        # TODO: error handling
        if len(new_ids_chunk) < limit:
            break

        offset += limit
    
    return True

def clear_tracks(playlist_id):
    url = base_url + f"/playlists/{playlist_id}/tracks"
    headers = {
        "Authorization": f"Bearer {session.get('access_token')}"
    }
    data = {
        "uris": []
    }
    response = requests.put(url=url, headers=headers, json=data)
    if response.status_code == 200:
        return True
    else:
        return False

# get the names of tracks given a list of their ids
def get_track_names(track_ids):

    headers = {
        "Authorization": f"Bearer {session.get('access_token')}"
    }
    all_names = []
    offset = 0
    limit = 50

    while True:
        track_ids_chunk = track_ids[offset:(limit+offset)]
        track_ids_comma = ','.join(track_ids_chunk)
        url = base_url + f'/tracks?ids={track_ids_comma}'

        response = requests.get(url, headers=headers)
        if response.status_code == 200:
            track_data = response.json().get('tracks', [])
            names = [track['name'] for track in track_data]
            all_names.extend(names)

            if len(track_data) < limit:
                break

            offset += limit
    
        else:
            print(f"error getting track names: {response}")
            return None
            
    return all_names
              
def sort_playlist(playlist_id, sort_by, ascending):
    
    track_ids = get_playlist_track_ids(playlist_id)
    details = get_several_track_details(track_ids)
    playlist_tuple = get_specific_detail_tuple(track_ids, details, sort_by)
    sorted_playlist = sort_playlist_tuple(playlist_tuple, ascending)
    reorder_playlist(playlist_id, sorted_playlist)
    
    return sorted_playlist




