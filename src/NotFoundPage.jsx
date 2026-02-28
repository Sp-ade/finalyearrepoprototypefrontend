import React from "react";
import { Box, Typography, Button, Paper } from "@mui/material";

export default function NotFoundPage() {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#f2f2f2",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 3,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 900,
          height: 500,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#ffffff",
        }}
      >
        {/* Funnel Shape */}
        <Box
          sx={{
            width: 0,
            height: 0,
            borderLeft: "100px solid transparent",
            borderRight: "100px solid transparent",
            borderTop: "200px solid #4a6cf7",
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{
              position: "absolute",
              top: "-150px",
              color: "#fff",
              fontSize: "32px",
              fontWeight: 700,
            }}
          >
            404
          </Typography>
        </Box>

        {/* Small bottom of funnel */}
        <Box
          sx={{
            width: 10,
            height: 40,
            backgroundColor: "#4a6cf7",
            marginTop: "-5px",
          }}
        />

        <Typography
          variant="h6"
          sx={{ marginTop: 3, fontWeight: 600, color: "#1a1a1a" }}
        >
          Page Not Found
        </Typography>

        <Button
          variant="contained"
          onClick={handleGoBack}
          sx={{
            marginTop: 4,
            textTransform: "none",
            paddingX: 4,
            paddingY: 1,
            borderRadius: 2,
          }}
        >
          Go back
        </Button>
      </Paper>
    </Box>
  );
  
}