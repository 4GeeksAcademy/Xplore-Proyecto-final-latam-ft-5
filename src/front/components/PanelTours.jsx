import React, { useState, useEffect } from 'react';
import { getTours } from '../utils/api';
import { Card, Badge, Button, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { MapPin, Clock, Users, Star, Calendar } from 'lucide-react';

export default function PanelTours() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState('all');

    useEffect(() => {
        loadTours();
    }, []);

    const loadTours = async () => {
        try {
            setLoading(true);
            const data = await getTours();
            setTours(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los tours');
            console.error('Error loading tours:', err);
        } finally {
            setLoading(false);
        }
    };

    const filteredTours = selectedCategory === 'all'
        ? tours
        : tours.filter(tour => tour.category === selectedCategory);

    const categories = ['all', 'Cultural', 'Gastronómico', 'Naturaleza', 'Aventura', 'General'];

    if (loading) {
        return (
            <div className="text-center py-5">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
                {error}
            </Alert>
        );
    }

    return (
        <div className="panel-tours">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Descubre Tours Increíbles</h2>
                <div className="d-flex gap-2">
                    {categories.map(category => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? 'primary' : 'outline-primary'}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category === 'all' ? 'Todos' : category}
                        </Button>
                    ))}
                </div>
            </div>

            {filteredTours.length === 0 ? (
                <Alert variant="info">
                    No se encontraron tours en esta categoría.
                </Alert>
            ) : (
                <Row className="g-4">
                    {filteredTours.map(tour => (
                        <Col key={tour.id} xs={12} md={6} lg={4}>
                            <Card className="h-100 tour-card">
                                {tour.images && tour.images.length > 0 && (
                                    <Card.Img
                                        variant="top"
                                        src={tour.images[0]}
                                        alt={tour.title}
                                        style={{ height: '200px', objectFit: 'cover' }}
                                    />
                                )}
                                <Card.Body className="d-flex flex-column">
                                    <div className="mb-2">
                                        <Badge bg="secondary" className="me-2">
                                            {tour.category}
                                        </Badge>
                                        {tour.popular && tour.popular.includes('Popular') && (
                                            <Badge bg="warning" text="dark">
                                                Popular
                                            </Badge>
                                        )}
                                    </div>

                                    <Card.Title className="h6 mb-2">{tour.title}</Card.Title>
                                    <Card.Text className="text-muted small mb-3">
                                        {tour.description?.substring(0, 100)}...
                                    </Card.Text>

                                    <div className="mt-auto">
                                        <div className="d-flex align-items-center gap-3 mb-3 text-muted small">
                                            <div className="d-flex align-items-center gap-1">
                                                <MapPin size={16} />
                                                <span>{tour.location}</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-1">
                                                <Clock size={16} />
                                                <span>{tour.duration}</span>
                                            </div>
                                            <div className="d-flex align-items-center gap-1">
                                                <Users size={16} />
                                                <span>Max {tour.max_travelers}</span>
                                            </div>
                                        </div>

                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="d-flex align-items-center gap-1">
                                                <Star size={16} className="text-warning" />
                                                <span className="fw-bold">{tour.rate}</span>
                                            </div>
                                            <div className="text-end">
                                                <div className="h5 mb-0 text-primary">
                                                    ${tour.base_price}
                                                </div>
                                                <small className="text-muted">por persona</small>
                                            </div>
                                        </div>

                                        <Button
                                            variant="primary"
                                            className="w-100 mt-3"
                                            href={`/tour/${tour.id}`}
                                        >
                                            Ver Detalles
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}
        </div>
    );
}