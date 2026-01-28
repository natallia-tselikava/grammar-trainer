import React, { useState } from 'react';
import { grammarData } from '../data/grammarData';

const GrammarSection = () => {
    const [selectedSetIndex, setSelectedSetIndex] = useState(0);
    const selectedCategory = grammarData[selectedSetIndex];
    const [inputs, setInputs] = useState({});
    const [results, setResults] = useState({});

    const handleInputChange = (exerciseId, value) => {
        setInputs(prev => ({ ...prev, [exerciseId]: value }));
    };

    const handleCheck = (exerciseId, correctAnswer) => {
        const isCorrect = inputs[exerciseId]?.trim().toLowerCase() === correctAnswer.toLowerCase();
        setResults(prev => ({ ...prev, [exerciseId]: isCorrect }));
    };

    const nextSet = () => {
        if (selectedSetIndex < grammarData.length - 1) {
            setSelectedSetIndex(selectedSetIndex + 1);
            setResults({});
            setInputs({});
        }
    };

    const prevSet = () => {
        if (selectedSetIndex > 0) {
            setSelectedSetIndex(selectedSetIndex - 1);
            setResults({});
            setInputs({});
        }
    };

    return (
        <div className="grammar-layout">
            <aside className="sidebar">
                <h4>Zestawy ćwiczeń</h4>
                <ul className="sidebar-list">
                    {grammarData.map((set, index) => (
                        <li
                            key={set.id}
                            className={`sidebar-item ${selectedSetIndex === index ? 'active' : ''}`}
                            onClick={() => {
                                setSelectedSetIndex(index);
                                setResults({});
                                setInputs({});
                            }}
                        >
                            <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', opacity: 0.8 }}>Zestaw {index + 1}</div>
                            {set.title.replace(`Zestaw ${index + 1}: `, '')}
                        </li>
                    ))}
                </ul>
            </aside>

            <main className="main-content">
                <div className="glass-card">
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ color: 'var(--primary)', marginBottom: '0.25rem', fontSize: '1.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {selectedCategory.category}
                        </h2>
                        <h3 style={{ fontSize: 'clamp(1.4rem, 5vw, 1.8rem)', margin: '0' }}>{selectedCategory.title}</h3>
                    </div>

                    <div>
                        {selectedCategory.exercises.map((ex) => (
                            <div key={ex.id} className="exercise-item" style={{ animation: 'fadeIn 0.3s ease-out' }}>
                                <p style={{ fontSize: '1.2rem', marginBottom: '1rem' }}>
                                    {ex.parts[0]}
                                    <input
                                        type="text"
                                        placeholder={ex.hint}
                                        value={inputs[ex.id] || ''}
                                        onChange={(e) => handleInputChange(ex.id, e.target.value)}
                                        className={results[ex.id] === true ? 'correct' : results[ex.id] === false ? 'incorrect' : ''}
                                    />
                                    {ex.parts[1]}
                                </p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <button
                                        className="btn-ghost"
                                        style={{ padding: '0.4rem 1.2rem', fontSize: '0.9rem' }}
                                        onClick={() => handleCheck(ex.id, ex.answer)}
                                    >
                                        Sprawdź
                                    </button>
                                    {results[ex.id] === true && <span className="feedback success">Dobrze!</span>}
                                    {results[ex.id] === false && <span className="feedback error">Spróbuj: <strong>{ex.answer}</strong></span>}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center' }}>
                        <button
                            className="btn-primary"
                            style={{ width: '100%', maxWidth: '300px' }}
                            onClick={() => {
                                selectedCategory.exercises.forEach(ex => handleCheck(ex.id, ex.answer));
                            }}
                        >
                            Sprawdź wszystko
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default GrammarSection;
