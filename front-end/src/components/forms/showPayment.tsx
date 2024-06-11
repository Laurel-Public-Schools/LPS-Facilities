"use client";

import React, { useState } from "react";
import { Loader2 } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import PiP from "@/functions/mutations/pip";
import { Button } from "../ui/buttons";

interface feeProps {
  id: number;
  fees: any;
  description: string;
  email: string;
}

export default function ShowPayment({
  id,
  fees,
  description,
  email,
}: feeProps) {
  const { toast } = useToast();
  const [loading, isLoading] = useState(false);

  const PayOnline = async (
    id: number,
    fees: any,
    description: string,
    email: string,
  ) => {
    isLoading(true);
    const res = await fetch(process.env.NEXT_PUBLIC_HOST + "/api/payments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        description: description,
        fees: fees,
        email: email,
      }),
    });
    const response = await res.json();
    if (response.status != 200) {
      isLoading(false);
      return toast({
        title: "Error occurred: ",
        description: response.message,
      });
    } else {
      isLoading(false);
      return toast({
        title: "Success",
        description: "A payment link has been sent to your email address",
      });
    }
  };

  const PayinPerson = async (id: number) => {
    isLoading(true);
    const res = await PiP(id);
    const response = await res.json();
    if (response.status != 200) {
      isLoading(false);
      return toast({
        title: "Error occurred: ",
        description: response.message,
      });
    } else {
      isLoading(false);
      return toast({
        title: "Success",
        description: "You have selected to pay in person.",
      });
    }
  };
  return (
    <div className="block gap-x-2 p-2">
      {!loading && (
        <>
          <Button
            variant="outline"
            onClick={() => {
              void PayinPerson(id);
            }}
          >
            Pay in Person
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              void PayOnline(id, fees, description, email);
            }}
          >
            Pay Online
          </Button>
        </>
      )}
      {loading && (
        <Button disabled>
          <Loader2 className="animate-spin mr-2 h-4 w-4" />
          Please wait
        </Button>
      )}
    </div>
  );
}
