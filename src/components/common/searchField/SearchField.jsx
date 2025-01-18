import React from 'react';
import './SearchField.css';

const SearchField = ({ 
  type = 'default', 
  placeholder = 'Placeholder', 
  onChange, 
  value // 부모로부터 제어받을 수 있는 value
}) => {
  const renderInputField = () => {
    switch (type) {
      case 'icon-right':
        return (
          <div className="input-wrapper">
            <input 
              type="text" 
              placeholder={placeholder} 
              className="input-field with-icon-right" 
              onChange={onChange} // 이벤트 핸들러 추가
              value={value} // value 추가
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
              onChange={onChange} // 이벤트 핸들러 추가
              value={value} // value 추가
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
              onChange={onChange} // 이벤트 핸들러 추가
              value={value} // value 추가
            />
          </div>
        );
    }
  };

  return renderInputField();
};

export default SearchField;
