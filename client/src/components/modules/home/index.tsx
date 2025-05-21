"use client";
import {
    CarOutlined,
    CreditCardOutlined,
    CustomerServiceOutlined,
    RightOutlined,
    SafetyCertificateOutlined,
    ShoppingCartOutlined,
} from "@ant-design/icons";
import { Badge, Button, Card, Col, Grid, Input, Row, Space, Typography } from "antd";
import Link from "next/link";

const { Title, Text, Paragraph } = Typography;
const { Meta } = Card;
const { useBreakpoint } = Grid;

const featuredProducts = [
    {
        id: 1,
        name: "Wireless Headphones",
        price: "$99.99",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
        discount: "20% OFF",
    },
    {
        id: 2,
        name: "Smart Watch",
        price: "$199.99",
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        discount: "15% OFF",
    },
    {
        id: 3,
        name: "Laptop Pro",
        price: "$1299.99",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
    },
    {
        id: 4,
        name: "Smartphone Ultra",
        price: "$899.99",
        image: "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd",
    },
];

const categories = [
    { name: "Electronics", image: "https://images.unsplash.com/photo-1550009158-9ebf69173e03" },
    { name: "Fashion", image: "https://images.unsplash.com/photo-1445205170230-053b83016050" },
    { name: "Home & Garden", image: "https://images.unsplash.com/photo-1501183638710-841dd1904471" },
    { name: "Beauty", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348" },
];

const HomePage = () => {
    const screens = useBreakpoint();
    const isMobile = !screens.sm;

    return (
        <div>
            {/* Hero Section */}
            <div
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(https://images.unsplash.com/photo-1607082350899-7e105aa886ae)",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: isMobile ? "60vh" : "80vh",
                    display: "flex",
                    alignItems: "center",
                    color: "white",
                }}
            >
                <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 15px" }}>
                    <Row>
                        <Col xs={24} md={14}>
                            <Title
                                level={isMobile ? 3 : 1}
                                style={{
                                    marginBottom: "16px",
                                    fontWeight: "bold",
                                    color: "white",
                                }}
                            >
                                Shop the Latest Trends
                            </Title>
                            <Paragraph
                                style={{
                                    fontSize: isMobile ? "14px" : "18px",
                                    marginBottom: "32px",
                                    maxWidth: "80%",
                                    color: "white",
                                }}
                            >
                                Discover amazing products with incredible deals. New arrivals every week.
                            </Paragraph>
                            <Space size="middle" wrap>
                                <Button
                                    type="primary"
                                    size={isMobile ? "middle" : "large"}
                                    icon={<ShoppingCartOutlined />}
                                    style={{
                                        fontWeight: "bold",
                                        borderRadius: "4px",
                                        padding: isMobile ? "0 15px" : "0 24px",
                                        height: isMobile ? "36px" : "48px",
                                    }}
                                >
                                    Shop Now
                                </Button>
                                <Link
                                    href="/configuration/permissions"
                                    style={{ textDecoration: "none", backgroundColor: "transparent" }}
                                >
                                    <Button
                                        type="default"
                                        size={isMobile ? "middle" : "large"}
                                        style={{
                                            color: "white",
                                            borderColor: "white",
                                            height: isMobile ? "36px" : "48px",
                                            backgroundColor: "transparent",
                                        }}
                                    >
                                        Admin
                                    </Button>
                                </Link>
                            </Space>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* Benefits Section */}
            <div style={{ padding: "32px 0", backgroundColor: "#f5f5f5" }}>
                <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 15px" }}>
                    <Row gutter={[24, 24]}>
                        <BenefitItem icon={<CarOutlined />} title="Free Shipping" desc="On orders over $50" />
                        <BenefitItem icon={<CreditCardOutlined />} title="Secure Payment" desc="100% secure payment" />
                        <BenefitItem icon={<CustomerServiceOutlined />} title="24/7 Support" desc="Dedicated support" />
                        <BenefitItem
                            icon={<SafetyCertificateOutlined />}
                            title="Quality Products"
                            desc="Guaranteed quality"
                        />
                    </Row>
                </div>
            </div>

            {/* Categories Section */}
            <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "64px 15px" }}>
                <Title level={2} style={{ textAlign: "center", fontWeight: "bold", marginBottom: "8px" }}>
                    Shop by Category
                </Title>
                <Paragraph style={{ textAlign: "center", color: "rgba(0, 0, 0, 0.45)", marginBottom: "40px" }}>
                    Browse our popular categories and find what you need
                </Paragraph>

                <Row gutter={[24, 24]}>
                    {categories.map((category, index) => (
                        <Col xs={12} md={6} key={index}>
                            <Card
                                cover={
                                    <div style={{ position: "relative", height: "200px", overflow: "hidden" }}>
                                        <img
                                            alt={category.name}
                                            src={category.image}
                                            style={{
                                                width: "100%",
                                                height: "200px",
                                                objectFit: "cover",
                                                transition: "transform 0.3s ease",
                                            }}
                                            className="category-image"
                                        />
                                        <div
                                            style={{
                                                position: "absolute",
                                                bottom: 0,
                                                left: 0,
                                                width: "100%",
                                                background: "rgba(0, 0, 0, 0.6)",
                                                padding: "12px",
                                            }}
                                        >
                                            <Title level={5} style={{ margin: 0, color: "white" }}>
                                                {category.name}
                                            </Title>
                                        </div>
                                    </div>
                                }
                                hoverable
                                bordered={false}
                                bodyStyle={{ display: "none" }}
                                style={{ borderRadius: "8px", overflow: "hidden" }}
                                className="category-card"
                            />
                        </Col>
                    ))}
                </Row>
            </div>

            {/* Featured Products */}
            <div style={{ backgroundColor: "#f5f5f5", padding: "64px 0" }}>
                <div className="container" style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 15px" }}>
                    <Title level={2} style={{ textAlign: "center", fontWeight: "bold", marginBottom: "8px" }}>
                        Featured Products
                    </Title>
                    <Paragraph style={{ textAlign: "center", color: "rgba(0, 0, 0, 0.45)", marginBottom: "40px" }}>
                        Check out our weekly featured products
                    </Paragraph>

                    <Row gutter={[24, 24]}>
                        {featuredProducts.map(product => (
                            <Col xs={24} sm={12} md={6} key={product.id}>
                                <Badge.Ribbon
                                    text={product.discount}
                                    color="red"
                                    style={{ display: product.discount ? "block" : "none" }}
                                >
                                    <Card
                                        hoverable
                                        cover={
                                            <img
                                                alt={product.name}
                                                src={product.image}
                                                style={{ height: "200px", objectFit: "cover" }}
                                            />
                                        }
                                        actions={[
                                            <Button type="default" icon={<ShoppingCartOutlined />}>
                                                Add to Cart
                                            </Button>,
                                        ]}
                                        className="product-card"
                                        style={{ height: "100%" }}
                                    >
                                        <Meta
                                            title={product.name}
                                            description={
                                                <Text
                                                    style={{ fontWeight: "bold", color: "#1890ff", fontSize: "16px" }}
                                                >
                                                    {product.price}
                                                </Text>
                                            }
                                        />
                                    </Card>
                                </Badge.Ribbon>
                            </Col>
                        ))}
                    </Row>

                    <div style={{ display: "flex", justifyContent: "center", marginTop: "40px" }}>
                        <Button type="primary" size="large" icon={<RightOutlined />}>
                            View All Products
                        </Button>
                    </div>
                </div>
            </div>

            {/* Newsletter Section */}
            <div style={{ padding: "64px 0" }}>
                <div className="container" style={{ maxWidth: "900px", margin: "0 auto", padding: "0 15px" }}>
                    <div
                        style={{
                            textAlign: "center",
                            padding: isMobile ? "24px" : "48px",
                            borderRadius: "16px",
                            backgroundColor: "#1890ff",
                            color: "white",
                        }}
                    >
                        <Title level={2} style={{ fontWeight: "bold", marginBottom: "16px", color: "white" }}>
                            Subscribe to Our Newsletter
                        </Title>
                        <Paragraph style={{ marginBottom: "32px", color: "white" }}>
                            Get updates on sales, special offers, and new arrivals
                        </Paragraph>
                        <Row gutter={16} justify="center">
                            <Col xs={24} sm={16}>
                                <Input size="large" placeholder="Enter your email address" style={{ width: "100%" }} />
                            </Col>
                            <Col xs={24} sm={6} style={{ marginTop: isMobile ? "16px" : 0 }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    style={{
                                        width: "100%",
                                        backgroundColor: "#fff",
                                        color: "#1890ff",
                                        fontWeight: "bold",
                                    }}
                                >
                                    Subscribe
                                </Button>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>

            {/* Add CSS for hover effects */}
            <style jsx global>{`
                .category-card:hover .category-image {
                    transform: scale(1.03);
                }

                .product-card {
                    transition:
                        transform 0.3s,
                        box-shadow 0.3s;
                }

                .product-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.1);
                }
            `}</style>
        </div>
    );
};

// Helper component for benefit items
const BenefitItem = ({ icon, title, desc }: any) => (
    <Col xs={12} md={6}>
        <div style={{ textAlign: "center", padding: "16px" }}>
            <div
                style={{
                    color: "#1890ff",
                    fontSize: "36px",
                    marginBottom: "8px",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                {icon}
            </div>
            <Title level={5} style={{ marginTop: 0 }}>
                {title}
            </Title>
            <Text type="secondary">{desc}</Text>
        </div>
    </Col>
);

export default HomePage;
