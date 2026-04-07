import { useState, useCallback } from "react";
import { Snackbar, Alert } from "@mui/material";

type AlertType = {
  message: string;
  severity: "success" | "error" | "info" | "warning";
};

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertType | null>(null);
  const [open, setOpen] = useState(false);

  // Función para mostrar la alerta
  const showAlert = useCallback(
    (message: string, severity: AlertType["severity"]) => {
      setAlert({ message, severity });
      setOpen(true);
    },
    []
  );

  // Función para cerrar la alerta
  const closeAlert = useCallback(() => {
    setOpen(false);
  }, []);

  // Componente JSX que renderiza la alerta
  const AlertComponent = alert ? (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={closeAlert}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={closeAlert}
        severity={alert.severity}
        sx={{ width: "100%" }}
      >
        {alert.message}
      </Alert>
    </Snackbar>
  ) : null;

  return { showAlert, AlertComponent };
};
