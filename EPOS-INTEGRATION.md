# EPOS Now Integration Documentation

## Overview
This document outlines the comprehensive EPOS Now v4 API integration implemented for the Aori Restaurant ordering system. The integration provides full POS functionality including menu sync, inventory management, payment processing, and real-time order tracking.

## Implemented Features

### ✅ Core Integration Components

#### 1. Enhanced EPOS API Client (`/src/lib/epos-api-enhanced.ts`)
- **Product Management**: Create, read, update products with EPOS Now
- **Category & Brand Management**: Full synchronization of menu structure  
- **Customer Management**: Automatic customer creation and lookup
- **Stock Management**: Real-time inventory tracking and adjustments
- **Order Management**: Complete order lifecycle from creation to completion
- **Discount System**: Active discount retrieval and application
- **Location Support**: Multi-location aware operations
- **Webhook Validation**: Secure webhook signature verification

#### 2. Menu Synchronization Service (`/src/lib/menu-sync.ts`)
- **Automated Sync**: Scheduled synchronization every hour
- **Product Mapping**: Intelligent mapping of EPOS products to local menu items
- **Image Management**: Automatic image assignment with fallback URLs
- **Availability Sync**: Real-time stock-based availability updates
- **Category Mapping**: Smart category detection and assignment
- **Allergen Detection**: Automatic allergen identification from descriptions

#### 3. Pure EPOS Payment Model
- **Pay on Collection**: All payments processed via EPOS Now POS system at collection time
- **Cash & Card**: Support for both cash and card payments at the terminal
- **No Online Gateway**: Simplified architecture without third-party payment processors
- **PCI Compliance**: All payment security handled by EPOS Now certified terminals

#### 4. Stock Tracking System (`/src/lib/stock-tracking.ts`)
- **Real-time Monitoring**: Continuous stock level monitoring
- **Alert System**: Low stock, out-of-stock, and reorder alerts
- **Movement Tracking**: Complete audit trail of stock movements
- **Inventory Reports**: Comprehensive inventory analysis
- **Critical Notifications**: Immediate alerts for critical stock levels

### ✅ API Endpoints

#### Order Management
- **POST /api/orders** - Enhanced order creation with customer and stock management
- **GET /api/orders?orderId={id}** - Detailed order status with items and customer info
- **GET /api/kitchen-status** - Kitchen dashboard with order queue and stock alerts

#### Sales Tracking
- **GET /api/admin/dashboard?section=sales** - Sales analytics and order revenue tracking

#### Webhook Handlers
- **POST /api/webhooks/epos** - EPOS Now webhook processor for real-time updates

#### Admin Dashboard
- **GET /api/admin/dashboard** - Comprehensive admin dashboard data
- **POST /api/admin/dashboard** - Admin actions (sync menu, update orders, stock management)

### ✅ Real-time Features

#### Webhook Event Processing
- **Product Events**: Menu updates, price changes, availability changes
- **Order Events**: New orders, status updates, completion notifications
- **Stock Events**: Stock level changes, low stock alerts
- **Customer Events**: Customer data synchronization
- **Discount Events**: Promotional updates and changes

#### Live Updates
- **Order Queue**: Real-time kitchen display updates
- **Stock Alerts**: Immediate out-of-stock notifications
- **Menu Changes**: Automatic menu updates without page refresh
- **Payment Status**: Live payment confirmation feedback

## Configuration

### Environment Variables
Copy `env.example` to `.env.local` and configure:

```bash
# EPOS Now Configuration
EPOS_NOW_API_KEY=your_epos_api_key
EPOS_NOW_API_SECRET=your_epos_secret
EPOS_NOW_LOCATION_ID=1
EPOS_NOW_WEBHOOK_SECRET=your_webhook_secret

# No payment gateway configuration required
# All payments processed via EPOS Now POS terminals
```

### EPOS Now Setup
1. **Create API Device**: Register your app in EPOS Now Backoffice
2. **Configure Webhooks**: Set up webhook endpoints in EPOS Now
3. **Location Configuration**: Set your location ID for multi-location support
4. **Product Categories**: Ensure your EPOS categories match local menu structure
5. **POS Terminal Setup**: Ensure your EPOS terminals are configured for card and cash payments
6. **Payment Types**: Configure tender types (Cash=1, Card=2) in your EPOS system

## Usage Examples

### Creating an Order (Pay on Collection)
```typescript
// Simple order creation - payment handled at collection
const order = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: cartItems,
    customerDetails: {
      name: 'John Smith',
      phone: '07123456789',
      email: 'john@example.com'
    },
    collectionTime: '2024-01-15T18:00:00Z',
    notes: 'Collection type: asap. Payment: Pay on collection.'
  })
});

// Order created in EPOS with 'Ordered' status
// Customer pays when they arrive for collection
// Staff can process payment via EPOS POS terminal
```

