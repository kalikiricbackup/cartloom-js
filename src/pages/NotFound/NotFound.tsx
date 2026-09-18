import React from "react";
import { Link } from "react-router-dom";
import PageContainer from "../../components/PageContainer/PageContainer";

function NotFound() {
  return (
    <>
      <PageContainer>
        <div>
          <h2>Page Not Found</h2>

          <p>Sorry, the page you are looking for does not exist.</p>

          <Link to="/">Go back to Home</Link>
        </div>
      </PageContainer>
    </>
  );
}

export default NotFound;
