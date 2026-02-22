# Email Notification System - Setup Guide

## ✅ Implementation Complete

A complete email notification system has been set up for your Bitebook Direct project with beautiful HTML email templates.

---

## 📧 Email Templates Created

### **1. Order Confirmation Email** 🎉
Sent when a user places an order.

**Includes:**
- Order number
- Table number
- Restaurant name
- Itemized list with quantities and prices
- Total amount
- Estimated preparation time (20-30 mins)
- Professional gradient header
- Responsive design

**Trigger:** After successful checkout

---

### **2. Booking Confirmation Email** ✅
Sent when a user books a table.

**Includes:**
- Restaurant name
- Date and time
- Number of guests
- Table number
- Important arrival instructions
- "View My Reservations" button
- Beautiful gradient card design

**Trigger:** After successful table booking

---

### **3. Order Cancellation Email** ❌
Sent when a user cancels an order.

**Includes:**
- Order number
- Original order total
- **50% refund amount** (highlighted)
- Refund processing timeline (3-5 business days)
- Payment method information
- Support contact details

**Trigger:** When order is cancelled

---

### **4. Order Status Update Email** 📦
Sent when order status changes.

**Includes:**
- Order number
- Current status (Confirmed/Preparing/Ready/Completed)
- Status-specific emoji and color
- "Track Order" button
- Dynamic messaging based on status

**Trigger:** When order status changes

---

## 🔧 Files Created

### **1. Email Service** (`backend/src/services/email.service.ts`)
Complete email service with:
- SMTP configuration
- Connection verification
- 4 email template methods
- Error handling
- Logging

### **2. Environment Variables**
Updated files:
- `backend/.env` - Added SMTP configuration
- `backend/.env.example` - Added SMTP template

---

## ⚙️ SMTP Configuration

### **Environment Variables Added:**
```bash
# SMTP Email Configuration
SMTP_HOST=smtp.gmail.com          # SMTP server host
SMTP_PORT=587                     # SMTP port (587 for TLS)
SMTP_SECURE=false                 # false for port 587, true for 465
SMTP_USER=your-email@gmail.com    # Your email address
SMTP_PASSWORD=your-app-password   # App-specific password
SMTP_FROM_NAME=Bhojanālaya        # Sender name
SMTP_FROM_EMAIL=noreply@bhojanālaya.com  # Sender email
```

---

## 📝 Setup Instructions

### **Step 1: Configure Gmail SMTP (Recommended)**

1. **Enable 2-Factor Authentication:**
   - Go to Google Account → Security
   - Enable 2-Step Verification

2. **Generate App Password:**
   - Go to Google Account → Security → 2-Step Verification
   - Scroll to "App passwords"
   - Select "Mail" and "Windows Computer"
   - Click "Generate"
   - Copy the 16-character password

3. **Update .env file:**
   ```bash
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_SECURE=false
   SMTP_USER=your-actual-email@gmail.com
   SMTP_PASSWORD=your-16-char-app-password
   SMTP_FROM_NAME=Bhojanālaya
   SMTP_FROM_EMAIL=your-actual-email@gmail.com
   ```

### **Step 2: Alternative SMTP Providers**

#### **SendGrid**
```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=your-sendgrid-api-key
```

#### **Mailgun**
```bash
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
```

#### **AWS SES**
```bash
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-ses-smtp-username
SMTP_PASSWORD=your-ses-smtp-password
```

---

## 🚀 How to Use

### **1. Import the Email Service**
```typescript
import { emailService } from '../services/email.service';
```

### **2. Send Order Confirmation**
```typescript
await emailService.sendOrderConfirmation({
    email: 'customer@example.com',
    name: 'John Doe',
    orderNumber: 'ORD-2024-001',
    items: [
        { name: 'Biryani', quantity: 2, price: 350 },
        { name: 'Raita', quantity: 1, price: 50 }
    ],
    total: 750,
    tableNumber: 'T-12',
    restaurantName: 'Southern Spice'
});
```

### **3. Send Booking Confirmation**
```typescript
await emailService.sendBookingConfirmation({
    email: 'customer@example.com',
    name: 'John Doe',
    restaurantName: 'Babai Hotel',
    date: '23 Jan 2026',
    time: '7:00 PM',
    guests: 4,
    tableNumber: 'T-5'
});
```

### **4. Send Order Cancellation**
```typescript
await emailService.sendOrderCancellation({
    email: 'customer@example.com',
    name: 'John Doe',
    orderNumber: 'ORD-2024-001',
    total: 750,
    refundAmount: 375  // 50% refund
});
```

### **5. Send Status Update**
```typescript
await emailService.sendOrderStatusUpdate({
    email: 'customer@example.com',
    name: 'John Doe',
    orderNumber: 'ORD-2024-001',
    status: 'preparing',
    statusMessage: 'Your order is being prepared'
});
```

