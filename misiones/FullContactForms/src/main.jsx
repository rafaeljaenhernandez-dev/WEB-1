import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import "./styles.css";
import App from "./App.jsx";

// Un único cliente para toda la app: es la caché del estado del servidor
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1, // un reintento basta para un corte de red; más solo alarga el «Cargando…»
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </StrictMode>,
);
