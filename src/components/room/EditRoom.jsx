import { useEffect, useState } from "react";
import { getRoomById, updateRoom } from "../utils/ApiFunctions";
import { Link, useParams } from "react-router-dom";
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
  Card,
  Spin,
} from "antd";
import { UploadOutlined, ArrowLeftOutlined } from "@ant-design/icons";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

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

const EditRoom = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imagePreview, setImagePreview] = useState("");
  const [photo, setPhoto] = useState(null);
  const { roomId } = useParams();

  useEffect(() => {
    fetchRoom();
  }, [roomId]);

  const fetchRoom = async () => {
    try {
      setLoading(true);
      const roomData = await getRoomById(roomId);

      // Set form values
      form.setFieldsValue({
        roomType: roomData.roomType,
        bedType: roomData.bedType,
        roomNumber: roomData.roomNumber,
        roomPrice: roomData.roomPrice,
        description: roomData.description,
        roomCategory: roomData.roomCategory,
      });

      // Set image preview if photo exists
      if (roomData.photo) {
        setImagePreview(`data:image/jpeg;base64,${roomData.photo}`);
      }
    } catch (error) {
      message.error("Failed to fetch room data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (info) => {
    const file = info.file.originFileObj;
    if (file) {
      setPhoto(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values) => {
    try {
      setSaving(true);

      const response = await updateRoom(roomId, {
        ...values,
        photo: photo,
      });

      if (response.status === 200) {
        message.success("Room updated successfully!");
        // Refresh room data
        await fetchRoom();
      } else {
        message.error("Error updating room");
      }
    } catch (error) {
      message.error(error.message || "Failed to update room");
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
        <div style={{ marginTop: "20px" }}>Loading room data...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", padding: "0 20px" }}>
      <Card>
        <div
          style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
        >
          <Link to="/admin/rooms">
            <Button icon={<ArrowLeftOutlined />} type="text">
              Back to Rooms
            </Button>
          </Link>
          <Title level={2} style={{ margin: 0, marginLeft: 16 }}>
            Edit Room
          </Title>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            roomType: "",
            bedType: "",
            roomNumber: "",
            roomPrice: "",
            description: "",
            roomCategory: "",
          }}
        >
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}
          >
            <div>
              <Form.Item
                label="Room Type"
                name="roomType"
                rules={[{ required: true, message: "Please select room type" }]}
              >
                <Select placeholder="Select room type">
                  {roomTypes.map((type) => (
                    <Option key={type} value={type}>
                      {type}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                label="Bed Type"
                name="bedType"
                rules={[{ required: true, message: "Please select bed type" }]}
              >
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
                rules={[
                  { required: true, message: "Please enter room number" },
                ]}
              >
                <Input type="number" placeholder="Enter room number" />
              </Form.Item>

              <Form.Item
                label="Room Category"
                name="roomCategory"
                rules={[{ required: true, message: "Please select category" }]}
              >
                <Select placeholder="Select category">
                  {categories.map((cat) => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </div>

            <div>
              <Form.Item
                label="Price"
                name="roomPrice"
                rules={[{ required: true, message: "Please enter price" }]}
              >
                <Input type="number" placeholder="Enter price" />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  { required: true, message: "Please enter description" },
                ]}
              >
                <TextArea rows={4} placeholder="Enter room description" />
              </Form.Item>

              <Form.Item label="Room Photo">
                <Upload
                  accept="image/*"
                  beforeUpload={() => false}
                  onChange={handleImageChange}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />}>Upload New Image</Button>
                </Upload>
                {imagePreview && (
                  <div style={{ marginTop: 16 }}>
                    <Image
                      src={imagePreview}
                      alt="Room preview"
                      width={200}
                      height={150}
                      style={{ objectFit: "cover" }}
                    />
                  </div>
                )}
              </Form.Item>
            </div>
          </div>

          <Form.Item style={{ marginTop: 24 }}>
            <Space>
              <Link to="/admin/rooms">
                <Button type="default">Cancel</Button>
              </Link>
              <Button type="primary" htmlType="submit" loading={saving}>
                Update Room
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default EditRoom;
