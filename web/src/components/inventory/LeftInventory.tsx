import InventoryGrid from './InventoryGrid';
import { useAppSelector } from '../../store';
import { selectLeftInventory } from '../../store/inventory';

const LeftInventory: React.FC<{ slotsClothes: string }> = ({ slotsClothes }) => {
  const leftInventory = useAppSelector(selectLeftInventory);

  return <InventoryGrid inventory={leftInventory} slotsClothes={slotsClothes} />;
};

export default LeftInventory;
