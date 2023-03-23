import { useState } from 'react';
// @ts-ignore
import Quagga from 'quagga';

const Home = () => {
  const [book, setBook] = useState<any>(null);

  const onDetected = async (result: any) => {
    const code = result.codeResult.code;
    const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${code}?key=${process.env.BOOKS_API_KEY}`);
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      setBook(data.items[0].volumeInfo);
      Quagga.stop();
    }
  };

  const startScanner = () => {
    Quagga.init({
      inputStream: {
        name: 'Live',
        type: 'LiveStream',
        target: document.querySelector('#scanner')!,
      },
      decoder: {
        readers: ['ean_reader'],
      },
    }, (err: any) => {
      if (err) {
        console.error(err);
        return;
      }
      Quagga.start();
      Quagga.onDetected(onDetected);
    });
  };

  return (
    <div className="container">
      <h1 className="title">Welcome to Tsundoku App</h1>
      <button className="start-scanner-btn" onClick={startScanner}>Start Scanner</button>
      <div id="scanner" className="scanner"></div>
      {book && (
        <div className="book-info">
          <h2>{book.title}</h2>
          <h3>{book.authors?.join(', ')}</h3>
          <p>{book.description}</p>
          <img src={book.imageLinks?.thumbnail} alt={book.title} />
        </div>
      )}
    </div>
  );
};

export default Home;
