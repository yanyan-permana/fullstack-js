import React, { useState } from "react";
import axios from "axios";
import {
    Modal,
    Form,
    Input,
    Upload,
    message,
    DatePicker,
    Select
} from "antd";
import { PlusOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function AddMovie({ open, cancel }) {
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [year, setYear] = useState(0);
    const [released, setReleased] = useState('');

    const handleOke = async () => {
        try {
            const result = await form.validateFields();
            saveData(result);
        } catch (err) {
            console.log(err);
        }
    };

    const saveData = async (data) => {
        const formData = new FormData();
        formData.append('title', data.title);
        formData.append('year', year);
        formData.append('released', released);
        formData.append('runtime', data.runtime);
        formData.append('genre', data.genre);
        formData.append('director', data.director);
        formData.append('writer', data.writer);
        formData.append('actor', data.actor);
        formData.append('plot', data.plot);
        formData.append('language', data.language);
        formData.append('country', data.country);
        formData.append('rating', data.rating);
        formData.append('poster', data.poster[0].originFileObj);
        try {
            const response = await axios.post("http://localhost:3030/movies", formData, {
                headers: {
                    "Content-type": "multipart/form-data"
                }
            });
            const { data, message, status } = response.data;
            if (status === "success") {
                cancel(false, data);
                Modal.success({
                    content: message,
                });
            }
        } catch (err) {
            console.log(err);
        }
    };

    const onChangeYear = (date, dateString) => {
        setYear(parseInt(dateString));
    };

    const onChangeReleased = (date, dateString) => {
        setReleased(dayjs(date).format("YYYY-MM-DD"));
    };

    const handleCancel = () => setPreviewOpen(false);
    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };
    const beforeUpload = (file) => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
    };
    const normFile = (e) => {
        if (Array.isArray(e)) {
            return e;
        }
        return e?.fileList;
    };
    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);
    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    return (
        <>
            <Modal
                title="Add Movie"
                closable={false}
                open={open}
                onCancel={() => cancel(false, '')}
                onOk={handleOke}
                okText={"Save"}
            >
                <Form
                    name="basic"
                    autoComplete="off"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 24 }}
                    layout="horizontal"
                    form={form}
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[{ required: true, message: "Please input your title!" }]}
                    >
                        <Input autoFocus={true} />
                    </Form.Item>

                    <Form.Item
                        label="Year"
                        name="year"
                        rules={[{ required: true, message: "Please input your year!" }]}
                    >
                        <DatePicker style={{ width: "100%" }} picker="year" onChange={onChangeYear} />
                    </Form.Item>

                    <Form.Item
                        label="Released"
                        name="released"
                    >
                        <DatePicker style={{ width: "100%" }} onChange={onChangeReleased} format="DD MMM YYYY" />
                    </Form.Item>

                    <Form.Item
                        label="Runtime"
                        name="runtime"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Genre"
                        name="genre"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            style={{ width: '100%' }}
                            options={[
                                {
                                    value: 'Action',
                                    label: 'Action'
                                },
                                {
                                    value: 'Animation',
                                    label: 'Animation'
                                },
                                {
                                    value: 'Comedy',
                                    label: 'Comedy'
                                },
                                {
                                    value: 'Crime',
                                    label: 'Crime'
                                },
                                {
                                    value: 'Documentary',
                                    label: 'Documentary'
                                },
                                {
                                    value: 'Drama',
                                    label: 'Drama'
                                },
                                {
                                    value: 'Romance',
                                    label: 'Romance'
                                }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Director"
                        name="director"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Writer"
                        name="writer"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Actor"
                        name="actor"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Plot"
                        name="plot"
                    >
                        <TextArea />
                    </Form.Item>

                    <Form.Item
                        label="Language"
                        name="language"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            showSearch
                            options={[
                                {
                                    value: 'English',
                                    label: 'English'
                                },
                                {
                                    value: 'Romanian',
                                    label: 'Romanian'
                                },
                                {
                                    value: 'Indonesia',
                                    label: 'Indonesia'
                                },
                                {
                                    value: 'Irish Gaelic',
                                    label: 'Irish Gaelic'
                                },
                                {
                                    value: 'Italian',
                                    label: 'Italian'
                                },
                                {
                                    value: 'Korean',
                                    label: 'Korean'
                                },
                                {
                                    value: 'Yiddish',
                                    label: 'Yiddish'
                                },
                                {
                                    value: 'French',
                                    label: 'French'
                                }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Country"
                        name="country"
                    >
                        <Select
                            mode="multiple"
                            allowClear
                            filterOption={(input, option) =>
                                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                            }
                            showSearch
                            options={[
                                {
                                    value: 'English',
                                    label: 'English'
                                },
                                {
                                    value: 'French',
                                    label: 'French'
                                },
                                {
                                    value: 'Indonesia',
                                    label: 'Indonesia'
                                },
                                {
                                    value: 'Irish Gaelic',
                                    label: 'Irish Gaelic'
                                },
                                {
                                    value: 'Italian',
                                    label: 'Italian'
                                },
                                {
                                    value: 'Romanian',
                                    label: 'Romanian'
                                },
                                {
                                    value: 'South Korea',
                                    label: 'South Korea'
                                },
                                {
                                    value: 'Yiddish',
                                    label: 'Yiddish'
                                },
                                {
                                    value: 'United Kingdom',
                                    label: 'United Kingdom'
                                }
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="Rating"
                        name="rating"
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item
                        label="Poster"
                        name="poster"
                        getValueFromEvent={normFile}
                        // valuePropName="fileList"
                        rules={[{ required: true, message: 'Please input your poster!' }]}
                    >
                        <Upload
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={handlePreview}
                            onChange={handleChange}
                            beforeUpload={beforeUpload}
                            maxCount={1}
                        >
                            {fileList.length >= 8 ? null : uploadButton}
                        </Upload>
                    </Form.Item>
                    <Modal
                        open={previewOpen}
                        title={previewTitle}
                        footer={null}
                        onCancel={handleCancel
                        }>
                        <img
                            alt="Poster"
                            style={{ width: '100%' }}
                            src={previewImage}
                        />
                    </Modal>
                </Form>
            </Modal>
        </>
    );
}

export default AddMovie