import { useState } from "react";
import Quagga from "quagga";

const Home = () => {
  const [book, setBook] = useState<any>(null);

  const onDetected = async (result: any) => {
    const code = result.codeResult.code;
    const response = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${code}&key=${process.env.BOOKS_API_KEY}}`
    );
    const data = await response.json();
    if (data.items && data.items.length > 0) {
      setBook(data.items[0].volumeInfo);
      Quagga.stop();
    }
  };

  const startScanner = () => {
    Quagga.init(
      {
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: document.querySelector("#scanner")!,
        },
        decoder: {
          readers: ["ean_reader"],
        },
      },
      (err: any) => {
        if (err) {
          console.error(err);
          return;
        }
        Quagga.start();
        Quagga.onDetected(onDetected);
      }
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <div className="w-full max-w-2xl p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-3xl font-semibold mb-4">Tsundoku App</h1>
        <button
          onClick={startScanner}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg mb-6 hover:bg-blue-700"
        >
          Start Scanner
        </button>
        <div
          id="scanner"
          className="w-full h-64 mb-6 border border-gray-300"
        ></div>
        {book && (
          <div>
            <h2 className="text-2xl font-semibold">{book.title}</h2>
            <h3 className="text-xl">{book.authors?.join(", ")}</h3>
            <p className="mt-2">{book.description}</p>
            <img
              className="mt-4 rounded-lg shadow-md"
              src={book.imageLinks?.thumbnail}
              alt={book.title}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
