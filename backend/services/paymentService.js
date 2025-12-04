const Razorpay = require('razorpay');
const crypto = require('crypto');

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'test_key_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'test_key_secret'
});

/**
 * Create Razorpay order
 * @param {Number} amount - Amount in INR
 * @param {String} orderId - Internal order ID
 * @param {Object} customerInfo - Customer details
 * @returns {Object} Razorpay order
 */
const createRazorpayOrder = async (amount, orderId, customerInfo) => {
  try {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency: 'INR',
      receipt: orderId.toString(),
      notes: {
        orderId: orderId.toString(),
        customerName: customerInfo.name,
        customerEmail: customerInfo.email
      }
    };

    const order = await razorpay.orders.create(options);
    return {
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key_id: process.env.RAZORPAY_KEY_ID
    };
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Verify Razorpay payment signature
 * @param {String} razorpayOrderId 
 * @param {String} razorpayPaymentId 
 * @param {String} razorpaySignature 
 * @returns {Boolean} Verification status
 */
const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  try {
    const text = `${razorpayOrderId}|${razorpayPaymentId}`;
    const secret = process.env.RAZORPAY_KEY_SECRET || 'test_key_secret';
    
    const generatedSignature = crypto
      .createHmac('sha256', secret)
      .update(text)
      .digest('hex');

    return generatedSignature === razorpaySignature;
  } catch (error) {
    console.error('Payment verification error:', error);
    return false;
  }
};

/**
 * Get payment details
 * @param {String} paymentId - Razorpay payment ID
 * @returns {Object} Payment details
 */
const getPaymentDetails = async (paymentId) => {
  try {
    const payment = await razorpay.payments.fetch(paymentId);
    return {
      success: true,
      payment: {
        id: payment.id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: payment.status,
        method: payment.method,
        email: payment.email,
        contact: payment.contact,
        createdAt: new Date(payment.created_at * 1000)
      }
    };
  } catch (error) {
    console.error('Payment fetch error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Initiate refund
 * @param {String} paymentId - Razorpay payment ID
 * @param {Number} amount - Refund amount (optional, full refund if not provided)
 * @returns {Object} Refund details
 */
const initiateRefund = async (paymentId, amount = null) => {
  try {
    const options = {};
    if (amount) {
      options.amount = amount * 100; // Convert to paise
    }

    const refund = await razorpay.payments.refund(paymentId, options);
    return {
      success: true,
      refund: {
        id: refund.id,
        paymentId: refund.payment_id,
        amount: refund.amount / 100,
        status: refund.status,
        createdAt: new Date(refund.created_at * 1000)
      }
    };
  } catch (error) {
    console.error('Refund error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Create payment link (for COD alternative or pay later)
 * @param {Number} amount 
 * @param {Object} customerInfo 
 * @param {String} orderId 
 * @returns {Object} Payment link
 */
const createPaymentLink = async (amount, customerInfo, orderId) => {
  try {
    const options = {
      amount: amount * 100,
      currency: 'INR',
      description: `Payment for Order #${orderId}`,
      customer: {
        name: customerInfo.name,
        email: customerInfo.email,
        contact: customerInfo.phone
      },
      notify: {
        sms: true,
        email: true
      },
      reminder_enable: true,
      notes: {
        orderId: orderId.toString()
      },
      callback_url: `${process.env.FRONTEND_URL}/payment/callback`,
      callback_method: 'get'
    };

    const paymentLink = await razorpay.paymentLink.create(options);
    return {
      success: true,
      link: paymentLink.short_url,
      linkId: paymentLink.id
    };
  } catch (error) {
    console.error('Payment link creation error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};

/**
 * Mock payment for development/testing
 * @param {Number} amount 
 * @param {String} orderId 
 * @returns {Object} Mock payment response
 */
const mockPayment = (amount, orderId) => {
  return {
    success: true,
    orderId: `test_order_${Date.now()}`,
    paymentId: `test_payment_${Date.now()}`,
    amount: amount,
    currency: 'INR',
    status: 'captured',
    method: 'card',
    mock: true
  };
};

module.exports = {
  createRazorpayOrder,
  verifyPaymentSignature,
  getPaymentDetails,
  initiateRefund,
  createPaymentLink,
  mockPayment,
  razorpay
};
