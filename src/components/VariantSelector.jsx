import React from 'react';
import { getVariantSpec } from '../domain/sudoku-variants.js';
import enMessages from '../locales/en.json';

function VariantGridIcon({ variant }) {
    const { gridSize, boxRows, boxCols } = getVariantSpec(variant);
    const dividers = Array.from({ length: gridSize - 1 }, (_, index) => index + 1);

    return (
        <svg
            className="variant-label__grid"
            viewBox={`-0.5 -0.5 ${gridSize + 1} ${gridSize + 1}`}
            fill="none"
            stroke="currentColor"
            aria-hidden="true"
        >
            <rect width={gridSize} height={gridSize} strokeWidth="1.3" vectorEffect="non-scaling-stroke" />
            {dividers.map((position) => (
                <React.Fragment key={position}>
                    <path
                        d={`M0 ${position}H${gridSize}`}
                        strokeWidth={position % boxRows === 0 ? 1.3 : 0.55}
                        vectorEffect="non-scaling-stroke"
                    />
                    <path
                        d={`M${position} 0V${gridSize}`}
                        strokeWidth={position % boxCols === 0 ? 1.3 : 0.55}
                        vectorEffect="non-scaling-stroke"
                    />
                </React.Fragment>
            ))}
        </svg>
    );
}

export function VariantSelector({ variant, onChange, messages = enMessages }) {
    const variants = [
        { value: '2x3', label: messages.variant2x3 },
        { value: '3x3', label: messages.variant3x3 },
    ];

    return (
        <fieldset id="variant-group" className="variant-group">
            <legend className="variant-group__legend">{messages.variantLegend}</legend>
            <div className="variant-options segmented segmented-strong">
                {variants.map((item) => {
                    const isChecked = variant === item.value;
                    return (
                        <label
                            key={item.value}
                            className={`button variant-label ${isChecked ? 'button-active variant-label--active' : ''}`}
                        >
                            <input
                                type="radio"
                                name="sudoku-variant"
                                value={item.value}
                                checked={isChecked}
                                onChange={() => onChange(item.value)}
                            />
                            <VariantGridIcon variant={item.value} />
                            <span>{item.label}</span>
                        </label>
                    );
                })}
            </div>
        </fieldset>
    );
}
