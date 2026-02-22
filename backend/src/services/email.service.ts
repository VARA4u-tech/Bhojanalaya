import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
    text?: string;
}

class EmailService {
    private transporter: Transporter;

    constructor() {
        // Create SMTP transporter
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || 'smtp.gmail.com',
            port: parseInt(process.env.SMTP_PORT || '587'),
            secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        // Verify connection configuration
        this.verifyConnection();
    }

    private async verifyConnection() {
        try {
            await this.transporter.verify();
            console.log('✅ SMTP Server is ready to send emails');
        } catch (error) {
            console.error('❌ SMTP Server connection failed:', error);
        }
    }

    async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            const mailOptions = {
                from: `"${process.env.SMTP_FROM_NAME || 'Bhojanālaya'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
                to: options.to,
                subject: options.subject,
                html: options.html,
                text: options.text || '',
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log('✅ Email sent successfully:', info.messageId);
            return true;
        } catch (error) {
            console.error('❌ Email sending failed:', error);
            return false;
        }
    }

    // Order Confirmation Email
    async sendOrderConfirmation(data: {
        email: string;
        name: string;
        orderNumber: string;
        items: Array<{ name: string; quantity: number; price: number }>;
        total: number;
        tableNumber: string;
        restaurantName?: string;
    }): Promise<boolean> {
        const itemsHtml = data.items
            .map(
                (item) => `
            <tr>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">${item.name}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">×${item.quantity}</td>
                <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">₹${(item.price * item.quantity).toFixed(2)}</td>
            </tr>
        `
            )
            .join('');

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">🎉 Order Confirmed!</h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Thank you for your order, ${data.name}</p>
                        </td>
                    </tr>
                    
                    <!-- Order Details -->
                    <tr>
                        <td style="padding: 30px;">
                            <div style="background-color: #f0fdfa; border-left: 4px solid #0d9488; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</p>
                                <p style="margin: 0; color: #111827; font-size: 24px; font-weight: 700;">${data.orderNumber}</p>
                            </div>
                            
                            <div style="display: flex; gap: 20px; margin-bottom: 30px;">
                                <div style="flex: 1; background-color: #f9fafb; padding: 15px; border-radius: 8px;">
                                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px;">Table Number</p>
                                    <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${data.tableNumber}</p>
                                </div>
                                ${data.restaurantName ? `
                                <div style="flex: 1; background-color: #f9fafb; padding: 15px; border-radius: 8px;">
                                    <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px;">Restaurant</p>
                                    <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">${data.restaurantName}</p>
                                </div>
                                ` : ''}
                            </div>
                            
                            <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 20px; font-weight: 600;">Order Items</h2>
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                                <thead>
                                    <tr style="background-color: #f9fafb;">
                                        <th style="padding: 12px; text-align: left; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Item</th>
                                        <th style="padding: 12px; text-align: center; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                                        <th style="padding: 12px; text-align: right; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${itemsHtml}
                                    <tr style="background-color: #f0fdfa;">
                                        <td colspan="2" style="padding: 16px; font-weight: 700; color: #111827; font-size: 16px;">Total</td>
                                        <td style="padding: 16px; text-align: right; font-weight: 700; color: #0d9488; font-size: 20px;">₹${data.total.toFixed(2)}</td>
                                    </tr>
                                </tbody>
                            </table>
                            
                            <div style="margin-top: 30px; padding: 20px; background-color: #fffbeb; border-radius: 8px; border: 1px solid #fbbf24;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                    <strong>⏱️ Estimated Preparation Time:</strong> 20-30 minutes<br>
                                    We'll notify you when your order is ready!
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Need help? Contact us at support@bhojanālaya.com</p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2026 Bhojanālaya. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        return this.sendEmail({
            to: data.email,
            subject: `Order Confirmed - ${data.orderNumber} | Bhojanālaya`,
            html,
        });
    }

    // Booking Confirmation Email
    async sendBookingConfirmation(data: {
        email: string;
        name: string;
        restaurantName: string;
        date: string;
        time: string;
        guests: number;
        tableNumber: string;
    }): Promise<boolean> {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">✅ Table Reserved!</h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">Your reservation is confirmed</p>
                        </td>
                    </tr>
                    
                    <!-- Booking Details -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 30px 0; color: #111827; font-size: 16px; line-height: 1.6;">
                                Dear <strong>${data.name}</strong>,<br><br>
                                Your table reservation at <strong>${data.restaurantName}</strong> has been confirmed!
                            </p>
                            
                            <div style="background: linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%); border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 15px 0;">
                                            <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">📅 Date</p>
                                            <p style="margin: 0; color: #111827; font-size: 20px; font-weight: 600;">${data.date}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 15px 0; border-top: 1px solid #99f6e4;">
                                            <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">🕐 Time</p>
                                            <p style="margin: 0; color: #111827; font-size: 20px; font-weight: 600;">${data.time}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 15px 0; border-top: 1px solid #99f6e4;">
                                            <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">👥 Guests</p>
                                            <p style="margin: 0; color: #111827; font-size: 20px; font-weight: 600;">${data.guests} ${data.guests === 1 ? 'Person' : 'People'}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 15px 0; border-top: 1px solid #99f6e4;">
                                            <p style="margin: 0 0 5px 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">🪑 Table</p>
                                            <p style="margin: 0; color: #111827; font-size: 20px; font-weight: 600;">Table ${data.tableNumber}</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background-color: #fffbeb; border-left: 4px solid #f59e0b; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.6;">
                                    <strong>⚠️ Important:</strong> Please arrive 10 minutes before your reservation time. Your table will be held for 15 minutes after the reservation time.
                                </p>
                            </div>
                            
                            <div style="text-align: center;">
                                <a href="http://localhost:5173/booking" style="display: inline-block; background-color: #0d9488; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">View My Reservations</a>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Need to modify your reservation? Contact us at support@bhojanālaya.com</p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2026 Bhojanālaya. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        return this.sendEmail({
            to: data.email,
            subject: `Table Reserved at ${data.restaurantName} | Bhojanālaya`,
            html,
        });
    }

    // Order Cancellation Email with Refund
    async sendOrderCancellation(data: {
        email: string;
        name: string;
        orderNumber: string;
        total: number;
        refundAmount: number;
    }): Promise<boolean> {
        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Cancelled</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">Order Cancelled</h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">We've processed your cancellation</p>
                        </td>
                    </tr>
                    
                    <!-- Cancellation Details -->
                    <tr>
                        <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 30px 0; color: #111827; font-size: 16px; line-height: 1.6;">
                                Dear <strong>${data.name}</strong>,<br><br>
                                Your order <strong>${data.orderNumber}</strong> has been cancelled as requested.
                            </p>
                            
                            <div style="background-color: #fef2f2; border-left: 4px solid #dc2626; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
                                <table width="100%" cellpadding="0" cellspacing="0">
                                    <tr>
                                        <td style="padding: 10px 0;">
                                            <p style="margin: 0; color: #6b7280; font-size: 14px;">Order Total</p>
                                            <p style="margin: 5px 0 0 0; color: #111827; font-size: 20px; font-weight: 600;">₹${data.total.toFixed(2)}</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 10px 0; border-top: 1px solid #fecaca;">
                                            <p style="margin: 0; color: #6b7280; font-size: 14px;">Refund Amount (50%)</p>
                                            <p style="margin: 5px 0 0 0; color: #0d9488; font-size: 24px; font-weight: 700;">₹${data.refundAmount.toFixed(2)}</p>
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background-color: #f0fdfa; border: 1px solid #5eead4; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                                <p style="margin: 0; color: #115e59; font-size: 14px; line-height: 1.6;">
                                    <strong>💰 Refund Processing:</strong><br>
                                    Your refund of ₹${data.refundAmount.toFixed(2)} will be processed within <strong>3-5 business days</strong> to your original payment method.
                                </p>
                            </div>
                            
                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                We're sorry to see you cancel your order. If there was an issue, please let us know so we can improve our service.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Questions about your refund? Contact us at support@bhojanālaya.com</p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2026 Bhojanālaya. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        return this.sendEmail({
            to: data.email,
            subject: `Order Cancelled - Refund Processing | Bhojanālaya`,
            html,
        });
    }

    // Order Status Update Email
    async sendOrderStatusUpdate(data: {
        email: string;
        name: string;
        orderNumber: string;
        status: string;
        statusMessage: string;
    }): Promise<boolean> {
        const statusColors: Record<string, string> = {
            confirmed: '#3b82f6',
            preparing: '#f59e0b',
            ready: '#10b981',
            completed: '#0d9488',
        };

        const statusEmojis: Record<string, string> = {
            confirmed: '✅',
            preparing: '👨‍🍳',
            ready: '🔔',
            completed: '🎉',
        };

        const color = statusColors[data.status] || '#6b7280';
        const emoji = statusEmojis[data.status] || '📦';

        const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Status Update</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%); padding: 40px 30px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 700;">${emoji} Order Update</h1>
                            <p style="margin: 10px 0 0 0; color: #ffffff; font-size: 16px; opacity: 0.9;">${data.statusMessage}</p>
                        </td>
                    </tr>
                    
                    <!-- Status Details -->
                    <tr>
                        <td style="padding: 40px 30px; text-align: center;">
                            <p style="margin: 0 0 20px 0; color: #111827; font-size: 16px;">
                                Hi <strong>${data.name}</strong>,
                            </p>
                            
                            <div style="background-color: #f9fafb; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
                                <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Order Number</p>
                                <p style="margin: 0; color: #111827; font-size: 24px; font-weight: 700;">${data.orderNumber}</p>
                            </div>
                            
                            <div style="text-align: center;">
                                <a href="http://localhost:5173/orders" style="display: inline-block; background-color: ${color}; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 16px;">Track Order</a>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="background-color: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">Questions? Contact us at support@bhojanālaya.com</p>
                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">© 2026 Bhojanālaya. All rights reserved.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
        `;

        return this.sendEmail({
            to: data.email,
            subject: `Order ${data.status.charAt(0).toUpperCase() + data.status.slice(1)} - ${data.orderNumber} | Bhojanālaya`,
            html,
        });
    }
}

export const emailService = new EmailService();
