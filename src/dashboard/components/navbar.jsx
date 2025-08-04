import { Layout, Typography } from "antd";

const { Header } = Layout;
const { Title } = Typography;

export default function Navbar() {
  return (
    <Header style={{ background: "#fff", padding: 0, textAlign: "center" }}>
      <Title level={3} style={{ margin: 0, lineHeight: "64px" }}>
        Admin Dashboard
      </Title>
    </Header>
  );
}
