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
  Upload,
  Image,
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
  FileTextOutlined,
  NumberOutlined,
  UploadOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import {
  addHotel,
  getHotelById,
  updateHotel,
} from "../../../components/utils/ApiFunctions";
import { uploadImageToCloudinary } from "../../../components/utils/cloudinaryUpload";
import toast from "react-hot-toast";

const { Title } = Typography;
const { TextArea } = Input;

const HotelForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [photo, setPhoto] = useState(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const { hotelId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (hotelId) {
      setIsEditMode(true);
      fetchHotel();
    }
  }, [hotelId]);

  const fetchHotel = async () => {
    try {
      setFetching(true);
      const hotel = await getHotelById(hotelId);

      form.setFieldsValue({
        name: hotel.name,
        address: hotel.address,
        latitude: hotel.latitude ? Number(hotel.latitude) : null,
        longitude: hotel.longitude ? Number(hotel.longitude) : null,
        contact: hotel.contact,
        email: hotel.email,
        website: hotel.website,
        roomsCount: hotel.roomsCount,
        description: hotel.description,
        imageUrl: hotel.imageUrl,
      });

      // Set image preview if imageUrl exists
      if (hotel.imageUrl) {
        setImagePreview(hotel.imageUrl);
        // Store the existing image URL for updates
        setPhoto(hotel.imageUrl);
      }
    } catch (error) {
      toast.error("Failed to fetch hotel details");
      message.error("Failed to fetch hotel details");
      navigate("/admin/hotels");
    } finally {
      setFetching(false);
    }
  };

  const handleImageChange = (info) => {
    const file = info.file;
    if (file) {
      if (!file.type.startsWith("image/")) {
        message.error("Please select an image file (JPEG, PNG, GIF, etc.)");
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        message.error("File size too large. Maximum size is 5MB");
        return;
      }

      setPhoto(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      message.error("No file found in info.file");
    }
  };

  const beforeUpload = (file) => {
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("Image must be smaller than 5MB!");
      return false;
    }

    return false;
  };

  const onFinish = async (values) => {
    if (imageUploading) {
      message.warning("Please wait for image upload to complete");
      return;
    }

    setLoading(true);
    try {
      let imageUrl = null;

      if (photo) {
        // Check if photo is a File (new upload) or string (existing URL)
        if (photo instanceof File) {
          try {
            setImageUploading(true);
            imageUrl = await uploadImageToCloudinary(photo);
          } catch (uploadError) {
            message.error(
              uploadError.message || "Failed to upload image. Please try again."
            );
            setLoading(false);
            setImageUploading(false);
            return;
          } finally {
            setImageUploading(false);
          }
        } else {
          // Photo is already a URL string, use it directly
          imageUrl = photo;
        }
      }

      const hotelData = {
        ...values,
        imageUrl: imageUrl || values.imageUrl,
      };

      if (isEditMode) {
        await updateHotel(hotelId, hotelData);
        toast.success("Hotel updated successfully!");
        message.success("Hotel updated successfully!");
        navigate("/admin/hotels");
      } else {
        await addHotel(hotelData);
        toast.success("Hotel added successfully!");
        message.success("Hotel added successfully!");
        form.resetFields();
        setPhoto(null);
        setImagePreview("");
        navigate("/admin/hotels");
      }
    } catch (error) {
      toast.error(
        isEditMode
          ? "Failed to update hotel. Please try again."
          : "Failed to add hotel. Please try again."
      );
      message.error(
        isEditMode
          ? "Failed to update hotel. Please try again."
          : "Failed to add hotel. Please try again."
      );
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
              {isEditMode ? "Edit Hotel" : "Add New Hotel"}
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
            label="Hotel Photo"
            rules={[
              { required: true, message: "Please upload a hotel photo!" },
            ]}
          >
            <div style={{ marginBottom: 16 }}>
              <Upload
                accept="image/*"
                beforeUpload={beforeUpload}
                onChange={handleImageChange}
                showUploadList={false}
                disabled={imageUploading}
                maxCount={1}
                listType="picture"
              >
                <Button
                  icon={
                    imageUploading ? <LoadingOutlined /> : <UploadOutlined />
                  }
                  disabled={imageUploading}
                >
                  {imageUploading ? "Uploading..." : "Select Image"}
                </Button>
              </Upload>
            </div>

            {imageUploading && (
              <div style={{ marginTop: 16, textAlign: "center" }}>
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
                <div style={{ marginTop: 8 }}>
                  Uploading image to Cloudinary...
                </div>
              </div>
            )}

            {imagePreview && !imageUploading && (
              <div style={{ marginTop: 16 }}>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={300}
                  height={200}
                  preview={false}
                />
                <div style={{ marginTop: 8 }}>
                  <Button
                    type="link"
                    danger
                    onClick={() => {
                      setPhoto(null);
                      setImagePreview("");
                    }}
                  >
                    Remove Image
                  </Button>
                </div>
              </div>
            )}
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
                {loading
                  ? isEditMode
                    ? "Updating Hotel..."
                    : "Adding Hotel..."
                  : isEditMode
                  ? "Update Hotel"
                  : "Add Hotel"}
              </Button>
              {!isEditMode && (
                <Button
                  size="large"
                  onClick={() => form.resetFields()}
                  disabled={loading}
                >
                  Reset Form
                </Button>
              )}
              {isEditMode && (
                <Button
                  size="large"
                  onClick={() => navigate("/admin/hotels")}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default HotelForm;
