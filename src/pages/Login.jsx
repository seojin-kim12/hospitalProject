import { Container, BodyWrapper, Body } from '../styles/Global';
import { motion } from "framer-motion";
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from "styled-components";

function Login() {
    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Container>
                <BodyWrapper>
                    <Body>
                        
                    </Body>
                </BodyWrapper>
            </Container>
        </motion.div>
    );
};
export default Login;