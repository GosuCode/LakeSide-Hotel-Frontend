import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Space,
  Typography,
  Card,
  Spin,
  Popconfirm,
  message,
  Tag,
  Input,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  HomeOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  FileTextOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import {
  getAllHotels,
  deleteHotel,
  searchHotels,
} from "../../components/utils/ApiFunctions";
import toast from "react-hot-toast";

const { Title, Text } = Typography;
const { Search } = Input;

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const data = await getAllHotels();
      setHotels(data);
    } catch (error) {
      toast.error("Failed to fetch hotels");
      message.error("Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    if (!value.trim()) {
      fetchHotels();
      return;
    }

    setSearchLoading(true);
    try {
      const data = await searchHotels(value, value);
      setHotels(data);
    } catch (error) {
      toast.error("Search failed");
      message.error("Search failed");
    } finally {
      setSearchLoading(false);
    }
  };

  const handleDelete = async (hotelId) => {
    try {
      await deleteHotel(hotelId);
      toast.success("Hotel deleted successfully!");
      message.success("Hotel deleted successfully!");
      fetchHotels(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete hotel");
      message.error("Failed to delete hotel");
    }
  };

  const columns = [
    {
      title: "Hotel Name",
      dataIndex: "name",
      key: "name",
      render: (text) => (
        <Space>
          <HomeOutlined style={{ color: "#1890ff" }} />
          <Text strong>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
      render: (text) => (
        <Space>
          <EnvironmentOutlined style={{ color: "#52c41a" }} />
          <Text>{text}</Text>
        </Space>
      ),
      ellipsis: true,
    },
    {
      title: "Contact",
      dataIndex: "contact",
      key: "contact",
      render: (text) => (
        <Space>
          <PhoneOutlined style={{ color: "#722ed1" }} />
          <Text>{text}</Text>
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => (
        <Space>
          <MailOutlined style={{ color: "#faad14" }} />
          <Text>{email || "N/A"}</Text>
        </Space>
      ),
    },
    {
      title: "Website",
      dataIndex: "website",
      key: "website",
      render: (website) => (
        <Space>
          <GlobalOutlined style={{ color: "#13c2c2" }} />
          <Text>
            <a href={website} target="_blank" rel="noopener noreferrer">
              {website || "N/A"}
            </a>
          </Text>
        </Space>
      ),
    },
    {
      title: "Rooms",
      dataIndex: "roomsCount",
      key: "roomsCount",
      render: (roomsCount) => <Tag color="blue">{roomsCount || 0} rooms</Tag>,
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      render: (description) => (
        <Space>
          <FileTextOutlined style={{ color: "#eb2f96" }} />
          <Text>{description || "No description available."}</Text>
        </Space>
      ),
      ellipsis: true,
    },
    {
      title: "Image",
      dataIndex: "imageUrl",
      key: "imageUrl",
      render: (imageUrl) => (
        <Space>
          <PictureOutlined style={{ color: "#52c41a" }} />
          <Text>
            <a href={imageUrl} target="_blank" rel="noopener noreferrer">
              {imageUrl ? "View Image" : "No Image"}
            </a>
          </Text>
        </Space>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => navigate(`/admin/hotels/edit/${record.id}`)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Delete Hotel"
            description="Are you sure you want to delete this hotel? This action cannot be undone."
            onConfirm={() => handleDelete(record.id)}
            okText="Yes, Delete"
            cancelText="Cancel"
            okType="danger"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const stats = {
    totalHotels: hotels.length,
    totalRooms: hotels.reduce((sum, hotel) => sum + (hotel.roomsCount || 0), 0),
    averageRoomsPerHotel:
      hotels.length > 0
        ? (
            hotels.reduce((sum, hotel) => sum + (hotel.roomsCount || 0), 0) /
            hotels.length
          ).toFixed(1)
        : 0,
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" tip="Loading hotels..." />
      </div>
    );
  }

  return (
    <div style={{ padding: "24px" }}>
      <Card
        title={
          <Space>
            <HomeOutlined style={{ color: "#1890ff" }} />
            <Title level={3} style={{ margin: 0 }}>
              Hotels Management
            </Title>
          </Space>
        }
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/hotels/add")}
            size="large"
          >
            Add New Hotel
          </Button>
        }
        style={{ marginBottom: "24px" }}
      >
        <Row gutter={[16, 16]} style={{ marginBottom: "24px" }}>
          <Col xs={24} sm={8}>
            <Statistic
              title="Total Hotels"
              value={stats.totalHotels}
              prefix={<HomeOutlined />}
              valueStyle={{ color: "#1890ff" }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="Total Rooms"
              value={stats.totalRooms}
              prefix={<HomeOutlined />}
              valueStyle={{ color: "#52c41a" }}
            />
          </Col>
          <Col xs={24} sm={8}>
            <Statistic
              title="Avg Rooms/Hotel"
              value={stats.averageRoomsPerHotel}
              prefix={<HomeOutlined />}
              valueStyle={{ color: "#722ed1" }}
            />
          </Col>
        </Row>

        <Search
          placeholder="Search hotels by name or address..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={handleSearch}
          loading={searchLoading}
          style={{ marginBottom: "16px" }}
        />

        <Table
          columns={columns}
          dataSource={hotels}
          rowKey="id"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} hotels`,
          }}
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default Hotels;
