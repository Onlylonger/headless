import { useHover, Button, DialogTrigger, DialogClose } from '../src'
import './App.css'
import { CreateDialog, useCreateDialogStore } from './dialog'

function App() {
  // const dialogRef = useRef<ReturnType<typeof createDialog> | null>(null)
  const { isHovered, hoverProps } = useHover({
    onHoverStart: () => console.log('Hover started'),
    onHoverEnd: () => console.log('Hover ended'),
  })

  const toggle = useCreateDialogStore((state) => state.toggle)

  return (
    <div className="app">
      <header className="app-header">
        <h1>@shilong/headless</h1>
        <p>A headless React library with components and hooks</p>
      </header>
      <Button onClick={() => toggle(true)}>ceshiyixia2222</Button>
      <CreateDialog
        className="Dialog"
        overlayProps={{
          className: 'Dialog-overlay',
        }}
      >
        <DialogClose>XXX</DialogClose>
        content
      </CreateDialog>

      <main className="app-main">
        <section className="demo-section">
          <h2>Hooks</h2>

          <div className="demo-card">
            <h3>useHover</h3>
            <div className="demo-content">
              <p>
                Hover state: <strong>{isHovered ? 'Hovered' : 'Not Hovered'}</strong>
              </p>
              <div
                {...hoverProps}
                style={{
                  padding: '20px',
                  border: '2px solid #007bff',
                  borderRadius: '8px',
                  backgroundColor: isHovered ? '#e7f3ff' : '#f8f9fa',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                }}
              >
                Hover over me! (data-hover: {String(hoverProps['data-hover'])})
              </div>
            </div>
          </div>
        </section>

        <section className="demo-section">
          <h2>Components</h2>

          <div className="demo-card">
            <h3>Button</h3>
            <div className="demo-content">
              <Button
                onClick={() => console.log('Button clicked')}
                style={{
                  backgroundColor: '#007bff',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginRight: '10px',
                }}
              >
                Click me
              </Button>
              <Button
                disabled
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  opacity: 0.5,
                  cursor: 'not-allowed',
                  marginRight: '10px',
                }}
              >
                Disabled
              </Button>
              <Button
                loading
                onClick={() => console.log('This should not fire')}
                style={{
                  backgroundColor: '#28a745',
                  color: 'white',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '4px',
                  opacity: 0.7,
                  cursor: 'not-allowed',
                }}
              >
                Loading...
              </Button>
              <div style={{ marginTop: '10px' }}>
                <Button
                  component="div"
                  onClick={() => console.log('Div button clicked')}
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#ffc107',
                    color: 'black',
                    padding: '10px 20px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Custom Element (div)
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
