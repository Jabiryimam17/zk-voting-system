import React from "react";
import {Container} from "@mui/material"
import Header from "./CommonHeader";
import Head from "next/head";
import Script from "next/script"
export default (props) => {
    return (
        <Container fluid>
            <Header
                title={props.title || "Election Portal"}
                is_authenticated={props.authenticated || false}
            />
            {props.children}
        </Container>
    )
}