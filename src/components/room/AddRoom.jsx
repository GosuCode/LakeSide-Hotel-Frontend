import { useState } from "react";
import { addRoom } from "../utils/ApiFunctions";
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
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

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

  const handleImageChange = (info) => {
    const file = info.file.originFileObj;
    if (file) {
      setPhoto(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values) => {
    try {
      const {
        roomType,
        bedType,
        roomNumber,
        roomPrice,
        description,
        roomCategory,
        amenities,
      } = values;

      const success = await addRoom(
        photo,
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
    }
  };

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

        <Form.Item label="Room Photo" required>
          <Upload
            accept="image/*"
            beforeUpload={() => false}
            onChange={handleImageChange}
            showUploadList={false}
          >
            <Button icon={<UploadOutlined />}>Upload Image</Button>
          </Upload>
          {imagePreview && (
            <Image
              src={imagePreview}
              alt="Preview"
              style={{ marginTop: 16 }}
              width={300}
              height={200}
              preview={false}
            />
          )}
        </Form.Item>

        <Form.Item>
          <Space>
            <Link to="/admin/existing-rooms">
              <Button type="default">Existing Rooms</Button>
            </Link>
            <Button type="primary" htmlType="submit">
              Save Room
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddRoom;
