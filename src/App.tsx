import { useState, useEffect } from 'react'
import { evaluateState } from './services/bridge'
import { TshOutput, StateSeal } from './types/riverbraid'

function App() {
  const [anchor, setAnchor] = useState('0xDEADC0DE')
  const [stateData, setStateData] = useState('{"status": "initial"}')
  const [history, setHistory] = useState<StateSeal[]>([])
  const [currentError, setCurrentError] = useState<string | null>(null)

  const handleExecute = async () => {
    const prevHash = history.length > 0 ? history[history.length - 1].hash : '0x0000000000000000000000000000000000000000000000000000000000000000';
    const seq = history.length + 1;
    
    const result = await evaluateState(anchor, stateData, seq, prevHash);

    if (result.ok && result.seal) {
      setHistory([...history, result.seal]);
      setCurrentError(null);
      setStateData(`{"status": "update", "step": ${seq + 1}}`); // Auto-increment for UX
    } else {
      setCurrentError(result.failures[0]?.reason || 'Unknown Error');
    }
  }

  return (
    <div style={{ padding: '40px', fontFamily: '"Fira Code", monospace', backgroundColor: '#0f0f0f', color: '#a0a0a0', minHeight: '100vh' }}>
      <header style={{ borderBottom: '1px solid #333', paddingBottom: '20px', marginBottom: '40px' }}>
        <h1 style={{ color: '#fff', letterSpacing: '2px', margin: 0 }}>RIVERBRAID <span style={{ color: '#d4af37' }}>GOLD</span></h1>
        <p style={{ fontSize: '0.8rem', opacity: 0.6 }}>RELATIONAL INTEGRITY MONITOR // V1.1.0</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: '400px 1fr', gap: '40px' }}>
        {/* CONTROL PANEL */}
        <section>
          <h3 style={{ color: '#eee', fontSize: '0.9rem' }}>INTEGRITY INPUTS</h3>
          <div style={{ background: '#161616', padding: '20px', border: '1px solid #222' }}>
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.7rem' }}>ANCHOR</label>
            <input 
              style={{ width: '100%', padding: '10px', background: '#000', border: '1px solid #333', color: '#4CAF50', marginBottom: '20px' }}
              value={anchor} onChange={e => setAnchor(e.target.value)}
            />
            
            <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.7rem' }}>STATE DATA</label>
            <textarea 
              style={{ width: '100%', height: '120px', padding: '10px', background: '#000', border: '1px solid #333', color: '#eee' }}
              value={stateData} onChange={e => setStateData(e.target.value)}
            />

            <button 
              onClick={handleExecute}
              style={{ width: '100%', marginTop: '20px', padding: '15px', backgroundColor: '#d4af37', color: '#000', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              COMMIT TO BRAID
            </button>
            {currentError && <p style={{ color: '#F44336', fontSize: '0.8rem', marginTop: '10px' }}>⚠️ {currentError}</p>}
          </div>
        </section>

        {/* LEDGER PANEL */}
        <section>
          <h3 style={{ color: '#eee', fontSize: '0.9rem' }}>IMMUTABLE BRAID HISTORY</h3>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {history.length === 0 && <p style={{ opacity: 0.3 }}>No states committed. Braid is stationary.</p>}
            {[...history].reverse().map((seal, i) => (
              <div key={seal.hash} style={{ borderLeft: '2px solid #d4af37', padding: '15px', background: '#161616', marginBottom: '10px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#fff' }}>
                  <span>SEQ: {seal.sequence}</span>
                  <span style={{ color: '#d4af37' }}>{seal.label}</span>
                </div>
                <p style={{ fontSize: '0.7rem', wordBreak: 'break-all', opacity: 0.6, margin: '10px 0' }}>HASH: {seal.hash}</p>
                <p style={{ fontSize: '0.7rem', color: '#4CAF50' }}>ANCHOR: {seal.anchor}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}

export default App
