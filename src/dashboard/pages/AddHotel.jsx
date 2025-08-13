import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, Typography, Card, Space, message } from "antd";
import {
  HomeOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { addHotel } from "../../components/utils/ApiFunctions";
import toast from "react-hot-toast";

const { Title } = Typography;
const { TextArea } = Input;

const AddHotel = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await addHotel(values);
      toast.success("Hotel added successfully!");
      message.success("Hotel added successfully!");
      form.resetFields();
      navigate("/admin/hotels");
    } catch (error) {
      toast.error("Failed to add hotel. Please try again.");
      message.error("Failed to add hotel. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    toast.error("Please check your form and try again.");
  };

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <Card
        title={
          <Space>
            <HomeOutlined style={{ color: "#1890ff" }} />
            <Title level={3} style={{ margin: 0 }}>
              Add New Hotel
            </Title>
          </Space>
        }
        extra={
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/admin/hotels")}
          >
            Back to Hotels
          </Button>
        }
        style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          initialValues={{
            name: "",
            address: "",
            contact: "",
          }}
        >
          <Form.Item
            name="name"
            label="Hotel Name"
            rules={[
              { required: true, message: "Please enter the hotel name!" },
              { min: 2, message: "Hotel name must be at least 2 characters!" },
            ]}
          >
            <Input
              prefix={<HomeOutlined />}
              placeholder="Enter hotel name"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="address"
            label="Hotel Address"
            rules={[
              { required: true, message: "Please enter the hotel address!" },
              { min: 10, message: "Address must be at least 10 characters!" },
            ]}
          >
            <TextArea
              prefix={<EnvironmentOutlined />}
              placeholder="Enter complete hotel address"
              rows={3}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="contact"
            label="Contact Information"
            rules={[
              { required: true, message: "Please enter contact information!" },
              {
                pattern: /^[+]?[1-9][\d]{0,15}$/,
                message: "Please enter a valid phone number!",
              },
            ]}
          >
            <Input
              prefix={<PhoneOutlined />}
              placeholder="Enter phone number (e.g., +1234567890)"
              size="large"
            />
          </Form.Item>

          <Form.Item style={{ marginTop: "32px", textAlign: "center" }}>
            <Space size="large">
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                loading={loading}
                icon={<SaveOutlined />}
                style={{
                  height: "48px",
                  paddingLeft: "48px",
                  paddingRight: "48px",
                  fontSize: "16px",
                }}
              >
                {loading ? "Adding Hotel..." : "Add Hotel"}
              </Button>
              <Button
                size="large"
                onClick={() => form.resetFields()}
                disabled={loading}
              >
                Reset Form
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default AddHotel;
