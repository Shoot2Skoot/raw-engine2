/**
 * Yahtzee Game Component
 * Demonstrates simple grid-based roll-and-write game
 */

import React from 'react';
import { GameEngine } from '../../engine/core';
import { yahtzeeConfig } from './yahtzeeConfig';

export const Yahtzee: React.FC = () => {
  return (
    <div>
      <GameEngine config={yahtzeeConfig} />
    </div>
  );
};
