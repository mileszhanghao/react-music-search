// TrackList.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const TRACK_QUERY_TEMPLATE = 'https://itunes.apple.com/lookup?entity=song&id={collectionId}';

export default function TrackList({ setAlertMessage }) {
  const [trackData, setTrackData] = useState([]);
  const [isQuerying, setIsQuerying] = useState(false);
  const [previewAudio, setPreviewAudio] = useState(null);
  const urlParams = useParams();

  useEffect(() => {
    setIsQuerying(true);
    const trackUrl = TRACK_QUERY_TEMPLATE.replace("{collectionId}", urlParams.collectionId);

    fetch(trackUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        if (data.resultCount <= 1) {
          throw new Error('No tracks found for album.');
        }
        setTrackData(data.results.slice(1)); // Assuming first result is album info
      })
      .catch(error => {
        setAlertMessage(error.message);
      })
      .finally(() => {
        setIsQuerying(false);
      });
  }, [urlParams.collectionId, setAlertMessage]);

  const togglePlayingPreview = (previewUrl) => {
    if (!previewAudio) {
      const newPreview = new Audio(previewUrl);
      newPreview.addEventListener('ended', () => setPreviewAudio(null));
      setPreviewAudio(newPreview);
      newPreview.play();
    } else {
      previewAudio.pause();
      setPreviewAudio(null);
    }
  };

  trackData.sort((a, b) => a.trackNumber - b.trackNumber);

  const trackElemArray = trackData.map((track) => (
    <div key={track.trackId} onClick={() => togglePlayingPreview(track.previewUrl)} role="button" className="track-record">
      <p className="track-name">{track.trackName}</p>
      <p className="track-artist">({track.artistName})</p>
      <p className="text-center">Track {track.trackNumber}</p>
    </div>
  ));

  return (
    <div>
      {isQuerying && <FontAwesomeIcon icon={faSpinner} spin size="4x" aria-label="Loading..." />}
      <div className="d-flex flex-wrap">
        {trackElemArray}
      </div>
    </div>
  );
}
