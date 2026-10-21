export default function handler(req: any, res: any) {
  res.status(200).json({
    status: 'ok',
    mode: 'serverless',
    provider: 'Vercel Serverless Functions',
    service: 'Wells Fargo Serverless Banking API',
    timestamp: new Date().toISOString(),
  });
}
