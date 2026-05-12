import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { routesDeveloper } from "./routes/routesDeveloper";
import { routesAdmin } from "./routes/routesAdmin"; // Added Import
import { StoreProvider } from "./store/StoreContext";
import PageNotFound from "./partials/PageNotFound";
import { routesAccess } from "./routes/routesAccess";

function App() {
  const queryClient = new QueryClient();

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <Router>
            <Routes>
              <Route path="*" element={<PageNotFound />} />
              {routesAccess.map(({ ...routesProps }, key) => {
                return <Route key={key} {...routesProps} />;
              })}
              {routesDeveloper.map(({ ...routesProps }, key) => {
                return <Route key={key} {...routesProps} />;
              })}
              {/* Added Admin Route Mapping */}
              {routesAdmin.map(({ ...routesProps }, key) => {
                return <Route key={key} {...routesProps} />;
              })}
            </Routes>
          </Router>
        </StoreProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
