import React, { useState } from "react";
import { ConfigProvider, Form, Input, message, Modal, Space, Table } from "antd";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

const MakeAdmin = () => {
    const [form] = Form.useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    // Mock data for design
    const [admins, setAdmins] = useState([
        { id: 1, fullName: "Admin 1", email: "admin1@example.com", role: "admin" },
        { id: 2, fullName: "Admin 2", email: "admin2@example.com", role: "admin" }
    ]);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
        form.resetFields();
    };

    const onFinish = (values) => {
        setLoading(true);
        // Simulate adding new admin
        setTimeout(() => {
            const newAdmin = {
                id: admins.length + 1,
                fullName: values.fullName,
                email: values.email,
                role: "admin"
            };
            setAdmins([...admins, newAdmin]);
            message.success("Admin created successfully!");
            setLoading(false);
            handleCancel();
        }, 1000);
    };

    const handleDelete = (record) => {
        // Simulate delete
        setAdmins(admins.filter(admin => admin.id !== record.id));
        message.success("Admin deleted successfully!");
    };

    const columns = [
        {
            title: "Name",
            dataIndex: "fullName",
            key: "fullName",
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
        },
        {
            title: "Role",
            dataIndex: "role",
            key: "role",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <button
                        onClick={() => handleDelete(record)}
                        className="text-red-500 hover:text-red-700"
                    >
                        <RiDeleteBin6Line className="text-xl" />
                    </button>
                    <button className="text-blue-500 hover:text-blue-700">
                        <FaRegEdit className="text-xl" />
                    </button>
                </Space>
            ),
        },
    ];

    return (
        <div className="container mx-auto">
            <div className="bg-white rounded-lg p-6 md:p-10 mt-5">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">All Admin</h2>
                    <button
                        onClick={showModal}
                        className="bg-primary text-white px-4 py-2 rounded-lg"
                    >
                        Add Admin
                    </button>
                </div>

                <ConfigProvider theme={{
                    components: {
                        Table: {
                            headerBg: "#F7F7F7",
                            headerColor: "#333333",
                            borderColor: "#E5E7EB",
                            rowHoverBg: "#F9FAFB",
                        },
                    },
                }}>
                    <Table
                        columns={columns}
                        dataSource={admins}
                        pagination={{ pageSize: 10 }}
                    />
                </ConfigProvider>

                <Modal
                    title="Add New Admin"
                    open={isModalOpen}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form
                        form={form}
                        name="addAdmin"
                        onFinish={onFinish}
                        layout="vertical"
                        className="mt-4"
                    >
                        <Form.Item
                            name="fullName"
                            label="Full Name"
                            rules={[{ required: true, message: "Please input full name!" }]}
                        >
                            <Input placeholder="Enter full name" />
                        </Form.Item>

                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "Please input email!" },
                                { type: "email", message: "Please enter a valid email!" }
                            ]}
                        >
                            <Input placeholder="Enter email" />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[{ required: true, message: "Please input password!" }]}
                        >
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                                >
                                    {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
                                </button>
                            </div>
                        </Form.Item>

                        <Form.Item className="flex justify-end mb-0">
                            <Space>
                                <button
                                    onClick={handleCancel}
                                    className="bg-gray-100 text-gray-600 px-4 py-2 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-primary text-white px-4 py-2 rounded-lg"
                                    disabled={loading}
                                >
                                    Add Admin
                                </button>
                            </Space>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        </div>
    );
};

export default MakeAdmin;