import { useState } from 'react';
import Tesseract from 'tesseract.js';
import './App.css';

function App() {
  const [imagePath, setImagePath] = useState('');
  const [text, setText] = useState('');

  const handleChange = (event) => {
    setImagePath(URL.createObjectURL(event.target.files[0]));
  }

  const handleClick = () => {
    Tesseract.recognize(
      imagePath, "por+spa+eng",
      {
        //logger: m => console.log(m)
      }
    )
    .catch(err => {
      console.error(err);
    })
    .then(result => {
      console.log("result", result);
      let confidence = result.confidence;
      console.log("confidence:", confidence);

      let text = result.data.text;
      setText(text);
    })
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="App">
      <main className="App-main">
        <h3>Actual image uploaded</h3>
        <img src={imagePath} className="App-logo" alt="logo"/>

        <h3>Extracted text</h3>
        <div className="text-box">
          <p> {text} </p>
        </div>
        <input type="file" onChange={handleChange} />
        <button onClick={handleClick} style={{height:50}}> convert to text</button>
        <button onClick={handleCopyClick} style={{height:50}}> copy text to clipboard</button>
      </main>
    </div>
  );
}

export default App;
