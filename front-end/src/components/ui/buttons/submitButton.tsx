'use client';
import { Button } from './button';
//TODO: Update React types when available
//@ts-expect-error
import { useFormStatus } from 'react-dom';
import { Loader2 } from 'lucide-react';

export function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? <Loader2 className="animate-spin w-2 h-2" /> : 'Submit'}
    </Button>
  );
}
