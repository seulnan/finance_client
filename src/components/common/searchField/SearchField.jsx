import React from 'react';
import './SearchField.css';


const SearchField = ({ type = 'default', placeholder = 'Placeholder' }) => {
  const renderInputField = () => {
    switch (type) {
      case 'icon-right':
        return (
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder={placeholder} 
              className="input-field with-icon-right" 
            />
            <span className="icon-right">🔍</span>
          </div>
        );
      case 'icon-left':
        return (
          <div className="input-wrapper">
            <span className="icon-left">$</span>
            <input 
              type="text" 
              placeholder={placeholder} 
              className="input-field with-icon-left" 
            />
          </div>
        );
      default:
        return (
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder={placeholder} 
              className="input-field" 
            />
          </div>
        );
    }
  };

  return renderInputField();
};

export default SearchField;
