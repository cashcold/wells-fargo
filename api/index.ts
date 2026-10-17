import { app } from '../lib/app.ts';

export default function handler(req: any, res: any) {
  return app(req, res);
}
