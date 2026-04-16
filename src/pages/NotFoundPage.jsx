import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { Button } from '@/components/common/Button';
import { Card } from '@/components/common/Card';
import './NotFoundPage.css';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="grid min-h-screen place-items-center bg-sand px-4">
      <Card className="max-w-xl text-center">
        <div className="mx-auto mb-5 grid h-16 w-16 place-items-center rounded-3xl bg-orange-100 text-coral">
          <Compass className="h-8 w-8" />
        </div>
        <h1 className="font-display text-4xl font-semibold text-ink">Page not found</h1>
        <p className="mt-4 text-sm leading-7 text-slate-500">
          The route you requested does not exist in this workspace. Head back and continue exploring DokoXpress.
        </p>
        <div className="mt-6 flex justify-center">
          <Button onClick={() => navigate('/')} type="button" variant="secondary">
            Return home
          </Button>
        </div>
      </Card>
    </div>
  );
}
