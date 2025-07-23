import Layout from "@/components/Layouts/Layout";
import { Link } from "react-router";

export default function Cancel() {
    return (
        <Layout>
            <div className="p-10">
                <h1 className="text-red-600 text-2xl font-bold">❌ Payment Cancelled</h1>
                <p>You can try again anytime.</p>
                <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">
                    Go to Home
                </Link>
            </div>
        </Layout>
    );
}
