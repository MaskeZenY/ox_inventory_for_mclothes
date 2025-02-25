import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory, SlotWithItem } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getItemUrl, getTotalWeight } from '../../helpers';
import { useAppSelector } from '../../store';
import { useIntersection } from '../../hooks/useIntersection';
import { imagepath } from '../../store/imagepath';

const PAGE_SIZE = 30;

const InventoryGrid: React.FC<{ inventory: Inventory }> = ({ inventory }) => {
  const weight = useMemo(
    () => (inventory.maxWeight !== undefined ? Math.floor(getTotalWeight(inventory.items) * 1000) / 1000 : 0),
    [inventory.maxWeight, inventory.items]
  );
  const [page, setPage] = useState(0);
  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);
  const [filterCloth, setFilterCloth] = useState(false);
  const [filterWeapon, setFilterWeapon] = useState(false);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  // Logique de filtrage
  const displayedItems = filterCloth
    ? inventory.items.filter((item) => item.name?.startsWith('cloth'))
    : filterWeapon
    ? inventory.items.filter((item) => item.name?.startsWith('WEAPON'))
    : inventory.items;

  return (
    <>
      <div className="inventory-grid-wrapper" style={{ pointerEvents: isBusy ? 'none' : 'auto' }}>
        <div>
          <div className="inventory-grid-header-wrapper" style={{ marginBottom: '15px' }}>
            <p style={{ margin: '0', padding: '5px 0' }}>{inventory.label}</p>
          </div>
          <div className="flex-container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div className="buttons-group" style={{ display: 'flex', gap: '8px' }}>
              <button className="button" onClick={() => { setFilterCloth(false); setFilterWeapon(false); }}>
                <img src={`${imagepath}/back.png`} alt="tous les articles" />
              </button>
              <button className="button" onClick={() => { setFilterCloth(true); setFilterWeapon(false); }}>
                <img src={`${imagepath}/clotheimageinv.png`} alt="vêtements" />
              </button>
              <button className="button" onClick={() => { setFilterWeapon(true); setFilterCloth(false); }}>
                <img src={`${imagepath}/weapon.png`} alt="armes" />
              </button>
            </div>
            {inventory.maxWeight && (
              <div className="weight-bar-wrapper" style={{ marginLeft: 'auto' }}>
                {(weight / 1000).toFixed(2)}/{(inventory.maxWeight / 1000).toFixed(2)}kg
                <WeightBar percent={inventory.maxWeight ? (weight / inventory.maxWeight) * 100 : 0} />
              </div>
            )}
          </div>
        </div>
        <div className="inventory-grid-container" ref={containerRef}>
          <>
            {displayedItems.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
                image={item.name ? getItemUrl(item as SlotWithItem) : ''}
              />
            ))}
          </>
        </div>
      </div>
    </>
  );
};

export default InventoryGrid;
