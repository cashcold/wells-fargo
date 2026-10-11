import { GoogleGenAI } from '@google/genai';

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, userContext } = req.body || {};
  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `You are Fargo, Wells Fargo's AI banking assistant.
The customer's name is ${userContext?.name || 'Customer'}.
Available accounts:
- Everyday Checking (..0987, balance: $${userContext?.checkingBalance || '4,289.40'})
- Way2Save Savings (..3478, balance: $${userContext?.savingsBalance || '18,450.00'})
- Active Cash Credit (..8821)
- Wells Fargo Auto & Personal Loan (..5821)

Bank Details:
- Routing number: 061000227
- Loan ranges: Minimum loan starts from $700.00 USD up to $100,000,000.00 USD (100 Million)
- Mobile check deposit: Available 24/7 with a $5,000.00 daily limit and $15,000.00 30-day limit
- Set Aside: Reserves money for upcoming bills

Provide a clear, helpful, professional, and friendly response (under 3 sentences).
User message: "${message}"`;

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Gemini timeout')), 10000)
      );

      const geminiPromise = ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      });

      const response: any = await Promise.race([geminiPromise, timeoutPromise]);

      const replyText = response.text || "I'm Fargo, your Wells Fargo virtual assistant. How can I help you today?";

      return res.status(200).json({
        reply: replyText,
        source: 'gemini-serverless',
      });
    } catch (err: any) {
      console.warn('Gemini serverless execution fallback:', err?.message);
    }
  }

  // Smart financial rule fallback
  const lower = message.toLowerCase();
  let reply = `Hello ${userContext?.name || 'there'}! I'm Fargo, your Wells Fargo virtual assistant.`;
  let action: any = undefined;

  if (lower.includes('routing') || lower.includes('account number')) {
    reply = `Your Wells Fargo routing number is 061000227. Your Everyday Checking ends in 0987 and Way2Save ends in 3478.`;
    action = { label: 'View Accounts', tab: 'accounts' };
  } else if (lower.includes('loan') || lower.includes('borrow') || lower.includes('credit line') || lower.includes('limit')) {
    reply = `You can configure your Wells Fargo loan starting from $700.00 USD up to our highest allowable facility of $100,000,000.00 USD (100 Million) with instant Truth-in-Lending PDF generation.`;
    action = { label: 'Configure Loans', tab: 'loans' };
  } else if (lower.includes('deposit') || lower.includes('check')) {
    reply = `You can deposit paper checks in seconds using Wells Fargo Mobile Deposit! Your daily limit is $5,000.00 and 30-day limit is $15,000.00.`;
    action = { label: 'Deposit Checks', tab: 'deposit' };
  } else if (lower.includes('bill') || lower.includes('set aside') || lower.includes('save')) {
    reply = `With Set Aside, we automatically reserve funds in your account for upcoming bills so you never accidentally spend what is owed!`;
    action = { label: 'View Set Aside', tab: 'setaside' };
  } else if (lower.includes('balance') || lower.includes('how much')) {
    reply = `Your total available balance across accounts is $${userContext?.totalBalance || '22,739.40'}. Everyday Checking has $${userContext?.checkingBalance || '4,289.40'}.`;
    action = { label: 'View Balances', tab: 'accounts' };
  } else {
    reply = `I can help you review balances, transfer funds, manage Set Aside bill goals, configure loans (from $700 up to $100M), or locate routing number 061000227. What would you like to explore?`;
  }

  return res.status(200).json({
    reply,
    action,
    source: 'serverless-rules',
  });
}
