import React, { useState } from "react";
import type { FormEvent } from "react";
import {
    CardElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import type { StripeCardElement } from "@stripe/stripe-js";
import api from "@/utils/axios";

const CheckoutForm: React.FC = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        try {
            const { data } = await api.post("/payment/create-payment-intent", { amount: 1000 });

            const clientSecret = data.clientSecret;

            const cardElement = elements.getElement(CardElement);
            if (!cardElement) {
                setMessage("Card element not found.");
                setLoading(false);
                return;
            }

            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: cardElement as StripeCardElement,
                },
            });

            if (result.error) {
                setMessage(result.error.message || "Payment failed.");
            } else if (result.paymentIntent?.status === "succeeded") {
                setMessage("Payment successful!");
            }
        } catch (err: any) {
            setMessage("Something went wrong. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement />
            <button type="submit" disabled={!stripe || loading}>
                {loading ? "Processing..." : "Pay $10"}
            </button>
            <p>{message}</p>
        </form>
    );
};

export default CheckoutForm;
