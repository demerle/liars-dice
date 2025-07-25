import React from 'react';
import { getDiceUnicode } from '../../utils/helpers';

const DiceDisplay = ({ dice, isVisible = false }) => {
    if (!dice || dice.length === 0) {
        return (
            <div className="dice-display">
                <div className="no-dice">No dice to display</div>
            </div>
        );
    }

    return (
        <div className="dice-display">
            <div className="dice-container">
                {dice.map((dieValue, index) => (
                    <div key={index} className={`die ${isVisible ? 'visible' : 'hidden'}`}>
                        {isVisible ? getDiceUnicode(dieValue) : '❓'}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DiceDisplay;