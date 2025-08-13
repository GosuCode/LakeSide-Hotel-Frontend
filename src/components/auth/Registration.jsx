import { useState } from "react";
import { registerUser } from "../utils/ApiFunctions";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Form,
  Input,
  Button,
  Typography,
  Card,
  Spin,
  Space,
  Alert,
} from "antd";
import {
  UserOutlined,
  MailOutlined,
  LockOutlined,
  SolutionOutlined,
} from "@ant-design/icons";
import { GMAIL_REGEX } from "../utils/constants";

const { Title, Text } = Typography;

const Registration = () => {
  const [registration, setRegistration] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setRegistration({ ...registration, [e.target.name]: e.target.value });
  };

  const handleRegistration = async () => {
    setLoading(true);
    try {
      const result = await registerUser(registration);
      setSuccessMessage(result);
      setErrorMessage("");
      setRegistration({ firstName: "", lastName: "", email: "", password: "" });
      toast.success("Registration successful! You can now login.");
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(`Registration error: ${error.message}`);
      toast.error(`Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
      setTimeout(() => {
        setErrorMessage("");
        setSuccessMessage("");
      }, 5000);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", padding: "50px" }}>
      <Card style={{ width: 450 }} bordered={true}>
        <Title level={2} style={{ textAlign: "center" }}>
          Register
        </Title>

        {errorMessage && (
          <Alert
            message={errorMessage}
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        {successMessage && (
          <Alert
            message={successMessage}
            type="success"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        <Form layout="vertical" onFinish={handleRegistration}>
          <Form.Item
            label="First Name"
            name="firstName"
            rules={[
              { required: true, message: "Please enter your first name!" },
            ]}
          >
            <Input
              prefix={<SolutionOutlined />}
              name="firstName"
              value={registration.firstName}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Last Name"
            name="lastName"
            rules={[
              { required: true, message: "Please enter your last name!" },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              name="lastName"
              value={registration.lastName}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Please enter your email!" },
              {
                pattern: GMAIL_REGEX,
                message:
                  "Use a valid Gmail address, e.g. john.doe+notes@gmail.com",
              },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              name="email"
              value={registration.email}
              onChange={handleInputChange}
              disabled={loading}
              allowClear
              autoComplete="email"
              inputMode="email"
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please enter your password!" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              name="password"
              value={registration.password}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" disabled={loading}>
                {loading ? <Spin size="small" /> : "Register"}
              </Button>
              <Text>
                Already have an account? <Link to="/login">Login</Link>
              </Text>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Registration;
