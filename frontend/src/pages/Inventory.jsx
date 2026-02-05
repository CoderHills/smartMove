import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Plus, Minus } from 'lucide-react';
import { inventoryService } from '../services/inventoryService';
import '../styles/Inventory.css';

const Inventory = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('1BR');
  const [templates, setTemplates] = useState({});
  const [items, setItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

useEffect(() => {
    const fetchTemplates = async () => {
      try {
        const data = await inventoryService.getTemplates();
        const templatesData = data.templates || {};
        setTemplates(templatesData);
        
        // Set items from templates or use default items
        const roomTypeMap = {
          'Bedsitter': 'bedsitter',
          'Studio': 'studio',
          '1BR': '1_bedroom',
          '2BR': '2_bedroom'
        };
        
        const currentRoomType = roomTypeMap['1BR']; // Default to 1BR
        const defaultItems = {
          'Bed (Queen/King)': 0,
          'Mattress': 0,
          'Wardrobe': 0,
          'Desk': 0,
          'Office Chair': 0,
          'Sofa': 0,
          'Coffee Table': 0,
          'TV Stand': 0,
          'Dining Table': 0,
          'Dining Chairs (4)': 0,
          'Bookshelves': 0,
          'Kitchenware': 0,
          'Boxes': 0
        };
        
        // Use items from template if available, otherwise use default
        const roomItems = templatesData[currentRoomType] || {};
        setItems(roomItems.items || defaultItems);
      } catch (err) {
        console.error('Failed to fetch templates:', err);
        // Use default items on error
        setItems({
          'Bed (Queen/King)': 0,
          'Mattress': 0,
          'Wardrobe': 0,
          'Desk': 0,
          'Office Chair': 0,
          'Sofa': 0,
          'Coffee Table': 0,
          'TV Stand': 0,
          'Dining Table': 0,
          'Dining Chairs (4)': 0,
          'Bookshelves': 0,
          'Kitchenware': 0,
          'Boxes': 0
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const updateItem = (itemName, delta) => {
    setItems(prev => ({
      ...prev,
      [itemName]: Math.max(0, prev[itemName] + delta)
    }));
  };

  const totalItems = Object.values(items).reduce((sum, count) => sum + count, 0);
  const estimatedVolume = totalItems * 0.5;

  const handleContinue = async () => {
    // Save inventory to session for booking
    const inventoryData = {
      roomType: activeTab,
      items: items,
      totalItems,
      estimatedVolume
    };
    sessionStorage.setItem('inventoryData', JSON.stringify(inventoryData));
    navigate('/booking');
  };

  // Map room types
  const roomTypeMap = {
    'Bedsitter': 'bedsitter',
    'Studio': 'studio',
    '1BR': '1_bedroom',
    '2BR': '2_bedroom'
  };

  // Default items for each room type
  const defaultItems = {
    'Bedsitter': ['Mattress', 'Wardrobe', 'Desk', 'Sofa', 'Coffee Table', 'TV Stand', 'Boxes'],
    'Studio': ['Mattress', 'Wardrobe', 'Desk', 'Sofa', 'Coffee Table', 'TV Stand', 'Dining Table', 'Kitchenware', 'Boxes'],
    '1BR': ['Bed (Queen/King)', 'Mattress', 'Wardrobe', 'Desk', 'Office Chair', 'Sofa', 'Coffee Table', 'TV Stand', 'Dining Table', 'Dining Chairs (4)', 'Kitchenware', 'Boxes'],
    '2BR': ['Bed (Queen/King)', 'Mattress', 'Wardrobe (2)', 'Desk', 'Office Chair', 'Sofa', 'Coffee Table', 'TV Stand', 'Dining Table', 'Dining Chairs (4)', 'Bookshelves', 'Kitchenware', 'Boxes']
  };

  const tabs = ['Bedsitter', 'Studio', '1BR', '2BR'];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="inventory-main">
        <h1>Inventory Checklist</h1>

        {loading && <div className="loading">Loading inventory templates...</div>}

        {!loading && (
          <>
            <div className="inventory-tabs">
              {tabs.map(tab => (
                <button
                  key={tab}
                  className={`tab ${activeTab === tab ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="inventory-content">
              <div className="items-section">
                <h2>Select Items to Move</h2>
                <div className="items-list">
                  {Object.entries(items).map(([itemName, count]) => (
                    <div key={itemName} className="item-row">
                      <span className="item-name">{itemName}</span>
                      <div className="item-controls">
                        <button 
                          className="item-btn"
                          onClick={() => updateItem(itemName, -1)}
                        >
                          <Minus size={16} />
                        </button>
                        <span className="item-count">{count}</span>
                        <button 
                          className="item-btn"
                          onClick={() => updateItem(itemName, 1)}
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="summary-section">
                <div className="summary-card">
                  <h3>Inventory Summary</h3>
                  <div className="summary-row">
                    <span>Room Type:</span>
                    <strong>{activeTab}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Total Items:</span>
                    <strong>{totalItems}</strong>
                  </div>
                  <div className="summary-row">
                    <span>Estimated Volume:</span>
                    <strong>{estimatedVolume}m³</strong>
                  </div>
                  <button 
                    className="continue-btn"
                    onClick={handleContinue}
                  >
                    Continue to Movers
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Inventory;

