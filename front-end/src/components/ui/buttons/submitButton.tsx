"use client";

import { Loader2 } from "lucide-react";
//TODO: Update React types when available
//@ts-expect-error
import { useFormState, useFormStatus } from "react-dom";

import { Button } from "./button";

interface Props {
  children?: React.ReactNode;
  className?: string;
  variant?: "destructive" | "outline" | "ghost" | "default" | "secondary";
}

export function SubmitButton({ children, className, variant }: Props) {
  const { pending } = useFormStatus();
  return (
    <Button
      variant={variant || "default"}
      className={className || ""}
      type="submit"
      disabled={pending}
    >
      {pending ? (
        <Loader2 className="animate-spin h-2 w-2" />
      ) : children ? (
        children
      ) : (
        "Submit"
      )}
    </Button>
  );
}
