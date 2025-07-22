import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "@/components/CheckoutForm";
import Layout from "@/components/Layouts/Layout";

// Public Key (from Stripe dashboard)
const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY || "");

function App() {
    return (
        <Layout>
            <Elements stripe={stripePromise}>
                <div className="App">
                    <h2>Stripe Payment Example</h2>
                    <CheckoutForm />
                </div>
            </Elements>
        </Layout>
    )
}

export default App;
