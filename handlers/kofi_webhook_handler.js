import { log } from '../utils/logger.js';

/**
 * Handle Ko-fi webhook notifications
 * Updates donation totals and recent donors list
 * 
 * Ko-fi sends POST requests with form data:
 * data: JSON string containing donation info
 */
export async function handleKofiWebhook(request, config, env) {
    try {
        // Verify it's a POST request
        if (request.method !== 'POST') {
            return new Response('Method not allowed', { status: 405 });
        }

        // Parse form data
        const formData = await request.formData();
        const dataString = formData.get('data');

        if (!dataString) {
            log(config, 'warn', 'Ko-fi webhook: No data field');
            return new Response('No data', { status: 400 });
        }

        // Parse Ko-fi data
        const kofiData = JSON.parse(dataString);

        log(config, 'info', 'Ko-fi webhook received', {
            type: kofiData.type,
            amount: kofiData.amount,
            from: kofiData.from_name?.substring(0, 20)
        });

        // Only process donations (not subscriptions)
        if (kofiData.type !== 'Donation') {
            log(config, 'info', 'Skipping non-donation event', {
                type: kofiData.type
            });
            return new Response('OK', { status: 200 });
        }

        // Extract donation info
        // Ko-fi sends amount as string, sometimes with currency symbol
        let amountStr = kofiData.amount || '0';
        // Remove currency symbols and parse
        amountStr = amountStr.toString().replace(/[€$£,]/g, '').trim();
        
        const donation = {
            name: kofiData.from_name || 'Anonymous',
            amount: parseFloat(amountStr) || 0,
            currency: kofiData.currency || 'EUR',
            message: kofiData.message || '',
            date: new Date().toISOString(),
            timestamp: Date.now()
        };

        log(config, 'info', 'Processing donation', {
            name: donation.name.substring(0, 20),
            rawAmount: kofiData.amount,
            parsedAmount: donation.amount,
            currency: donation.currency
        });

        // Convert to EUR if needed (Ko-fi sends in original currency)
        if (donation.currency !== 'EUR') {
            log(config, 'warn', 'Non-EUR donation received', {
                currency: donation.currency,
                amount: donation.amount
            });
            // Simple conversion rates (update these or use an API)
            const rates = {
                'USD': 0.92,
                'GBP': 1.17,
                'EUR': 1.0
            };
            donation.amount = donation.amount * (rates[donation.currency] || 1);
        }

        // Update donations in KV
        if (env.DONATIONS_KV) {
            // Get current data
            let donationsData = {
                total: 0,
                goal: 99,
                donations: []
            };

            const stored = await env.DONATIONS_KV.get('donations', 'json');
            if (stored) {
                donationsData = stored;
            }

            // Add new donation
            // Use precise addition to avoid floating point errors
            donationsData.total = parseFloat((donationsData.total + donation.amount).toFixed(2));
            donationsData.donations.unshift({
                name: donation.name,
                amount: donation.amount.toFixed(2),
                date: donation.date
            });

            // Keep only last 20 donations
            donationsData.donations = donationsData.donations.slice(0, 20);

            // Save back to KV
            await env.DONATIONS_KV.put('donations', JSON.stringify(donationsData));

            log(config, 'info', 'Donation saved', {
                newTotal: donationsData.total.toFixed(2),
                donationsCount: donationsData.donations.length,
                allDonations: donationsData.donations.map(d => `${d.name}: ${d.amount}`)
            });
        }

        return new Response('OK', { status: 200 });

    } catch (error) {
        log(config, 'error', 'Ko-fi webhook error', {
            error: error.message,
            stack: error.stack?.substring(0, 200)
        });

        return new Response('Internal error', { status: 500 });
    }
}
