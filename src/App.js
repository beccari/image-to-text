import { useEffect, useRef, useState } from 'react';
import ReactCrop from 'react-image-crop'
import Tesseract from 'tesseract.js';
import './App.css';
import 'react-image-crop/dist/ReactCrop.css'


function App() {
  const [image, setImage] = useState('');
  const [text, setText] = useState('');
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const [crop, setCrop] = useState(null);
  const [completedCrop, setCompletedCrop] = useState(null);

  const handleChange = (event) => {
    setImage(URL.createObjectURL(event.target.files[0]));
  }

  const handleCompleteCrop = (c, p) => {
    setCompletedCrop(c);

    if (c.width > 1 || c.height > 1)
      handleClick();
  }
  
  const handleClick = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
 
    canvas.width = crop.width;
    canvas.height = crop.height;

    const cropX = crop.x;
    const cropY = crop.y;

    ctx.translate(-cropX, -cropY);

    ctx.drawImage(imageRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/jpeg");

    Tesseract.recognize(
      dataUrl, "por+spa+eng",
      {
        //logger: m => console.log(m)
      }
    )
    .catch(err => {
      console.error(err);
    })
    .then(result => {
      console.log("result", result);
      let text = result.data.text;
      setText(text);
      navigator.clipboard.writeText(text);
    })
  }

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="App">
      <main className="App-main">
        <h3>Actual image uploaded</h3>
        <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={handleCompleteCrop}>
          <img src={image} className="App-logo" alt="logo" ref={imageRef}/>
        </ReactCrop>
        <div style={{paddingTop:10}}>
          <canvas 
            ref={canvasRef}
            style={{
              border: '1px solid black',
              width: completedCrop?.width ,
              height: completedCrop?.height,
            }}
            />
        </div>
        <h3>Text will be copied to the clipboard!</h3>
        <div className="pin-box">
          <p> {text} </p>
        </div>
        <input type="file" onChange={handleChange} />
      </main>
    </div>
  );
}

export default App;
