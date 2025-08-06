import { NextRequest, NextResponse } from 'next/server';
import { enhancedEposAPI } from '@/lib/epos-api-enhanced';
import { menuSyncService } from '@/lib/menu-sync';
import type { EposWebhookEvent } from '@/lib/epos-api-enhanced';

// EPOS Now Webhook Handler
// Handles real-time events from EPOS Now system

export async function POST(request: NextRequest) {
  try {
    const signature = request.headers.get('x-epos-signature') || '';
    const payload = await request.text();

    // Validate webhook signature
    if (!enhancedEposAPI.validateWebhookSignature(payload, signature)) {
      console.error('Invalid webhook signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 401 }
      );
    }

    // Parse webhook event
    const event: EposWebhookEvent = enhancedEposAPI.parseWebhookEvent(payload);
    
    console.log(`Received EPOS webhook: ${event.EventType} for ${event.EntityType} ${event.EntityId}`);

    // Process event based on type
    await processWebhookEvent(event);

    return NextResponse.json({ success: true, processed: event.EventType });

  } catch (error) {
    console.error('Webhook processing failed:', error);
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

async function processWebhookEvent(event: EposWebhookEvent): Promise<void> {
  switch (event.EntityType.toLowerCase()) {
    case 'product':
      await handleProductEvent(event);
      break;
    
    case 'category':
      await handleCategoryEvent(event);
      break;
    
    case 'transaction':
      await handleTransactionEvent(event);
      break;
    
    case 'stock':
    case 'productstock':
      await handleStockEvent(event);
      break;
    
    case 'customer':
      await handleCustomerEvent(event);
      break;
    
    case 'discount':
      await handleDiscountEvent(event);
      break;
    
    default:
      console.log(`Unhandled webhook event type: ${event.EntityType}`);
  }
}

// Product event handlers
async function handleProductEvent(event: EposWebhookEvent): Promise<void> {
  try {
    switch (event.Action) {
      case 'Create':
        console.log(`New product created: ${event.EntityId}`);
        await triggerMenuSync('Product created');
        break;
      
      case 'Update':
        console.log(`Product updated: ${event.EntityId}`);
        await triggerMenuSync('Product updated');
        break;
      
      case 'Delete':
        console.log(`Product deleted: ${event.EntityId}`);
        await triggerMenuSync('Product deleted');
        break;
    }
  } catch (error) {
    console.error('Product event handling failed:', error);
  }
}

// Category event handlers
async function handleCategoryEvent(event: EposWebhookEvent): Promise<void> {
  try {
    switch (event.Action) {
      case 'Create':
      case 'Update':
      case 'Delete':
        console.log(`Category ${event.Action.toLowerCase()}: ${event.EntityId}`);
        await triggerMenuSync(`Category ${event.Action.toLowerCase()}`);
        break;
    }
  } catch (error) {
    console.error('Category event handling failed:', error);
  }
}

// Transaction event handlers
async function handleTransactionEvent(event: EposWebhookEvent): Promise<void> {
  try {
    const transactionId = event.EntityId;
    
    switch (event.Action) {
      case 'Create':
        console.log(`New order created: ${transactionId}`);
        await notifyOrderCreated(transactionId, event.Data);
        break;
      
      case 'Update':
        console.log(`Order updated: ${transactionId}`);
        await notifyOrderStatusChanged(transactionId, event.Data);
        break;
    }
  } catch (error) {
    console.error('Transaction event handling failed:', error);
  }
}

// Stock event handlers
async function handleStockEvent(event: EposWebhookEvent): Promise<void> {
  try {
    switch (event.Action) {
      case 'Update':
        console.log(`Stock updated for product: ${event.Data?.ProductId || 'unknown'}`);
        await handleStockUpdate(event.Data);
        break;
    }
  } catch (error) {
    console.error('Stock event handling failed:', error);
  }
}

// Customer event handlers
async function handleCustomerEvent(event: EposWebhookEvent): Promise<void> {
  try {
    console.log(`Customer ${event.Action.toLowerCase()}: ${event.EntityId}`);
    // Handle customer data sync if needed
  } catch (error) {
    console.error('Customer event handling failed:', error);
  }
}

// Discount event handlers
async function handleDiscountEvent(event: EposWebhookEvent): Promise<void> {
  try {
    console.log(`Discount ${event.Action.toLowerCase()}: ${event.EntityId}`);
    // Trigger discount refresh in frontend
    await broadcastDiscountUpdate(event.EntityId, event.Action);
  } catch (error) {
    console.error('Discount event handling failed:', error);
  }
}

// Helper functions
async function triggerMenuSync(reason: string): Promise<void> {
  try {
    console.log(`Triggering menu sync: ${reason}`);
    
    // Trigger async menu sync
    menuSyncService.syncMenu({
      forceSync: true,
      syncImages: false,
      updatePrices: true,
      syncAvailability: true
    }).catch(error => {
      console.error('Async menu sync failed:', error);
    });
    
    // Broadcast menu update to connected clients
    await broadcastMenuUpdate(reason);
  } catch (error) {
    console.error('Failed to trigger menu sync:', error);
  }
}

async function notifyOrderCreated(transactionId: number, data: any): Promise<void> {
  try {
    // Get full order details
    const orderStatus = await enhancedEposAPI.getOrderStatus(transactionId);
    
    // Broadcast to kitchen display systems
    await broadcastToKitchen({
      type: 'NEW_ORDER',
      orderId: transactionId,
      transaction: orderStatus.transaction,
      items: orderStatus.items,
      timestamp: new Date().toISOString()
    });
    
    console.log(`Order ${transactionId} broadcast to kitchen`);
  } catch (error) {
    console.error('Failed to notify order created:', error);
  }
}

async function notifyOrderStatusChanged(transactionId: number, data: any): Promise<void> {
  try {
    // Get updated order details
    const orderStatus = await enhancedEposAPI.getOrderStatus(transactionId);
    
    // Broadcast status update
    await broadcastOrderUpdate({
      type: 'ORDER_STATUS_UPDATE',
      orderId: transactionId,
      status: orderStatus.status,
      transaction: orderStatus.transaction,
      timestamp: new Date().toISOString()
    });
    
    console.log(`Order ${transactionId} status update broadcast`);
  } catch (error) {
    console.error('Failed to notify order status change:', error);
  }
}

async function handleStockUpdate(stockData: any): Promise<void> {
  try {
    const productId = stockData?.ProductId;
    const newQuantity = stockData?.Quantity;
    
    if (!productId || newQuantity === undefined) {
      return;
    }
    
    // Check if item is now out of stock or low stock
    const isOutOfStock = newQuantity <= 0;
    const isLowStock = newQuantity > 0 && newQuantity <= (stockData?.MinStockLevel || 5);
    
    if (isOutOfStock || isLowStock) {
      await broadcastStockAlert({
        type: isOutOfStock ? 'OUT_OF_STOCK' : 'LOW_STOCK',
        productId,
        currentStock: newQuantity,
        minStock: stockData?.MinStockLevel || 0,
        timestamp: new Date().toISOString()
      });
    }
    
    // Trigger menu sync to update availability
    if (isOutOfStock) {
      await triggerMenuSync(`Product ${productId} out of stock`);
    }
  } catch (error) {
    console.error('Failed to handle stock update:', error);
  }
}

// Broadcasting functions (implement with WebSocket, Server-Sent Events, or push notifications)
async function broadcastMenuUpdate(reason: string): Promise<void> {
  // In a real implementation, you would broadcast to connected clients
  // This could use WebSockets, Server-Sent Events, or push notifications
  console.log(`Broadcasting menu update: ${reason}`);
  
  // Example: Store update notification for polling clients
  if (typeof global !== 'undefined') {
    global.lastMenuUpdate = {
      reason,
      timestamp: new Date().toISOString()
    };
  }
}

async function broadcastToKitchen(data: any): Promise<void> {
  console.log('Broadcasting to kitchen:', data);
  
  // Store for kitchen display polling
  if (typeof global !== 'undefined') {
    global.kitchenUpdates = global.kitchenUpdates || [];
    global.kitchenUpdates.push(data);
    
    // Keep only last 50 updates
    if (global.kitchenUpdates.length > 50) {
      global.kitchenUpdates = global.kitchenUpdates.slice(-50);
    }
  }
}

async function broadcastOrderUpdate(data: any): Promise<void> {
  console.log('Broadcasting order update:', data);
  
  // Store for client polling
  if (typeof global !== 'undefined') {
    global.orderUpdates = global.orderUpdates || [];
    global.orderUpdates.push(data);
    
    // Keep only last 100 updates
    if (global.orderUpdates.length > 100) {
      global.orderUpdates = global.orderUpdates.slice(-100);
    }
  }
}

async function broadcastStockAlert(data: any): Promise<void> {
  console.log('Broadcasting stock alert:', data);
  
  // Store for admin dashboard
  if (typeof global !== 'undefined') {
    global.stockAlerts = global.stockAlerts || [];
    global.stockAlerts.push(data);
    
    // Keep only last 20 alerts
    if (global.stockAlerts.length > 20) {
      global.stockAlerts = global.stockAlerts.slice(-20);
    }
  }
}

async function broadcastDiscountUpdate(discountId: number, action: string): Promise<void> {
  console.log(`Broadcasting discount update: ${discountId} ${action}`);
  
  // Store for frontend to refresh discounts
  if (typeof global !== 'undefined') {
    global.discountUpdates = global.discountUpdates || [];
    global.discountUpdates.push({
      discountId,
      action,
      timestamp: new Date().toISOString()
    });
    
    // Keep only last 10 updates
    if (global.discountUpdates.length > 10) {
      global.discountUpdates = global.discountUpdates.slice(-10);
    }
  }
}