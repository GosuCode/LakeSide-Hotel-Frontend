import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Space,
  message,
  InputNumber,
} from "antd";
import {
  HomeOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  SaveOutlined,
  ArrowLeftOutlined,
  MailOutlined,
  GlobalOutlined,
  PictureOutlined,
  FileTextOutlined,
  NumberOutlined,
} from "@ant-design/icons";
import { addHotel } from "../../../components/utils/ApiFunctions";
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
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
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
            latitude: "",
            longitude: "",
            contact: "",
            email: "",
            website: "",
            roomsCount: 0,
            description: "",
            imageUrl: "",
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
            name="latitude"
            label="Latitude"
            rules={[
              { required: true, message: "Please enter the latitude!" },
              {
                type: "number",
                min: -90,
                max: 90,
                message: "Latitude must be between -90 and 90!",
              },
            ]}
          >
            <InputNumber
              prefix={<EnvironmentOutlined />}
              placeholder="Enter latitude (e.g., 40.7128)"
              size="large"
              style={{ width: "100%" }}
              step="any"
              precision={6}
            />
          </Form.Item>

          <Form.Item
            name="longitude"
            label="Longitude"
            rules={[
              { required: true, message: "Please enter the longitude!" },
              {
                type: "number",
                min: -180,
                max: 180,
                message: "Longitude must be between -180 and 180!",
              },
            ]}
          >
            <InputNumber
              prefix={<EnvironmentOutlined />}
              placeholder="Enter longitude (e.g., -74.0060)"
              size="large"
              style={{ width: "100%" }}
              step="any"
              precision={6}
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

          <Form.Item
            name="email"
            label="Email Address"
            rules={[
              { required: true, message: "Please enter the hotel email!" },
              { type: "email", message: "Please enter a valid email address!" },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Enter hotel email address"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="website"
            label="Website URL"
            rules={[
              { type: "url", message: "Please enter a valid website URL!" },
            ]}
          >
            <Input
              prefix={<GlobalOutlined />}
              placeholder="Enter website URL (e.g., https://hotel.com)"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="roomsCount"
            label="Number of Rooms"
            rules={[
              { required: true, message: "Please enter the number of rooms!" },
              { type: "number", min: 1, message: "Must have at least 1 room!" },
            ]}
          >
            <InputNumber
              prefix={<NumberOutlined />}
              placeholder="Enter total number of rooms"
              size="large"
              style={{ width: "100%" }}
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="Hotel Description"
            rules={[
              { required: true, message: "Please enter a hotel description!" },
              {
                min: 20,
                message: "Description must be at least 20 characters!",
              },
            ]}
          >
            <TextArea
              prefix={<FileTextOutlined />}
              placeholder="Enter detailed hotel description (amenities, features, etc.)"
              rows={4}
              size="large"
              maxLength={2000}
              showCount
            />
          </Form.Item>

          <Form.Item
            name="imageUrl"
            label="Hotel Image URL"
            rules={[
              { type: "url", message: "Please enter a valid image URL!" },
            ]}
          >
            <Input
              prefix={<PictureOutlined />}
              placeholder="Enter hotel image URL (optional)"
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
