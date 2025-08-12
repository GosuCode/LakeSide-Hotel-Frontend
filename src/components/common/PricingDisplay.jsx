import { Card, Tag, Tooltip, Typography, Space, Divider } from "antd";
import { InfoCircleOutlined, DollarOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";

const { Text, Title } = Typography;

const PricingDisplay = ({ pricing, showDetails = true }) => {
  if (!pricing) return null;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: pricing.currency || "USD",
    }).format(amount);
  };

  const getAdjustmentColor = (percentage) => {
    if (percentage > 0) return "red"; // Price increase
    if (percentage < 0) return "green"; // Price decrease
    return "default";
  };

  return (
    <Card size="small" style={{ marginTop: 8 }}>
      <Space direction="vertical" style={{ width: "100%" }}>
        {/* Base Price */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text>Base Price:</Text>
          <Text strong>{formatCurrency(pricing.basePrice)}</Text>
        </div>

        {/* Adjustments Summary */}
        {pricing.adjustments && pricing.adjustments.length > 0 && (
          <>
            <Divider style={{ margin: "8px 0" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>Adjustments:</Text>
              <Space size="small">
                {pricing.adjustments.map((adjustment, index) => (
                  <Tooltip
                    key={index}
                    title={adjustment.description}
                    placement="top"
                  >
                    <Tag
                      color={getAdjustmentColor(adjustment.percentage)}
                      icon={<InfoCircleOutlined />}
                    >
                      {adjustment.percentage > 0 ? "+" : ""}
                      {adjustment.percentage}%
                    </Tag>
                  </Tooltip>
                ))}
              </Space>
            </div>
          </>
        )}

        {/* Total Adjustment Amount */}
        {pricing.totalAdjustmentAmount &&
          pricing.totalAdjustmentAmount.compareTo(0) !== 0 && (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Text>Total Adjustments:</Text>
              <Text
                type={pricing.totalAdjustmentAmount > 0 ? "danger" : "success"}
              >
                {pricing.totalAdjustmentAmount > 0 ? "+" : ""}
                {formatCurrency(pricing.totalAdjustmentAmount)}
              </Text>
            </div>
          )}

        {/* Final Price */}
        <Divider style={{ margin: "8px 0" }} />
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title level={5} style={{ margin: 0 }}>
            <DollarOutlined /> Final Price:
          </Title>
          <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
            {formatCurrency(pricing.finalPrice)}
          </Title>
        </div>

        {/* Detailed Adjustments */}
        {showDetails &&
          pricing.adjustments &&
          pricing.adjustments.length > 0 && (
            <>
              <Divider style={{ margin: "8px 0" }} />
              <div>
                <Text strong>Adjustment Details:</Text>
                {pricing.adjustments.map((adjustment, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 4,
                      fontSize: "12px",
                    }}
                  >
                    <Text type="secondary">{adjustment.name}:</Text>
                    <Text type="secondary">
                      {adjustment.percentage > 0 ? "+" : ""}
                      {adjustment.percentage}% (
                      {formatCurrency(adjustment.amount)})
                    </Text>
                  </div>
                ))}
              </div>
            </>
          )}
      </Space>
    </Card>
  );
};

export default PricingDisplay;

PricingDisplay.propTypes = {
  pricing: PropTypes.object.isRequired,
  showDetails: PropTypes.bool,
};
