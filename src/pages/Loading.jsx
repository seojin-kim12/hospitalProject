import React from 'react';
import { motion } from "framer-motion";
import { Container, BodyWrapper, Body } from '../styles/Global';
import spinner from "../assets/spinner.gif";

const Loading = () => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Container>
                <BodyWrapper>
                    <Body>
                    <img
                        id="loading"
                        src={spinner}
                        alt="loading spinner"
                        style={{ marginTop: "200%", width: "130px"}}
                    />
                    </Body>
                </BodyWrapper>
            </Container>
        </motion.div>
    );
};
export default Loading;