import React from 'react';
import enMessages from '../locales/en.json';

export function DifficultySelector({ difficulty, onChange, messages = enMessages }) {
    const difficulties = [
        { value: 'easy', label: messages.diffEasy },
        { value: 'medium', label: messages.diffMedium },
        { value: 'hard', label: messages.diffHard },
        { value: 'expert', label: messages.diffExpert },
    ];

    return (
        <fieldset id="difficulty-group" className="difficulty-group">
            <legend className="difficulty-group__legend">{messages.difficultyLegend}</legend>
            <div className="difficulty-options segmented segmented-strong">
                {difficulties.map((item) => {
                    const isChecked = difficulty === item.value;
                    return (
                        <label
                            key={item.value}
                            className={`button difficulty-label ${isChecked ? 'button-active difficulty-label--active' : ''}`}
                        >
                            <input
                                type="radio"
                                name="sudoku-difficulty"
                                value={item.value}
                                checked={isChecked}
                                onChange={() => onChange(item.value)}
                            />
                            <span>{item.label}</span>
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}
