import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Inventory } from '../../typings';
import WeightBar from '../utils/WeightBar';
import InventorySlot from './InventorySlot';
import { getTotalWeight } from '../../helpers';
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
  const [filterCloth, setFilterCloth] = useState(false);
  const [filterWeapon, setFilterWeapon] = useState(false);

  const containerRef = useRef(null);
  const { ref, entry } = useIntersection({ threshold: 0.5 });
  const isBusy = useAppSelector((state) => state.inventory.isBusy);

  useEffect(() => {
    if (entry && entry.isIntersecting) {
      setPage((prev) => ++prev);
    }
  }, [entry]);

  const mainItems = inventory.items.slice(0, inventory.items.length - 16);
  const lastItems = inventory.items.slice(-16);

  // Logique de filtrage
  const displayedItems = filterCloth
    ? mainItems.filter((item) => item.name?.startsWith('cloth'))
    : filterWeapon
    ? mainItems.filter((item) => item.name?.startsWith('WEAPON'))
    : mainItems;

  
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
                <img src={`${imagepath}/back.png`} alt="all items" />
              </button>
              <button className="button" onClick={() => { setFilterCloth(true); setFilterWeapon(false); }}>
                <img src={`${imagepath}/clotheimageinv.png`} alt="clothes" />
              </button>
              <button className="button" onClick={() => { setFilterWeapon(true); setFilterCloth(false); }}>
                <img src={`${imagepath}/weapon.png`} alt="weapons" />
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
          {displayedItems.slice(0, (page + 1) * PAGE_SIZE).map((item, index) => (
            <InventorySlot
              key={`${inventory.type}-${inventory.id}-${item.slot}`}
              item={item}
              ref={index === (page + 1) * PAGE_SIZE - 1 ? ref : null}
              inventoryType={inventory.type}
              inventoryGroups={inventory.groups}
              inventoryId={inventory.id}
            />
          ))}
          
        </div>

        {/* Slots pour les vêtements (les 16 derniers items) */}
        <div className="inventory-grid-bottom">
          <div className="inventory-grid-bottom-column">
            {lastItems.slice(0, 8).map((item) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                inventoryType={inventory.type}
                image={item.slot >= 30 && item.slot <= 46 + 15 ? `${imagepath}/${item.slot - 15}.png` : ''}
                inventoryGroups={inventory.groups}
                inventoryId={inventory.id}
              />
            ))}
          </div>
          <div className="inventory-grid-bottom-column">
            {lastItems.slice(8, 16).map((item) => (
              <InventorySlot
                key={`${inventory.type}-${inventory.id}-${item.slot}`}
                item={item}
                inventoryType={inventory.type}
                inventoryGroups={inventory.groups}
                image={item.slot >= 30 && item.slot <= 46 + 15 ? `${imagepath}/${item.slot - 15}.png` : ''}
                inventoryId={inventory.id}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default InventoryGrid;
