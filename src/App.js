import React from 'react';
import './App.css';  // 기본 스타일 파일
import './styles/fonts.css';  // 폰트 관련 CSS 파일을 불러옴

function App() {
  return (
    <div className="App">
      <div className="textPreset1">
        This is Text Preset 1 with bold font.
      </div>

      <div className="textPreset2">
        This is Text Preset 2 with regular font.
      </div>

      <div className="textPreset3">
        This is Text Preset 3 with bold font.
      </div>

      <div className="textPreset4">
        This is Text Preset 4 with regular font.
      </div>

      <div className="textPreset4Bold">
        This is Text Preset 4 Bold with bold font.
      </div>

      <div className="textPreset5">
        This is Text Preset 5 with regular font.
      </div>

      <div className="textPreset5Bold">
        This is Text Preset 5 Bold with bold font.
      </div>
    </div>
  );
}

export default App;
