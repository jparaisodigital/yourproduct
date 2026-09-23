export const packageSupplies = [
    {
      id: 'supply-sticker',
      sku: 'SUP-STICKER',
      name: 'Sticker',
      category: 'packaging-supply',
      unitLabel: 'piece',
  
      stockQuantity: 1000,
      lowStockThreshold: 100,
  
      costPerUnit: null,
  
      trackInventory: true,
      isActive: true,
      isSample: true,
    },
  
    {
      id: 'supply-tester-kit',
      sku: 'SUP-TESTER-KIT',
      name: 'Tester Kit',
      category: 'package-equipment',
      unitLabel: 'kit',
  
      stockQuantity: 20,
      lowStockThreshold: 3,
  
      costPerUnit: null,
  
      trackInventory: true,
      isActive: true,
      isSample: true,
    },
  
    {
      id: 'supply-tarpaulin',
      sku: 'SUP-TARPAULIN',
      name: 'Tarpaulin',
      category: 'package-equipment',
      unitLabel: 'piece',
  
      stockQuantity: 10,
      lowStockThreshold: 2,
  
      costPerUnit: null,
  
      trackInventory: true,
      isActive: true,
      isSample: true,
    },
  
    {
      id: 'supply-mini-stall',
      sku: 'SUP-MINI-STALL',
      name: 'Mini Stall',
      category: 'package-equipment',
      unitLabel: 'unit',
  
      stockQuantity: 3,
      lowStockThreshold: 1,
  
      costPerUnit: null,
  
      trackInventory: true,
      isActive: true,
      isSample: true,
    },
  ]
  
  export const packageSupplyCategoryLabels = {
    'packaging-supply': 'Packaging Supply',
    'package-equipment': 'Package Equipment',
  }