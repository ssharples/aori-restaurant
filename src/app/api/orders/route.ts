import { NextRequest, NextResponse } from 'next/server';
import { eposAPI } from '@/lib/epos-api';
import { CartItem, CustomerDetails } from '@/types/menu';

interface CreateOrderRequestBody {
  items: CartItem[];
  customerDetails: CustomerDetails;
  collectionTime: string;
  paymentMethod: 'online' | 'at-restaurant';
  notes?: string;
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

    // Create order in EPOS Now
    const orderResult = await eposAPI.createOrder({
      customerName: body.customerDetails.name,
      customerPhone: body.customerDetails.phone,
      customerEmail: body.customerDetails.email,
      items: eposItems,
      totalAmount,
      collectionTime: new Date(body.collectionTime),
      paymentMethod: body.paymentMethod,
      notes: body.notes,
    });

    // Return order confirmation
    return NextResponse.json({
      success: true,
      orderId: orderResult.transactionId,
      estimatedReadyTime: orderResult.estimatedReadyTime.toISOString(),
      totalAmount,
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

    const orderStatus = await eposAPI.getOrderStatus(parseInt(orderId));

    return NextResponse.json({
      success: true,
      status: orderStatus.status,
      estimatedReadyTime: orderStatus.estimatedReadyTime?.toISOString(),
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