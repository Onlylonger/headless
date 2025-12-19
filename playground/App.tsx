import { useToggle, useCounter, HeadlessToggle, HeadlessCounter } from '../src'
import './App.css'

function App() {
  const [isOpen, toggle, setIsOpen] = useToggle(false)
  const [count, { increment, decrement, reset }] = useCounter({
    initialValue: 0,
    min: 0,
    max: 10,
    step: 1,
  })

  return (
    <div className="app">
      <header className="app-header">
        <h1>@shilong/headless</h1>
        <p>A headless React library with components and hooks</p>
      </header>

      <main className="app-main">
        <section className="demo-section">
          <h2>Hooks</h2>

          <div className="demo-card">
            <h3>useToggle</h3>
            <div className="demo-content">
              <p>
                Current state: <strong>{isOpen ? 'Open' : 'Closed'}</strong>
              </p>
              <div className="demo-buttons">
                <button onClick={toggle}>Toggle</button>
                <button onClick={() => setIsOpen(true)}>Open</button>
                <button onClick={() => setIsOpen(false)}>Close</button>
              </div>
            </div>
          </div>

          <div className="demo-card">
            <h3>useCounter</h3>
            <div className="demo-content">
              <p>
                Current count: <strong>{count}</strong>
              </p>
              <div className="demo-buttons">
                <button onClick={decrement}>-</button>
                <button onClick={increment}>+</button>
                <button onClick={reset}>Reset</button>
              </div>
            </div>
          </div>
        </section>

        <section className="demo-section">
          <h2>Components</h2>

          <div className="demo-card">
            <h3>HeadlessToggle</h3>
            <div className="demo-content">
              <HeadlessToggle>
                {({ isOn, toggle, setOn, setOff }) => (
                  <div>
                    <p>
                      State: <strong>{isOn ? 'On' : 'Off'}</strong>
                    </p>
                    <div className="demo-buttons">
                      <button onClick={toggle}>Toggle</button>
                      <button onClick={setOn}>Turn On</button>
                      <button onClick={setOff}>Turn Off</button>
                    </div>
                  </div>
                )}
              </HeadlessToggle>
            </div>
          </div>

          <div className="demo-card">
            <h3>HeadlessCounter</h3>
            <div className="demo-content">
              <HeadlessCounter initialValue={5} min={0} max={20} step={2}>
                {({ count, increment, decrement, reset, setValue }) => (
                  <div>
                    <p>
                      Count: <strong>{count}</strong>
                    </p>
                    <div className="demo-buttons">
                      <button onClick={decrement}>-2</button>
                      <button onClick={increment}>+2</button>
                      <button onClick={reset}>Reset</button>
                      <button onClick={() => setValue(10)}>Set to 10</button>
                    </div>
                  </div>
                )}
              </HeadlessCounter>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
