import { NextRequest, NextResponse } from 'next/server';
import { enhancedEposAPI } from '@/lib/epos-api-enhanced';
import { stockTrackingService } from '@/lib/stock-tracking';
import { CartItem, CustomerDetails } from '@/types/menu';

interface CreateOrderRequestBody {
  items: CartItem[];
  customerDetails: CustomerDetails;
  collectionTime: string;
  notes?: string;
}

// Helper function to extract EPOS product ID from menu item
function extractProductId(productName: string): number | undefined {
  // This would extract the EPOS product ID from the product name
  // For now, return undefined as we're using product names
  return undefined;
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateOrderRequestBody = await request.json();
    
    // Validate request
    if (!body.items || body.items.length === 0) {
      return NextResponse.json(
        { error: 'No items in order' },
        { status: 400 }
      );
    }

    if (!body.customerDetails.name || !body.customerDetails.phone) {
      return NextResponse.json(
        { error: 'Customer name and phone are required' },
        { status: 400 }
      );
    }

    // Calculate total amount
    const totalAmount = body.items.reduce((total, item) => {
      const price = item.variant?.price || item.menuItem.price;
      return total + (price * item.quantity);
    }, 0);

    // Transform cart items to EPOS format
    const eposItems = body.items.map(item => ({
      productName: `${item.menuItem.name}${item.variant ? ` - ${item.variant.name}` : ''}`,
      quantity: item.quantity,
      unitPrice: item.variant?.price || item.menuItem.price,
      notes: item.notes,
    }));

    // Create order with enhanced EPOS integration
    const orderResult = await enhancedEposAPI.createOrder({
      customerName: body.customerDetails.name,
      customerPhone: body.customerDetails.phone,
      customerEmail: body.customerDetails.email,
      items: eposItems.map(item => ({
        productId: extractProductId(item.productName),
        productName: item.productName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        notes: item.notes
      })),
      totalAmount,
      collectionTime: new Date(body.collectionTime),
      notes: body.notes,
    });

    // Record stock movements for sold items
    for (const item of eposItems) {
      const productId = extractProductId(item.productName);
      if (productId) {
        try {
          await stockTrackingService.recordStockMovement(
            productId,
            'SALE',
            item.quantity,
            `Order ${orderResult.transactionId}`,
            'system'
          );
        } catch (error) {
          console.warn(`Failed to record stock movement for product ${productId}:`, error);
        }
      }
    }

    // Return order confirmation (payment at collection)
    return NextResponse.json({
      success: true,
      orderId: orderResult.transactionId,
      estimatedReadyTime: orderResult.estimatedReadyTime.toISOString(),
      totalAmount: orderResult.finalTotal,
      paymentRequired: 'Pay on collection',
      customer: orderResult.customer ? {
        id: orderResult.customer.Id,
        name: `${orderResult.customer.FirstName} ${orderResult.customer.LastName}`,
        email: orderResult.customer.Email,
        phone: orderResult.customer.PhoneNumber
      } : undefined,
    });

  } catch (error) {
    console.error('Order creation failed:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to create order', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const orderStatus = await enhancedEposAPI.getOrderStatus(parseInt(orderId));

    return NextResponse.json({
      success: true,
      status: orderStatus.status,
      estimatedReadyTime: orderStatus.estimatedReadyTime?.toISOString(),
      transaction: orderStatus.transaction,
      items: orderStatus.items,
    });

  } catch (error) {
    console.error('Failed to get order status:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to get order status', 
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}