import React from "react";
import {
    AppBar,
    Toolbar,
    Typography,
    Button,
    Box,
    ButtonGroup,
    Container
} from '@mui/material';
import Link from "next/link";

const Header = ({ title = "Election Portal", is_authenticated = false } = {}) => {
    return (
        <>
            <AppBar position="static" elevation={0} sx={{ mb: 4 }}>
                <Container maxWidth="xl">
                    <Toolbar disableGutters>
                        {/* Left-aligned title */}
                        <Typography
                            variant="h6"
                            component={Link}
                            href="/"
                            sx={{
                                mr: 2,
                                fontWeight: 700,
                                color: 'inherit',
                                textDecoration: 'none',
                                flexGrow: { xs: 1, md: 0 },
                                '&:hover': {
                                    color: '#ff0' // Light blue on hover
                                }
                            }}
                        >
                            ELECTION
                        </Typography>

                        {/* Center-aligned navigation */}
                        <Box sx={{
                            display: { xs: 'none', md: 'flex' },
                            mx: 'auto'
                        }}>
                            <Button
                                color="inherit"
                                component={Link}
                                href="/parties"
                                sx={{
                                    mx: 1,
                                    '&:hover': {
                                        backgroundColor: 'rgba(255,255,255,0.1)', // Semi-transparent white
                                        color: 'white'
                                    }
                                }}
                            >
                                Parties
                            </Button>
                        </Box>

                        {/* Right-aligned auth buttons */}
                        <Box sx={{ flexGrow: { xs: 1, md: 0 } }}>
                            <ButtonGroup variant="text">
                                {is_authenticated ? (
                                    <Button
                                        component={Link}
                                        href="/"
                                        sx={{
                                            color: 'white',
                                            '&:hover': {
                                                backgroundColor: 'rgba(255,255,255,0.1)',
                                                color: 'white'
                                            }
                                        }}
                                    >
                                        Log Out
                                    </Button>
                                ) : (
                                    <>
                                        <Button
                                            component={Link}
                                            href="/login"
                                            sx={{
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                    color: 'white'
                                                }
                                            }}
                                        >
                                            Log In
                                        </Button>
                                        <Button
                                            component={Link}
                                            href="/signup"
                                            sx={{
                                                color: 'white',
                                                '&:hover': {
                                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                                    color: 'white'
                                                }
                                            }}
                                        >
                                            Sign Up
                                        </Button>
                                    </>
                                )}
                            </ButtonGroup>
                        </Box>
                    </Toolbar>
                </Container>
            </AppBar>

            {/* Page title section */}
            <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
                <Typography
                    variant="h3"
                    component="h1"
                    gutterBottom
                    sx={{
                        fontWeight: 700,
                        position: 'relative',
                        '&:after': {
                            content: '""',
                            display: 'block',
                            width: '80px',
                            height: '4px',
                            bgcolor: 'primary.main',
                            mx: 'auto',
                            mt: 2
                        }
                    }}
                >
                    {title}
                </Typography>
            </Container>
        </>
    );
};

export default Header;