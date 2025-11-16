import { useState, useEffect } from "react";
import {
  addRoom,
  updateRoom,
  getRoomById,
  getAllHotels,
} from "../../../components/utils/ApiFunctions";
import { uploadImageToCloudinary } from "../../../components/utils/cloudinaryUpload";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  Form,
  Input,
  Button,
  Upload,
  Typography,
  Image,
  Space,
  Select,
  Checkbox,
  Spin,
  message,
} from "antd";
import {
  UploadOutlined,
  LoadingOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";

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

const RoomForm = () => {
  const [form] = Form.useForm();
  const [imagePreview, setImagePreview] = useState("");
  const [photo, setPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [hotels, setHotels] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);

  const { roomId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (roomId) {
      setIsEditMode(true);
      fetchRoom();
    }
    fetchHotels();
  }, [roomId]);

  const fetchHotels = async () => {
    try {
      const hotelData = await getAllHotels();
      setHotels(hotelData);
    } catch (error) {
      message.error("Failed to fetch hotels.");
    }
  };

  const fetchRoom = async () => {
    try {
      const roomData = await getRoomById(roomId);

      // Set form values
      form.setFieldsValue({
        roomType: roomData.roomType,
        bedType: roomData.bedType,
        roomNumber: roomData.roomNumber,
        roomPrice: roomData.roomPrice,
        description: roomData.description,
        roomCategory: roomData.roomCategory,
        amenities: roomData.amenities || [],
        hotel: roomData.hotel?.id,
      });

      // Set image preview if photo exists
      if (roomData.photo) {
        setImagePreview(`${roomData.photo}`);
        // Store the existing photo URL for updates
        setPhoto(roomData.photo);
      }
    } catch (error) {
      message.error("Failed to fetch room data");
      console.error(error);
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

  const handleSubmit = async (values) => {
    try {
      // Check if user is logged in
      const token = localStorage.getItem("token");
      if (!token) {
        message.error("You are not logged in. Please login again.");
        navigate("/login");
        return;
      }

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
        hotel,
      } = values;

      let photoUrl = null;

      if (photo) {
        // Check if photo is a File (new upload) or string (existing URL)
        if (photo instanceof File) {
          try {
            setImageUploading(true);
            photoUrl = await uploadImageToCloudinary(photo);
          } catch (uploadError) {
            message.error(
              uploadError.message || "Failed to upload image. Please try again."
            );
            setUploading(false);
            setImageUploading(false);
            return;
          } finally {
            setImageUploading(false);
          }
        } else {
          // Photo is already a URL string, use it directly
          photoUrl = photo;
        }
      }

      // Frontend validation – ensure a photo is provided when creating a new room
      if (!isEditMode && !photoUrl) {
        message.error("Please upload a room photo before saving.");
        setUploading(false);
        return;
      }

      if (isEditMode) {
        const roomData = {
          roomType,
          roomPrice,
          photoUrl,
          bedType,
          roomNumber,
          description,
          roomCategory,
          amenities,
          hotel: { id: hotel },
        };

        const response = await updateRoom(roomId, roomData);
        if (response.status === 200) {
          message.success("Room updated successfully!");
          navigate("/admin/existing-rooms");
        } else {
          message.error("Error updating room.");
        }
      } else {
        const roomData = {
          photoUrl,
          roomType,
          roomPrice,
          bedType,
          roomNumber,
          description,
          roomCategory,
          amenities,
          hotel: { id: hotel },
          isBooked: false,
        };

        const success = await addRoom(roomData);
        if (success !== undefined) {
          message.success("A new room was added successfully!");
          form.resetFields();
          setPhoto(null);
          setImagePreview("");
        } else {
          message.error("Error adding new room.");
        }
      }
    } catch (err) {
      message.error(err.message || "Unexpected error");
    } finally {
      setUploading(false);
    }
  };

  const canSubmit = !imageUploading && !uploading;

  return (
    <div style={{ maxWidth: 700, margin: "60px auto" }}>
      <Title level={2}>{isEditMode ? "Edit Room" : "Add a New Room"}</Title>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ amenities: [] }}
      >
        <Form.Item
          label="Room Type"
          name="roomType"
          rules={[{ required: true, message: "Please select a room type" }]}
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
          rules={[{ required: true, message: "Please select a bed type" }]}
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
            { required: true, message: "Room number is required" },
            {
              validator: (_, value) => {
                if (value === undefined || value === null || value === "") {
                  return Promise.resolve();
                }
                const num = Number(value);
                if (!Number.isInteger(num)) {
                  return Promise.reject(
                    new Error("Room number must be an integer")
                  );
                }
                if (num < 1 || num > 300) {
                  return Promise.reject(
                    new Error("Room number must be between 1 and 300")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input
            type="number"
            max={300}
            min={1}
            placeholder="Enter room number (1-300)"
          />
        </Form.Item>

        <Form.Item
          label="Room Category"
          name="roomCategory"
          rules={[{ required: true, message: "Please select a room category" }]}
        >
          <Select placeholder="Select category">
            {categories.map((cat) => (
              <Option key={cat} value={cat}>
                {cat}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          label="Price"
          name="roomPrice"
          rules={[
            { required: true, message: "Please enter a room price" },
            {
              validator: (_, value) => {
                if (value === undefined || value === null || value === "") {
                  return Promise.resolve();
                }
                const num = Number(value);
                if (Number.isNaN(num) || num <= 0) {
                  return Promise.reject(
                    new Error("Price must be a positive number")
                  );
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <Input type="number" placeholder="Enter price" />
        </Form.Item>

        <Form.Item
          label="Description"
          name="description"
          rules={[
            { required: true, message: "Please enter a description" },
            {
              min: 20,
              message: "Description must be at least 20 characters long",
            },
          ]}
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

        <Form.Item
          label="Hotel"
          name="hotel"
          rules={[{ required: true, message: "Please select a hotel" }]}
        >
          <Select placeholder="Select hotel">
            {hotels.map((hotel) => (
              <Option key={hotel.id} value={hotel.id}>
                {hotel.name}
              </Option>
            ))}
          </Select>
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
                <ArrowLeftOutlined /> Back to Rooms
              </Button>
            </Link>
            <Button
              type="primary"
              htmlType="submit"
              loading={uploading}
              disabled={!canSubmit}
            >
              {uploading
                ? isEditMode
                  ? "Updating..."
                  : "Saving..."
                : isEditMode
                ? "Update Room"
                : "Save Room"}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RoomForm;
