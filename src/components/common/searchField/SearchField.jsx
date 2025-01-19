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
          <div className="InputWrapper">
            <input 
              type="text" 
              placeholder={placeholder} 
              className="InputFieldWithIconRight" 
              onChange={onChange} // 이벤트 핸들러 추가
              value={value} // value 추가
            />
            <span className="iconRight">🔍</span>
          </div>
        );
      case 'icon-left':
        return (
          <div className="InputWrapper">
            <span className="IconLeft">$</span>
            <input 
              type="text" 
              placeholder={placeholder} 
              className="InputFieldWithIconLeft" 
              onChange={onChange} // 이벤트 핸들러 추가
              value={value} // value 추가
            />
          </div>
        );
      default:
        return (
          <div className="InputWrapper">
            <input 
              type="text" 
              placeholder={placeholder} 
              className="InputField" 
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
