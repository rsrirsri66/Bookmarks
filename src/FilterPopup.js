// FilterPopup.js

import React from 'react';
import Select from 'react-select';
import "../src/css/filter.css";

const FilterPopup = ({ selectedFilter, applyFilter, toggleFilterPopupVisibility }) => {
  return (
    <div className="filter-popup">
      <label htmlFor="filterOptions" className="filter-label">Filter Options:</label>
      <Select
        id="filterOptions"
        className="filter-select"
        options={[
          { value: 'ascending', label: 'Sort by Ascending' },
          { value: 'descending', label: 'Sort by Descending' },
          // Add more filter options as needed
        ]}
        value={selectedFilter}
        onChange={(selected) => applyFilter(selected?.value)}
      />
      <button className="filter-close" onClick={toggleFilterPopupVisibility}>Close</button>
    </div>
  );
};

export default FilterPopup;
