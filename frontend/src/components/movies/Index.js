import React, { useEffect, useState } from "react";
import { Button, Card, Col, Row, Table, Dropdown, Space, Input, Tag } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import axios from "axios";
import AddMovie from "./AddMovie";
import dayjs from 'dayjs';
import { Excel } from 'antd-table-saveas-excel';
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import EditMovie from "./EditMovie";

function IndexMovie() {
    const [movies, setMovies] = useState([]);
    const [isModalAdd, setIsModalAdd] = useState(false);
    const [isModalEdit, setIsModalEdit] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [idMovie, setIdMovie] = useState('');
    const columns = [
        {
            title: 'No',
            dataIndex: 'no',
            key: 'no',
            width: 50
        },
        {
            title: 'Title',
            dataIndex: 'title',
            key: 'title',
            width: 150,
            render: (text, record, index) => (
                <a
                    onClick={() => {
                        setIdMovie(record.id);
                        setIsModalEdit(true);
                    }}
                >
                    {text}
                </a>
            )
        },
        {
            title: 'Year',
            dataIndex: 'year',
            key: 'year',
            width: 150
        },
        {
            title: 'Released',
            dataIndex: 'released',
            key: 'released',
            width: 150,
            render: (text) => (
                <div>
                    {dayjs(text).format('DD MMM YYYY')}
                </div>
            )
        },
        {
            title: 'Runtime',
            dataIndex: 'runtime',
            key: 'runtime',
            width: 150
        },
        {
            title: 'Genre',
            dataIndex: 'genre',
            key: 'genre',
            width: 150,
            render: (text) => {
                return (
                    <Tag color="magenta">
                        {text.replaceAll(',', ', ')}
                    </Tag>
                );
            }
        }
    ];
    const items = [
        {
            key: '1',
            label: (
                <a onClick={() => exportPdf()}>PDF</a>
            )
        },
        {
            key: '2',
            label: (
                <a onClick={() => exportExcel()}>Excel</a>
            )
        }
    ];

    const updateRowTable = (data) => {
        const index = movies.map(movie => movie.id).indexOf(data.id);
        const newMovies = [...movies];
        newMovies[index] = data;
        setMovies(newMovies);
    };

    const deleteRowTable = (id) => {
        const index = movies.map(movie => movie.id).indexOf(id);
        const newMovies = [...movies];
        newMovies.splice(index, 1);
        setMovies(newMovies);
    };

    const exportPdf = () => {
        const doc = new jsPDF()
        autoTable(doc, {
            body: movies,
            columns: [
                {
                    header: 'No',
                    key: 'no'
                },
                {
                    header: 'Title',
                    key: 'title'
                },
                {
                    header: 'Year',
                    key: 'year',
                },
                {
                    header: 'Released',
                    key: 'released'
                },
                {
                    header: 'Runtime',
                    key: 'runtime',
                },
                {
                    header: 'Genre',
                    key: 'genre',
                }
            ]
        })

        doc.save('movies.pdf')
    };

    const exportExcel = () => {
        const excel = new Excel();

        excel.addSheet('Sheet1')
            .addColumns(columns)
            .addDataSource(movies)
            .saveAs('Movies.xlsx');
    };

    const getAllMovie = async () => {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3030/movies");
        const { data, status } = response.data;
        if (status === "success") {
            // Add no
            data.map((dt, index) => data[index].no = index + 1);
            setMovies(data);
        }
        setIsLoading(false);
    };

    const [keyword, setKeyword] = useState("");
    const dataSource = movies.filter(movie => {
        return movie.title.toString().toLowerCase().includes(keyword.toLowerCase()) ||
            movie.year.toString().toLowerCase().includes(keyword.toLowerCase()) ||
            movie.runtime.toString().toLowerCase().includes(keyword.toLowerCase()) ||
            movie.genre.toString().toLowerCase().includes(keyword.toLowerCase())
    });

    useEffect(() => {
        getAllMovie();
    }, []);
    return (
        <>
            <Row justify="center">
                <Col span={20}>
                    <Card
                        title="Movies"
                        extra={
                            (
                                <Space wrap>
                                    <Button
                                        type="primary"
                                        icon={<PlusCircleOutlined />}
                                        onClick={() => setIsModalAdd(true)}
                                    >
                                        Add
                                    </Button>
                                    <Dropdown.Button
                                        menu={{
                                            items,
                                        }}
                                    >
                                        Exports
                                    </Dropdown.Button>
                                </Space>
                            )
                        }
                    >
                        <Row justify="end">
                            <Col md={4}>
                                <Input placeholder="Search..." onKeyUp={(event) => setKeyword(event.target.value)} />
                            </Col>
                        </Row>
                        <Table columns={columns} dataSource={dataSource} rowKey="id" scroll={{ x: 1300 }} loading={isLoading} style={{ marginTop: "10px" }} />
                    </Card>
                </Col>
            </Row>
            {
                isModalAdd &&
                <AddMovie
                    open={isModalAdd}
                    cancel={(modal, data) => {
                        if (data != '') {
                            data.no = movies.length + 1;
                            setMovies([...movies, data]);
                        }
                        setIsModalAdd(modal);
                    }}
                />
            }
            {
                isModalEdit &&
                <EditMovie
                    open={isModalEdit}
                    cancel={(modal, data) => {
                        if (data != '') {
                            data.no = movies.length;
                            updateRowTable(data);
                        }
                        setIsModalEdit(modal);
                    }}
                    callbackDelete={(id) => deleteRowTable(id)}
                    idMovie={idMovie}
                />
            }
        </>
    )
}

export default IndexMovie