---

## 🎨 Email Design Features

### **Professional Design:**
- ✅ Responsive HTML emails (works on all devices)
- ✅ Beautiful gradient headers
- ✅ Clean typography with Inter font
- ✅ Color-coded status indicators
- ✅ Mobile-optimized layout
- ✅ Branded footer with support info

### **Color Scheme:**
- **Primary:** Teal gradient (#0d9488 → #0f766e)
- **Success:** Green (#10b981)
- **Warning:** Amber (#f59e0b)
- **Error:** Red (#dc2626)
- **Info:** Blue (#3b82f6)

### **Email Dimensions:**
- **Width:** 600px (standard email width)
- **Mobile:** Fully responsive
- **Font:** Inter, system fonts fallback

---

## 🧪 Testing

### **Test Email Sending:**
Create a test route in your backend:

```typescript
// backend/src/routes/test.routes.ts
import { Router } from 'express';
import { emailService } from '../services/email.service';

const router = Router();

router.post('/test-email', async (req, res) => {
    try {
        const success = await emailService.sendOrderConfirmation({
            email: 'your-test-email@gmail.com',
            name: 'Test User',
            orderNumber: 'TEST-001',
            items: [
                { name: 'Test Item', quantity: 1, price: 100 }
            ],
            total: 100,
            tableNumber: 'T-1',
            restaurantName: 'Test Restaurant'
        });

        res.json({ success, message: 'Test email sent!' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to send email' });
    }
});

export default router;
```

---

## 🔍 Troubleshooting

### **Issue 1: "Invalid login" error**
**Solution:**
- Make sure 2FA is enabled on Gmail
- Use App Password, not regular password
- Check SMTP_USER is correct email address

### **Issue 2: "Connection timeout"**
**Solution:**
- Check SMTP_HOST and SMTP_PORT are correct
- Verify firewall isn't blocking port 587
- Try port 465 with SMTP_SECURE=true

### **Issue 3: Emails going to spam**
**Solution:**
- Use a verified domain email
- Add SPF and DKIM records to your domain
- Use a professional email service (SendGrid, Mailgun)
- Avoid spam trigger words in subject/content

### **Issue 4: "Authentication failed"**
**Solution:**
- Regenerate App Password
- Check for extra spaces in .env file
- Verify SMTP_USER matches the email that generated the password

---

## 📊 Email Delivery Status

The email service logs all attempts:

```
✅ SMTP Server is ready to send emails
✅ Email sent successfully: <message-id>
❌ Email sending failed: <error>
```

Check your backend console for these messages.

---

## 🔒 Security Best Practices

1. **Never commit .env file** - Already in .gitignore
2. **Use App Passwords** - Not your main Gmail password
3. **Rotate passwords regularly** - Change every 3-6 months
4. **Use environment variables** - Never hardcode credentials
5. **Enable rate limiting** - Prevent email spam
6. **Validate email addresses** - Before sending

---

## 📦 Dependencies Installed

```json
{
  "nodemailer": "^6.9.x",
  "@types/nodemailer": "^6.4.x"
}
```

---

## 🎯 Integration Points

### **Where to Add Email Triggers:**

1. **Order Confirmation** → After `createOrder()` in CheckoutPage
2. **Booking Confirmation** → After `addBooking()` in BookingPage
3. **Order Cancellation** → After `cancelOrder()` in OrderStatusPage
4. **Status Updates** → In Socket.io event handlers or order update endpoints

---

## 📧 Example Integration

### **In CheckoutPage.tsx:**
```typescript
const handlePlaceOrder = async () => {
    // ... existing code ...
    
    const newOrder = createOrder(orderItems, tableNumber, specialNotes);
    
    // Send confirmation email
    try {
        await fetch('http://localhost:3000/api/email/order-confirmation', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: user.email,
                name: user.name,
                orderNumber: newOrder.orderNumber,
                items: newOrder.items,
                total: grandTotal,
                tableNumber,
                restaurantName: selectedRestaurant?.name
            })
        });
    } catch (error) {
        console.error('Failed to send confirmation email:', error);
        // Don't block order if email fails
    }
    
    // ... rest of code ...
};
```

---

## ✅ Summary

**What's Ready:**
- ✅ Email service with 4 professional templates
- ✅ SMTP configuration
- ✅ Beautiful responsive HTML emails
- ✅ Error handling and logging
- ✅ nodemailer package installed
- ✅ Environment variables configured

**Next Steps:**
1. Update SMTP credentials in `.env`
2. Test email sending
3. Integrate email triggers in your app
4. Monitor email delivery

**Status:** 🎉 **READY TO USE!**

Just update your SMTP credentials and start sending beautiful emails!
