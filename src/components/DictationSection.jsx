import React, { useState, useRef, useEffect } from 'react';
import { dictationData } from '../data/dictationData';

const DictationSection = () => {
    const [currentDictation, setCurrentDictation] = useState(dictationData[0]);
    const [showText, setShowText] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    const timerRef = useRef(null);
    const utteranceRef = useRef(null);

    const startTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setCurrentTime(prev => prev + 1);
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const handleSpeak = () => {
        window.speechSynthesis.cancel();
        stopTimer();
        setCurrentTime(0); // Reset time on new play

        const utterance = new SpeechSynthesisUtterance(currentDictation.text);
        utterance.lang = 'pl-PL';
        utterance.rate = 0.9;
        utteranceRef.current = utterance;

        // Attempt to find a Polish voice
        const voices = window.speechSynthesis.getVoices();
        const plVoice = voices.find(v => v.lang.startsWith('pl'));
        if (plVoice) utterance.voice = plVoice;

        utterance.onboundary = (event) => {
            if (event.name === 'word') {
                const charIndex = event.charIndex;
                const totalChars = currentDictation.text.length;
                setProgress((charIndex / totalChars) * 100);
            }
        };

        utterance.onstart = () => {
            setIsPlaying(true);
            setIsPaused(false);
            startTimer();
        };

        utterance.onend = () => {
            setIsPlaying(false);
            setIsPaused(false);
            setProgress(100);
            stopTimer();
        };

        window.speechSynthesis.speak(utterance);
    };

    const handlePause = () => {
        window.speechSynthesis.pause();
        setIsPaused(true);
        stopTimer();
    };

    const handleResume = () => {
        window.speechSynthesis.resume();
        setIsPaused(false);
        startTimer();
    };

    const handleStop = () => {
        window.speechSynthesis.cancel();
        setIsPlaying(false);
        setIsPaused(false);
        setProgress(0);
        setCurrentTime(0);
        stopTimer();
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
            stopTimer();
        };
    }, []);

    return (
        <div className="glass-card">
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.2rem', color: 'var(--primary)', textTransform: 'uppercase', marginBottom: '1rem' }}>
                    Wybierz dyktando
                </h2>
                <select
                    onChange={(e) => {
                        handleStop();
                        setCurrentDictation(dictationData.find(d => d.id === parseInt(e.target.value)));
                        setShowText(false);
                    }}
                    disabled={isPlaying && !isPaused}
                    style={{
                        background: '#ffffff',
                        color: 'var(--text)',
                        padding: '0.6rem 1rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        width: '100%',
                        maxWidth: '400px',
                        fontSize: '1rem',
                        fontFamily: 'inherit',
                        cursor: (isPlaying && !isPaused) ? 'not-allowed' : 'pointer'
                    }}
                >
                    {dictationData.map(d => (
                        <option key={d.id} value={d.id}>{d.title}</option>
                    ))}
                </select>
            </div>

            <div className="dictation-player" style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--glass-border)', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '1.5rem' }}>{currentDictation.title}</h3>

                {/* Progress Bar */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.5rem' }}>
                        <div style={{ height: '100%', background: 'var(--primary)', width: `${progress}%`, transition: 'width 0.3s ease' }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-dim)', fontVariantNumeric: 'tabular-nums' }}>
                        <span>{formatTime(currentTime)}</span>
                        <span>{isPlaying ? 'W trakcie...' : 'Gotowy'}</span>
                    </div>
                </div>

                <div className="dictation-controls" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {!isPlaying ? (
                        <button className="btn-primary" onClick={handleSpeak}>Rozpocznij słuchanie</button>
                    ) : isPaused ? (
                        <button className="btn-primary" onClick={handleResume}>Wznów</button>
                    ) : (
                        <button className="btn-primary" onClick={handlePause} style={{ background: '#64748b' }}>Pauza</button>
                    )}

                    {isPlaying && (
                        <button className="btn-ghost" onClick={handleStop} style={{ border: '1px solid #cbd5e1' }}>Stop</button>
                    )}

                    <button
                        className="btn-ghost"
                        onClick={() => setShowText(!showText)}
                        style={{ marginLeft: 'auto', border: '1px solid var(--primary)', color: 'var(--primary)' }}
                    >
                        {showText ? 'Ukryj tekst' : 'Sprawdź tekst'}
                    </button>
                </div>
            </div>

            {showText && (
                <div className="dictation-text" style={{ lineHeight: '1.8', textAlign: 'justify' }}>
                    {currentDictation.text}
                </div>
            )}

            <div style={{ marginTop: '2rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                <p>Instrukcja: Posłuchaj tekstu, zapisz go w swoim notatniku, a następnie kliknij "Sprawdź", aby zweryfikować poprawność.</p>
            </div>
        </div>
    );
};

export default DictationSection;
