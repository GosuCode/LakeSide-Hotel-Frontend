import { useState } from "react";
import { addRoom } from "../utils/ApiFunctions";
import { uploadImageToCloudinary } from "../utils/cloudinaryUpload";
import { Link } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Upload,
  Typography,
  message,
  Image,
  Space,
  Select,
  Checkbox,
  Spin,
} from "antd";
import { UploadOutlined, LoadingOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;

const roomTypes = [
  "Single",
  "Double",
  "Twin",
  "Queen",
  "King",
  "Suite",
  "Deluxe",
  "Family",
  "Studio",
];
const bedTypes = [
  "Single",
  "Double",
  "Queen",
  "King",
  "Twin",
  "Bunk",
  "Sofa Bed",
  "Crib",
];
const categories = [
  "Standard",
  "Superior",
  "Deluxe",
  "Executive",
  "Suite",
  "Presidential Suite",
  "Family",
  "Accessible",
];
const amenitiesList = [
  "Wi-Fi",
  "Air Conditioning",
  "TV",
  "Mini Bar",
  "Room Service",
  "Balcony",
  "Coffee Maker",
  "Safe",
  "Hair Dryer",
  "Iron",
  "Bathtub",
  "Desk",
  "Refrigerator",
  "Telephone",
  "Heating",
  "Laundry Service",
];

const AddRoom = () => {
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState("");
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);

  const handleImageChange = (info) => {
    console.log("Image change info:", info);

    const file = info.file; // Changed from info.file.originFileObj
    if (file) {
      console.log("Selected file:", file);
      console.log("File type:", file.type);
      console.log("File size:", file.size);

      // Validate file type
      if (!file.type.startsWith("image/")) {
        message.error("Please select an image file (JPEG, PNG, GIF, etc.)");
        return;
      }

      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        message.error("File size too large. Maximum size is 10MB");
        return;
      }

      setPhoto(file);
      setImagePreview(URL.createObjectURL(file));
      message.success("Image selected successfully!");
      console.log(
        "Image state updated - photo:",
        file,
        "preview:",
        URL.createObjectURL(file)
      );
    } else {
      console.log("No file found in info.file");
    }
  };

  const beforeUpload = (file) => {
    // Check file type
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return false;
    }

    // Check file size
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      message.error("Image must be smaller than 10MB!");
      return false;
    }

    return false; // Return false to prevent auto upload
  };

  const handleSubmit = async (values) => {
    try {
      // Don't allow submission if image is still uploading
      if (imageUploading) {
        message.warning("Please wait for image upload to complete");
        return;
      }

      setUploading(true);

      const {
        roomType,
        bedType,
        roomNumber,
        roomPrice,
        description,
        roomCategory,
        amenities,
      } = values;

      let photoUrl = null;

      // Upload image to Cloudinary if photo is selected
      if (photo) {
        try {
          setImageUploading(true);
          message.info("Uploading image to Cloudinary...");

          photoUrl = await uploadImageToCloudinary(photo);
          message.success("Image uploaded successfully!");
        } catch (uploadError) {
          message.error("Failed to upload image. Please try again.");
          setUploading(false);
          setImageUploading(false);
          return;
        } finally {
          setImageUploading(false);
        }
      }

      // Now submit the room data
      message.info("Saving room data...");
      const success = await addRoom(
        photoUrl,
        roomType,
        roomPrice,
        bedType,
        roomNumber,
        description,
        roomCategory,
        amenities
      );

      if (success !== undefined) {
        message.success("A new room was added successfully!");
        form.resetFields();
        setPhoto(null);
        setImagePreview("");
      } else {
        message.error("Error adding new room.");
      }
    } catch (err) {
      message.error(err.message || "Unexpected error");
    } finally {
      setUploading(false);
    }
  };

  // Check if form can be submitted
  const canSubmit = !imageUploading && !uploading;

  return (
    <div style={{ maxWidth: 700, margin: "60px auto" }}>
      <Title level={2}>Add a New Room</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ amenities: [] }}
      >
        <Form.Item
          label="Room Type"
          name="roomType"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select room type">
            {roomTypes.map((type) => (
              <Option key={type} value={type}>
                {type}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Bed Type" name="bedType" rules={[{ required: true }]}>
          <Select placeholder="Select bed type">
            {bedTypes.map((bed) => (
              <Option key={bed} value={bed}>
                {bed}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Room Number"
          name="roomNumber"
          rules={[{ required: true }]}
        >
          <Input type="number" placeholder="Enter room number" />
        </Form.Item>

        <Form.Item
          label="Room Category"
          name="roomCategory"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select category">
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item label="Price" name="roomPrice" rules={[{ required: true }]}>
          <Input type="number" placeholder="Enter price" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[{ required: true }]}
        >
          <Input.TextArea rows={4} placeholder="Enter room description" />
        </Form.Item>

        <Form.Item label="Amenities" name="amenities">
          <Checkbox.Group>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "8px",
              }}
            >
              {amenitiesList.map((item) => (
                <Checkbox key={item} value={item}>
                  {item}
                </Checkbox>
              ))}
            </div>
          </Checkbox.Group>
        </Form.Item>

        <Form.Item label="Room Photo">
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
                icon={imageUploading ? <LoadingOutlined /> : <UploadOutlined />}
                disabled={imageUploading}
              >
                {imageUploading ? "Uploading..." : "Select Image"}
              </Button>
            </Upload>

            {/* Fallback file input for debugging */}
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  console.log("Direct file input:", file);
                  setPhoto(file);
                  setImagePreview(URL.createObjectURL(file));
                  message.success("Image selected via fallback input!");
                }
              }}
              style={{ marginLeft: 16 }}
            />
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

        <Form.Item>
          <Space>
            <Link to="/admin/existing-rooms">
              <Button type="default" disabled={!canSubmit}>
                Existing Rooms
              </Button>
            </Link>
            <Button
              type="primary"
              htmlType="submit"
              loading={uploading}
              disabled={!canSubmit}
            >
              {uploading ? "Saving..." : "Save Room"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddRoom;
