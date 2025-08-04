import { Row, Col, Card, Statistic } from "antd";

export default function DashboardContent() {
  return (
    <Row gutter={16}>
      <Col span={8}>
        <Card>
          <Statistic title="Total Bookings" value={1128} />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic title="Active Customers" value={93} />
        </Card>
      </Col>
      <Col span={8}>
        <Card>
          <Statistic title="Revenue" value={18923} prefix="$" />
        </Card>
      </Col>
    </Row>
  );
}
