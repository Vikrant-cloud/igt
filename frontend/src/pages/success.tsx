import Layout from "@/components/Layouts/Layout";
import { Link } from "react-router";

export default function Success() {
    return (
        <Layout>
            <div className="p-10">
                <h1 className="text-green-600 text-2xl font-bold">✅ Payment Successful!</h1>
                <p>Thank you for subscribing.</p>
                <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
                    Go to Home
                </Link>
            </div>
        </Layout>
    );
}