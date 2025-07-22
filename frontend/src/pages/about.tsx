import { Link } from "react-router";
import Layout from "@/components/Layouts/Layout";

const About = () => {
  return (
    <Layout>
      <div>
        <h1>Welcome to the About Page</h1>
        <p>This is the about page of our application.</p>
        <Link to="/" className="text-indigo-600 hover:text-indigo-800">
          Go back to Home
        </Link>
      </div>
    </Layout>

  );
}
export default About;