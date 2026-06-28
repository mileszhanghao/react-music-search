import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faMusic } from '@fortawesome/free-solid-svg-icons';

export default function AlbumSearchForm({ searchCallback, isWaiting }) {
  const [queryText, setQueryText] = useState('');

  const handleChange = (event) => {
    setQueryText(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = queryText.trim();
    if (!trimmedQuery) return;

    const encodedQuery = encodeURIComponent(trimmedQuery);
    searchCallback(encodedQuery);
  };

  return (
    <div>
      <form className="form-inline" onSubmit={handleSubmit}>
        <div className="form-group mb-2">
          <label htmlFor="searchQuery" className="mb-2">Who do you want to hear?</label>
          <input id="searchQuery" type="text" className="form-control" placeholder="Search for an album"
            value={queryText} onChange={handleChange} />
        </div>

        {isWaiting ? (
          <FontAwesomeIcon icon={faSpinner} spin size="lg" aria-label="Loading..." aria-hidden="false" />
        ) : (
          <button type="submit" className="btn btn-primary" disabled={!queryText.trim()}>
            <FontAwesomeIcon icon={faMusic} /> Search!
          </button>
        )}
      </form>
    </div>
  );
}
