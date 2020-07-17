import React, { useState } from 'react';
const labelStyle = {
  color: "blue"
}
const spacing = '1em'
const styles = {
  button: {
    marginTop: spacing,
    padding: spacing
  },
  input: {
    padding: spacing,
    marginTop: "0.6em"
  }
}
function App() {
  const [url, setUrl] = useState()
  const handleSubmit = async () => {
    try {
      if (!url) return
      await fetch('/.netlify/functions/screenGrab', {
        method: 'POST',
        body: JSON.stringify({ data: url }),
        headers: { 'Content-type': 'application/json' }
      })
    }
    catch (error) {
      console.error(error)
    }
  }
  return (
    <div className="App">
      <header>
        <h1>Make Screen Grab</h1>
      </header>
      <main>
        <section>
          <article><h2>Take a screen grab usng a <em>url</em></h2>
            <fieldset style={{ padding: "0.8em", width: "30vw" }}>
              <legend>Make a screen grab</legend>
              <form onSubmit={handleSubmit} type="submit" style={{ display: "grid" }}>
                <label style={labelStyle} htmlFor="link">Link to page</label>
                <input style={styles.input} type="text" onChange={(event) => setUrl(event.target.value)} />
                <button style={styles.button} type="submit">submit</button>
              </form>
            </fieldset>
          </article>
        </section>
      </main>
    </div>
  );
}

export default App;
