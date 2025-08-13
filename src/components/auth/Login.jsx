import { useState } from "react";
import { loginUser } from "../utils/ApiFunctions";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthProvider";
import toast from "react-hot-toast";
import { Form, Input, Button, Typography, Card, Spin, Space } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [login, setLogin] = useState({
    email: "",
    password: "",
  });

  const GMAIL_REGEX =
    /^[A-Za-z](?:[A-Za-z0-9]*(?:\.[A-Za-z0-9]+)*)?(?:\+[A-Za-z0-9_-]+)?@(gmail)\.com$/;

  const navigate = useNavigate();
  const auth = useAuth();
  const location = useLocation();
  const redirectUrl = location.state?.path || "/";

  const handleInputChange = (e) => {
    setLogin({ ...login, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const success = await loginUser(login);
      if (success) {
        const token = success.token;
        auth.handleLogin(token);
        toast.success("Login successful! Welcome back!");
        navigate(redirectUrl, { replace: true });
      } else {
        setErrorMessage("Invalid username or password. Please try again.");
        toast.error("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setErrorMessage("An error occurred during login. Please try again.");
      toast.error("Login failed. Please try again later.");
    } finally {
      setLoading(false);
      setTimeout(() => setErrorMessage(""), 4000);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        padding: "50px",
        height: "100vh",
      }}
    >
      <Card style={{ width: 400 }} bordered={true}>
        <Title level={2} style={{ textAlign: "center" }}>
          Login
        </Title>

        {errorMessage && (
          <Text type="danger" style={{ display: "block", marginBottom: 16 }}>
            {errorMessage}
          </Text>
        )}

        <Form layout="vertical" onFinish={handleSubmit}>
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
              value={login.email}
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
              value={login.password}
              onChange={handleInputChange}
              disabled={loading}
            />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit" disabled={loading}>
                {loading ? <Spin size="small" /> : "Login"}
              </Button>
              <Text>
                Don&apos;t have an account? <Link to="/register">Register</Link>
              </Text>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login;
