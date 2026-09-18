import { Outlet } from "react-router-dom";
import AppLayout from "../layouts/AppLayout/AppLayout";

function AppLayoutRoute() {
  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}
export default AppLayoutRoute;
