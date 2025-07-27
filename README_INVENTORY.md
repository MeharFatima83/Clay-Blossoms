# Inventory Management System

A comprehensive inventory management system for the ClayBlossoms e-commerce platform that provides real-time stock tracking, automated alerts, and inventory analytics.

## 🚀 Features

### 📦 Stock Tracking
- **Real-time stock levels** for all products
- **Automatic stock updates** when orders are placed
- **Stock movement history** with detailed audit trail
- **Multiple movement types**: restock, sale, adjustment, damage, return

### 🚨 Automated Alerts
- **Low stock alerts** when inventory falls below threshold
- **Out of stock notifications** for immediate attention
- **Overstock warnings** when approaching maximum capacity
- **Configurable thresholds** per product

### 📊 Inventory Analytics
- **Dashboard overview** with key metrics
- **Inventory summary** with total value calculation
- **Low stock reports** for reordering
- **Stock movement analytics** for trend analysis

### 🔧 Management Tools
- **Bulk stock updates** for efficient inventory management
- **Stock adjustment** with reason tracking
- **Alert resolution** with action tracking
- **Export functionality** (JSON/CSV)

## 🏗️ Architecture

### Database Models

#### 1. Inventory Model (`inventoryModel.js`)
```javascript
{
  productId: ObjectId,           // Reference to product
  currentStock: Number,          // Current stock level
  lowStockThreshold: Number,     // Low stock alert threshold
  reorderPoint: Number,          // Reorder point
  maxStock: Number,              // Maximum stock capacity
  isLowStock: Boolean,           // Low stock flag
  isOutOfStock: Boolean,         // Out of stock flag
  lastUpdated: Date,             // Last update timestamp
  supplierInfo: {                // Supplier details
    name: String,
    email: String,
    phone: String,
    leadTime: Number
  }
}
```

#### 2. Stock Movement Model (`stockMovementModel.js`)
```javascript
{
  productId: ObjectId,           // Reference to product
  movementType: String,          // purchase, sale, adjustment, return, damage, restock
  quantity: Number,              // Quantity moved
  previousStock: Number,         // Stock before movement
  newStock: Number,              // Stock after movement
  reference: String,             // Order ID or reference
  reason: String,                // Movement reason
  performedBy: String,           // User who performed action
  cost: Number                   // Cost per unit (optional)
}
```

#### 3. Alert Model (`alertModel.js`)
```javascript
{
  productId: ObjectId,           // Reference to product
  alertType: String,             // low_stock, out_of_stock, reorder_point, overstock
  severity: String,              // low, medium, high, critical
  message: String,               // Alert message
  currentStock: Number,          // Current stock level
  threshold: Number,             // Threshold that triggered alert
  isRead: Boolean,               // Read status
  isResolved: Boolean,           // Resolution status
  resolvedBy: String,            // Who resolved the alert
  actionTaken: String            // Action taken to resolve
}
```

### Service Layer

#### Inventory Service (`inventoryService.js`)
- **Stock Management**: Update, track, and monitor stock levels
- **Alert System**: Automatic alert generation and management
- **Movement Tracking**: Record all stock movements with audit trail
- **Analytics**: Generate inventory reports and summaries

### API Endpoints

#### Inventory Management
- `GET /api/inventory/summary` - Get inventory summary
- `GET /api/inventory/all` - Get all inventory items with pagination
- `GET /api/inventory/product/:productId` - Get specific product inventory
- `POST /api/inventory/update-stock` - Update stock for a product
- `POST /api/inventory/bulk-update` - Bulk stock updates
- `PATCH /api/inventory/settings/:productId` - Update inventory settings

#### Alerts
- `GET /api/inventory/alerts` - Get inventory alerts
- `PATCH /api/inventory/alerts/:alertId/resolve` - Resolve an alert
- `GET /api/inventory/low-stock` - Get low stock products

#### Analytics
- `GET /api/inventory/dashboard` - Get dashboard data
- `GET /api/inventory/movements/:productId` - Get stock movement history
- `GET /api/inventory/export` - Export inventory data

## 🚀 Getting Started

### 1. Setup Environment
```bash
# Backend directory
cd backend

# Install dependencies
npm install

# Create .env file
echo "MONGODB_URL=your_mongodb_connection_string" > .env
```

### 2. Initialize Inventory
```bash
# Initialize inventory for existing products
npm run init-inventory
```

