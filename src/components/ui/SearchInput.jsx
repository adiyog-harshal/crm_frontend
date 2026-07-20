import React from 'react';
import { Search } from 'lucide-react';
import './SearchInput.css';

const SearchInput = ({
  placeholder = 'Search...',
  value,
  onChange,
  className = '',
  ...props
}) => {
  return (
    <div className={`ui-search-bar ${className}`}>
      <Search size={16} className="ui-search-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
    </div>
  );
};

export default SearchInput;