### Monitoring Stock Levels
```typescript
import { stockTrackingService } from '@/lib/stock-tracking';

// Get current stock summary
const stockSummary = stockTrackingService.getStockSummary();

// Get active alerts
const alerts = stockTrackingService.getActiveAlerts();

// Record stock movement
await stockTrackingService.recordStockMovement(
  productId: 123,
  movementType: 'DELIVERY',
  quantity: 50,
  reason: 'Weekly delivery'
);
```

### Menu Synchronization
```typescript
import { menuSyncService } from '@/lib/menu-sync';

// Force menu sync
const syncResult = await menuSyncService.syncMenu({
  forceSync: true,
  syncAvailability: true,
  updatePrices: true
});

// Check sync status
const status = menuSyncService.getSyncStatus();
```

## Architecture

### Data Flow
```
Frontend Order → EPOS Order Creation → Stock Updates → Real-time Notifications → Customer Collection → POS Payment
```

### Webhook Flow
```
EPOS Now → Webhook Validation → Event Processing → Database Updates → Client Notifications
```

### Menu Sync Flow
```
EPOS Products → Category Mapping → Image Assignment → Local Storage → Frontend Update
```

## Error Handling

### Order Management
- Order status tracking (Ordered → InProgress → Ready → Complete)
- Customer collection notifications
- Stock level updates on order completion
- POS payment processing at collection

### API Failures
- Retry mechanisms with exponential backoff
- Fallback data from local cache
- Error reporting and alerting
- Graceful degradation

### Stock Issues
- Real-time out-of-stock detection
- Automatic menu item disabling
- Alternative product suggestions
- Reorder notifications

## Monitoring and Analytics

### Key Metrics
- Order completion rates
- Payment success rates
- Stock turnover rates
- Average preparation times
- Customer satisfaction scores

### Dashboards
- Kitchen Display System
- Inventory Management Dashboard
- Sales Analytics Dashboard
- Customer Management Portal

### Alerts and Notifications
- Critical stock levels
- Payment failures
- Order delays
- System errors

## Security

### API Security
- HTTPS encryption for all API calls
- Webhook signature validation
- API rate limiting
- Request authentication

### Data Protection
- PCI DSS compliance via EPOS Now terminals
- GDPR compliance for customer data
- Encrypted data storage
- Access control and audit logs
- No sensitive payment data stored online

## Performance Optimization

### Caching Strategy
- Menu data caching with TTL
- Stock level caching with real-time invalidation
- Customer data caching
- Payment intent caching

### Background Processing
- Asynchronous webhook processing
- Background menu synchronization
- Batch stock updates
- Queued notification sending

## Troubleshooting

### Common Issues

#### Menu Not Syncing
- Check EPOS API credentials
- Verify webhook configuration
- Review category mappings
- Check network connectivity

#### Collection Payment Issues
- Ensure EPOS POS terminals are online
- Verify tender types are configured correctly
- Check card reader connectivity
- Review cash drawer functionality

#### Stock Discrepancies
- Check stock tracking service
- Verify EPOS stock movements
- Review adjustment records
- Validate movement calculations

### Debug Tools
- API request logging
- Webhook event debugging
- Payment flow tracing
- Stock movement auditing

## Future Enhancements

### Planned Features
- Multi-location management
- Advanced analytics dashboard
- Customer loyalty program integration
- Automated reordering system
- Mobile admin applications

### Performance Improvements
- GraphQL API implementation
- Real-time WebSocket connections
- Advanced caching strategies
- Database optimization

## Support and Maintenance

### Regular Tasks
- Monitor webhook health
- Review error logs
- Update stock levels
- Sync menu changes
- Process payment reports

### Monthly Reviews
- Analyze sales data
- Review stock turnover
- Update pricing strategies
- Assess system performance
- Plan feature updates

## API Reference

For detailed API documentation, see the individual endpoint files:
- Order Management: `/src/app/api/orders/route.ts`
- Payment Processing: `/src/app/api/payments/*/route.ts`
- Webhook Handlers: `/src/app/api/webhooks/*/route.ts`
- Admin Dashboard: `/src/app/api/admin/dashboard/route.ts`
- Kitchen Status: `/src/app/api/kitchen-status/route.ts`

## Conclusion

This comprehensive EPOS Now integration provides a production-ready restaurant ordering system with full POS functionality, real-time inventory management, secure payment processing, and advanced analytics. The modular architecture ensures scalability and maintainability while providing the flexibility to adapt to changing business requirements.