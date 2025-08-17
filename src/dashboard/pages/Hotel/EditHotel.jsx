import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Space,
  message,
  InputNumber,
  Spin,
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
import {
  getHotelById,
  updateHotel,
} from "../../../components/utils/ApiFunctions";
import toast from "react-hot-toast";

const { Title } = Typography;
const { TextArea } = Input;

const EditHotel = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchHotel();
  }, [id]);

  const fetchHotel = async () => {
    try {
      const hotel = await getHotelById(id);
      form.setFieldsValue({
        name: hotel.name,
        address: hotel.address,
        contact: hotel.contact,
        email: hotel.email,
        website: hotel.website,
        roomsCount: hotel.roomsCount,
        description: hotel.description,
        imageUrl: hotel.imageUrl,
      });
    } catch (error) {
      toast.error("Failed to fetch hotel details");
      message.error("Failed to fetch hotel details");
      navigate("/admin/hotels");
    } finally {
      setFetching(false);
    }
  };

  const onFinish = async (values) => {
    setLoading(true);
    try {
      await updateHotel(id, values);
      toast.success("Hotel updated successfully!");
      message.success("Hotel updated successfully!");
      navigate("/admin/hotels");
    } catch (error) {
      toast.error("Failed to update hotel. Please try again.");
      message.error("Failed to update hotel. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    toast.error("Please check your form and try again.");
  };

  if (fetching) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Loading hotel details..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>
      <Card
        title={
          <Space>
            <HomeOutlined style={{ color: "#1890ff" }} />
            <Title level={3} style={{ margin: 0 }}>
              Edit Hotel
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
                {loading ? "Updating Hotel..." : "Update Hotel"}
              </Button>
              <Button
                size="large"
                onClick={() => navigate("/admin/hotels")}
                disabled={loading}
              >
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditHotel;