### 3. Start the Server
```bash
# Development mode
npm run dev
```

### 4. Access Inventory Management
- Navigate to `/admin/inventory` in your application
- Login with admin credentials
- Start managing your inventory

## 📱 Frontend Integration

### Admin Panel
The inventory management interface is available at `/admin/inventory` and includes:

- **Dashboard Overview**: Key metrics and summary
- **Inventory Table**: All products with stock levels
- **Stock Updates**: Modal for updating stock levels
- **Alert Management**: View and resolve alerts
- **Search & Filters**: Find products quickly
- **Export Functionality**: Download inventory data

### Features
- **Real-time Updates**: Stock levels update automatically
- **Responsive Design**: Works on all device sizes
- **User-friendly Interface**: Intuitive navigation and controls
- **Alert Notifications**: Visual indicators for low stock items

## 🔄 Automatic Stock Updates

### Order Integration
When orders are placed, the system automatically:
1. **Checks stock availability** before order confirmation
2. **Updates stock levels** when order is placed
3. **Records stock movements** for audit trail
4. **Generates alerts** if stock falls below thresholds

### Middleware Integration
```javascript
// Order router automatically includes inventory middleware
router.post('/create', checkStockAvailability, updateInventoryOnOrder, async (req, res) => {
  // Order creation logic
});
```

## 📊 Monitoring & Alerts

### Alert Types
1. **Low Stock Alert**: When stock ≤ lowStockThreshold
2. **Out of Stock Alert**: When stock = 0
3. **Reorder Point Alert**: When stock ≤ reorderPoint
4. **Overstock Alert**: When stock ≥ 90% of maxStock

### Alert Severity
- **Critical**: Out of stock
- **High**: Below reorder point
- **Medium**: Low stock
- **Low**: Overstock warning

## 🔧 Configuration

### Default Thresholds
- **Low Stock Threshold**: 10 units
- **Reorder Point**: 5 units
- **Max Stock**: 100 units

### Customization
Each product can have custom thresholds:
```javascript
await inventoryService.initializeInventory(
  productId,
  initialStock,
  lowStockThreshold,  // Custom threshold
  reorderPoint,       // Custom reorder point
  maxStock           // Custom max stock
);
```

## 📈 Analytics & Reporting

### Inventory Summary
- Total products in inventory
- Low stock products count
- Out of stock products count
- Active alerts count
- Total inventory value

### Stock Movement Analytics
- Movement history by product
- Movement types distribution
- Cost tracking for purchases
- Audit trail for all changes

## 🛠️ API Usage Examples

### Update Stock
```javascript
// Restock a product
const response = await fetch('/api/inventory/update-stock', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    productId: 'product_id',
    quantity: 50,
    movementType: 'restock',
    reason: 'New shipment received',
    performedBy: 'admin',
    cost: 25.50
  })
});
```

### Get Low Stock Products
```javascript
const response = await fetch('/api/inventory/low-stock');
const lowStockProducts = await response.json();
```

### Resolve Alert
```javascript
const response = await fetch('/api/inventory/alerts/alert_id/resolve', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    resolvedBy: 'admin',
    actionTaken: 'Restocked 50 units'
  })
});
```

## 🔒 Security & Validation

### Input Validation
- Stock quantities must be positive numbers
- Movement types must be valid enum values
- Product IDs must exist in database
- Alert resolution requires action description

### Audit Trail
- All stock movements are logged
- User tracking for all actions
- Timestamp tracking for all changes
- Reason tracking for all movements

## 🚀 Future Enhancements

### Planned Features
- **Email Notifications**: Automatic email alerts for low stock
- **Supplier Integration**: Direct supplier communication
- **Forecasting**: AI-powered demand forecasting
- **Barcode Integration**: Barcode scanning for stock updates
- **Mobile App**: Mobile inventory management
- **Advanced Analytics**: Predictive analytics and reporting

### Performance Optimizations
- **Caching**: Redis caching for frequently accessed data
- **Indexing**: Database indexing for faster queries
- **Pagination**: Efficient pagination for large datasets
- **Real-time Updates**: WebSocket integration for live updates

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📝 License

This inventory management system is part of the ClayBlossoms e-commerce platform.

## 🆘 Support

For support and questions:
- Check the documentation
- Review the API endpoints
- Contact the development team

---

**Note**: This inventory management system is designed to work seamlessly with the existing ClayBlossoms e-commerce platform without disturbing the current codebase. 