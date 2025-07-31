import { useEffect, useState } from 'react';

function App() {
  const [apiMessage, setApiMessage] = useState('');

  useEffect(() => {
    fetch('http://localhost:8000/api/test')
      .then(response => response.json())
      .then(data => setApiMessage(data.message))
      .catch(error => setApiMessage('Error: ' + error));
  }, []);

  return (
    <div>
      <h1>Laravel API says:</h1>
      <p>{apiMessage}</p>
      {/* ...existing code... */}
    </div>
  );
}

export default App;