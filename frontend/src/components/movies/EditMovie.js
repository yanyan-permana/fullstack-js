import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Modal,
    Form,
    Input,
    Upload,
    message,
    DatePicker,
    Select,
    Button
} from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
    });

function EditMovie({ open, cancel, callbackDelete, idMovie }) {
    const [form] = Form.useForm();
    const { TextArea } = Input;
    const { confirm } = Modal;
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [year, setYear] = useState(0);
    const [released, setReleased] = useState('');

    const getMovieById = async () => {
        const response = await axios.get(`http://localhost:3030/movies/${idMovie}`);
        const { data, status } = response.data;
        const listFile = [
            {
                name: data.poster,
                url: `http://localhost:3030/assets/images/${data.poster}`
            }
        ];
        setFileList(listFile);
        setYear(data.year);
        setReleased(data.released);
        if (status === "success") {
            form.setFieldsValue({
                title: data.title,
                year: dayjs(data.year.toString(), 'YYYY'),
                released: dayjs(data.released),
                runtime: data.runtime,
                genre: data.genre.split(','),
                director: data.director,
                writer: data.writer,
                actor: data.actors,
                plot: data.plot,
                language: data.language.split(','),
                country: data.country.split(','),
                rating: data.rating,
                poster: data.poster
            });
        }
    };

    useEffect(() => {
        getMovieById();
    }, [idMovie]);


    const handleUpdate = async () => {
        try {
            const result = await form.validateFields();
            updateData(result);
        } catch (err) {
            console.log(err);
        }
    };

    const handleDelete = () => {
        confirm({
            icon: <ExclamationCircleOutlined />,
            title: 'Are You Sure?',
            content: 'Do you want delete data',
            onOk() {
                deleteData(idMovie);
            },
            okButtonProps: {
                type: 'primary',
                danger: true
            },
            okText: 'Yes',
            cancelText: 'No'
        });
    };

    const updateData = async (data) => {
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
            const response = await axios.patch(`http://localhost:3030/movies/${idMovie}`, formData, {
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

    const deleteData = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:3030/movies/${id}`);
            const { data, message, status } = response.data;
            if (status === "success") {
                callbackDelete(id);
                cancel(false, '');
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
                title="Edit Movie"
                closable={false}
                open={open}
                footer={[
                    <Button key="cancel" onClick={() => cancel(false, '')}>
                        Cancel
                    </Button>,
                    <Button key="danger" type="primary" danger onClick={handleDelete}>
                        Delete
                    </Button>,
                    <Button key="update" type="primary" onClick={handleUpdate}>
                        Update
                    </Button>
                ]}
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

export default EditMovie