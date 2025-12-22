import { useState } from 'react'
import { useHover, Button, Popover } from '../src'
import './App.css'

function App() {
  const { isHovered, hoverProps } = useHover({
    onHoverStart: () => console.log('Hover started'),
    onHoverEnd: () => console.log('Hover ended'),
  })

  const [popoverOpen, setPopoverOpen] = useState(false)
  const [tooltipOpen, setTooltipOpen] = useState(false)
  const [arrowPopoverOpen, setArrowPopoverOpen] = useState(false)

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
                  as="div"
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

          <div className="demo-card">
            <h3>Popover</h3>
            <div className="demo-content">
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '10px' }}>
                <Popover
                  open={popoverOpen}
                  onOpenChange={setPopoverOpen}
                  placement="bottom"
                  content={
                    <div
                      style={{
                        padding: '12px 16px',
                        backgroundColor: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        border: '1px solid #e0e0e0',
                        minWidth: '150px',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '14px' }}>Popover content</p>
                      <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#666' }}>
                        Click outside to close
                      </p>
                    </div>
                  }
                >
                  <Button
                    onClick={() => setPopoverOpen(!popoverOpen)}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Toggle Popover
                  </Button>
                </Popover>

                <Popover
                  open={tooltipOpen}
                  onOpenChange={setTooltipOpen}
                  placement="top"
                  offset={12}
                  content={
                    <div
                      style={{
                        padding: '8px 12px',
                        backgroundColor: '#333',
                        color: 'white',
                        borderRadius: '6px',
                        fontSize: '12px',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      This is a tooltip
                    </div>
                  }
                >
                  <Button
                    onMouseEnter={() => setTooltipOpen(true)}
                    onMouseLeave={() => setTooltipOpen(false)}
                    style={{
                      backgroundColor: '#6c757d',
                      color: 'white',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Hover for Tooltip
                  </Button>
                </Popover>

                <Popover
                  open={arrowPopoverOpen}
                  onOpenChange={setArrowPopoverOpen}
                  placement="right"
                  showArrow
                  offset={12}
                  content={
                    <div
                      style={{
                        padding: '12px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        borderRadius: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        minWidth: '120px',
                      }}
                    >
                      <p style={{ margin: 0, fontSize: '14px' }}>Popover with arrow</p>
                    </div>
                  }
                >
                  <Button
                    onClick={() => setArrowPopoverOpen(!arrowPopoverOpen)}
                    style={{
                      backgroundColor: '#28a745',
                      color: 'white',
                      padding: '10px 20px',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Arrow Popover
                  </Button>
                </Popover>
              </div>
              <div
                style={{
                  marginTop: '20px',
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '4px',
                }}
              >
                <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>
                  <strong>Tips:</strong> Popovers automatically adjust position to stay within
                  viewport. Try scrolling or resizing the window.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
