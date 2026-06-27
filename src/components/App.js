// App.js
import React, { useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

import AlbumSearchForm from './AlbumSearchForm';
import AlbumList from './AlbumList';
import TrackList from './TrackList';

const ALBUM_QUERY_TEMPLATE = "https://itunes.apple.com/search?term={searchTerm}&entity=album";

function App() {
  const [albumData, setAlbumData] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [alertMessage, setAlertMessage] = useState(null);

  const fetchAlbumList = (searchTerm) => {
    setIsSearching(true);
    const searchUrl = ALBUM_QUERY_TEMPLATE.replace("{searchTerm}", searchTerm);

    fetch(searchUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.resultCount === 0) {
          throw new Error('No results found.');
        }
        setAlbumData(data.results);
      })
      .catch(error => {
        setAlertMessage(error.message);
      })
      .finally(() => {
        setIsSearching(false);
      });
  };

  return (
    <div className="container">
      <header className="mb-3">
        <h1>Play Some Music!</h1>
      </header>

      {alertMessage && (
        <Alert variant="danger" dismissible onClose={() => setAlertMessage(null)}>
          {alertMessage}
        </Alert>
      )}

      <main>
        <Routes>
          <Route path="/" element={
            <>
              <AlbumSearchForm searchCallback={fetchAlbumList} isWaiting={isSearching} />
              <AlbumList albums={albumData} />
            </>
          } />
          <Route path="/album/:collectionId" element={
            <>
              <Link to="/" className="btn btn-primary mb-3">Back</Link>
              <TrackList setAlertMessage={setAlertMessage} />
            </>
          } />
        </Routes>
      </main>

      <footer>
        <small>Music Search via iTunes.</small>
      </footer>
    </div>
  );
}

export default App;
