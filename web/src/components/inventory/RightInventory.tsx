import InventoryGrid from './InventoryGridRight';
import { useAppSelector } from '../../store';
import { selectRightInventory } from '../../store/inventory';

const RightInventory: React.FC = () => {
  const rightInventory = useAppSelector(selectRightInventory);

  return <InventoryGrid inventory={rightInventory} />;
};

export default RightInventory;
