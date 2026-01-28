import React, { useState } from 'react';
import GrammarSection from './components/GrammarSection';
import DictationSection from './components/DictationSection';

function App() {
    const [activeTab, setActiveTab] = useState('grammar');

    return (
        <div className="container">
            <header style={{ textAlign: 'center', marginBottom: '2.5rem', padding: '0 1rem' }}>
                <h1 className="main-title">
                    Język Polski B2
                </h1>
                <p style={{ color: 'var(--text-dim)', fontSize: '1rem', marginTop: '0.5rem' }}>Twój osobisty trener gramatyki</p>
            </header>

            <nav className="nav">
                <div
                    className={`nav-item ${activeTab === 'grammar' ? 'active' : ''}`}
                    onClick={() => setActiveTab('grammar')}
                >
                    Gramatyka
                </div>
                <div
                    className={`nav-item ${activeTab === 'dictation' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dictation')}
                >
                    Dyktanda
                </div>
            </nav>

            <main>
                {activeTab === 'grammar' ? (
                    <GrammarSection />
                ) : (
                    <DictationSection />
                )}
            </main>

            <footer style={{ marginTop: '4rem', textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem' }}>
                &copy; 2026 Trener Polskiego B2. Wszystkie prawa zastrzeżone.
            </footer>
        </div>
    );
}

export default App;
