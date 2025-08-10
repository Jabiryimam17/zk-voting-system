import React, { useEffect } from "react";
import Layout from "../components/Layout";
import RegisterForm from "./PartyForm.jsx";
import "semantic-ui-css/semantic.min.css";

export default () => {
  useEffect(() => {
    const log_out = async () => {
      const response = await fetch("/api/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    };
  });
  return (
    <Layout title={"PARTY REGISTRATION"} authenticated={true}>
      <RegisterForm />
    </Layout>
  );
};
