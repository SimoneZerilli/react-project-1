import React, { useState } from 'react';
import type { Joker } from '../types/game';
import { ALL_JOKERS } from '../game/jokers';
import { JokerCard } from './JokerCard';
import './JokerSlots.css';

interface JokerSlotsProps {
  equippedJokers: Joker[];
  maxSlots?: number;
  onSellJoker: (jokerId: string) => void;
  onEquipJoker: (joker: Joker) => void;
}

export const JokerSlots: React.FC<JokerSlotsProps> = ({
  equippedJokers,
  maxSlots = 5,
  onSellJoker,
  onEquipJoker,
}) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const emptySlotsCount = Math.max(0, maxSlots - equippedJokers.length);

  return (
    <section className="joker-slots-panel pixel-panel" aria-label={`Slot Jolly equipaggiati: ${equippedJokers.length} su ${maxSlots}`}>
      <div className="joker-slots-header">
        <div className="joker-slots-title-group">
          <span className="joker-panel-tag">[ EQUIPAGGIAMENTO ]</span>
          <h3 className="joker-slots-title">
            JOLLY ATTIVI: <span className="status-gold">{equippedJokers.length} / {maxSlots}</span>
          </h3>
        </div>

        {equippedJokers.length < maxSlots && (
          <button
            type="button"
            className="pixel-btn btn-add-test-joker"
            onClick={() => setIsPickerOpen((prev) => !prev)}
            aria-label="Equipaggia un Jolly dal catalogo per testare"
          >
            {isPickerOpen ? '[ CHIUDI CATALOGO ]' : '[ + AGGIUNGI JOLLY PER TESTARE ]'}
          </button>
        )}
      </div>

      {/* Selettore rapido per testare i 7 Jolly */}
      {isPickerOpen && (
        <div className="joker-picker-drawer pixel-panel pixel-panel-blood" role="dialog" aria-label="Catalogo dei 7 Jolly">
          <div className="picker-header">
            <h4>[ SCEGLI UN JOLLY DA EQUIPAGGIARE (CATALOGO DEI 7) ]</h4>
          </div>
          <div className="picker-grid">
            {ALL_JOKERS.map((joker) => {
              const isAlreadyEquipped = equippedJokers.some((j) => j.id === joker.id);
              return (
                <div key={joker.id} className="picker-item">
                  <JokerCard joker={joker} showSellButton={false} />
                  <button
                    type="button"
                    className="pixel-btn btn-picker-select"
                    disabled={isAlreadyEquipped}
                    onClick={() => {
                      onEquipJoker(joker);
                      setIsPickerOpen(false);
                    }}
                    aria-label={`Equipaggia ${joker.name}`}
                  >
                    {isAlreadyEquipped ? '[ GIA ATTIVO ]' : '[ EQUIPAGGIA ]'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Griglia dei 5 slot */}
      <div className="slots-row">
        {equippedJokers.map((joker) => (
          <JokerCard key={joker.id} joker={joker} onSell={onSellJoker} />
        ))}

        {Array.from({ length: emptySlotsCount }).map((_, idx) => (
          <div key={`empty-slot-${idx}`} className="empty-joker-slot" aria-label="Slot Jolly vuoto">
            <span className="empty-slot-label">[ SLOT VUOTO ]</span>
            <span className="empty-slot-sub">Max 5 Jolly</span>
          </div>
        ))}
      </div>
    </section>
  );
};

