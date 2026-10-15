import { useLocation } from "react-router-dom";
import PageContainer from "../../components/PageContainer/PageContainer";

const sectionTitles: Record<string, string> = {
  profile: "My Profile",
  orders: "Orders",
  addresses: "Addresses",
};

function AccountSection() {
  const { pathname } = useLocation();
  const section = pathname.split("/").filter(Boolean).pop() ?? "profile";
  const title = sectionTitles[section] ?? "My Account";

  return (
    <PageContainer>
      <section className="account-section">
        <h1>{title}</h1>
        <p>This account section is not available yet.</p>
      </section>
    </PageContainer>
  );
}

export default AccountSection;
