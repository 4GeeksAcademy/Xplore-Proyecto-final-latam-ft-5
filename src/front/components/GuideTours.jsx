import React, { useState, useEffect } from 'react';
import { getGuideTours } from '../utils/api';
import { Card, Badge, Button, Row, Col, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { MapPin, Clock, Users, Star, Edit, Trash2, Eye, Calendar } from 'lucide-react';

export default function GuideTours() {
    const [tours, setTours] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingTour, setEditingTour] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        loadGuideTours();
    }, []);

    const loadGuideTours = async () => {
        try {
            setLoading(true);
            const data = await getGuideTours();
            setTours(data);
            setError(null);
        } catch (err) {
            setError('Error al cargar tus tours');
            console.error('Error loading guide tours:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (tour) => {
        setEditingTour(tour);
        setEditForm({
            title: tour.title,
            description: tour.description,
            location: tour.location,
            base_price: tour.base_price,
            duration: tour.duration,
            max_travelers: tour.max_travelers,
            category: tour.category,
        });
        setShowEditModal(true);
    };

    const handleSaveEdit = async () => {
        try {
            // Aquí implementarías la llamada a la API para actualizar el tour
            console.log('Saving tour:', editForm);
            setShowEditModal(false);
            setEditingTour(null);
            // Recargar tours después de editar
            await loadGuideTours();
        } catch (err) {
            console.error('Error saving tour:', err);
        }
    };

    const handleDelete = async (tourId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este tour?')) {
            try {
                // Aquí implementarías la llamada a la API para eliminar el tour
                console.log('Deleting tour:', tourId);
                await loadGuideTours();
            } catch (err) {
                console.error('Error deleting tour:', err);
            }
        }
    };

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
        <div className="guide-tours">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2>Mis Tours</h2>
                    <p className="text-muted mb-0">Gestiona los tours que has creado</p>
                </div>
                <Button variant="success" href="/create-tour">
                    Crear Nuevo Tour
                </Button>
            </div>

            {tours.length === 0 ? (
                <Alert variant="info">
                    <div className="text-center py-4">
                        <h5>No tienes tours creados aún</h5>
                        <p className="text-muted">Comienza creando tu primer tour para compartir experiencias únicas</p>
                        <Button variant="primary" href="/create-tour">
                            Crear Mi Primer Tour
                        </Button>
                    </div>
                </Alert>
            ) : (
                <Row className="g-4">
                    {tours.map(tour => (
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
                                        <Badge bg={tour.is_active ? 'success' : 'secondary'}>
                                            {tour.is_active ? 'Activo' : 'Inactivo'}
                                        </Badge>
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

                                        <div className="d-flex justify-content-between align-items-center mb-3">
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

                                        <div className="d-flex gap-2">
                                            <Button
                                                variant="outline-primary"
                                                size="sm"
                                                className="flex-fill"
                                                onClick={() => handleEdit(tour)}
                                            >
                                                <Edit size={16} className="me-1" />
                                                Editar
                                            </Button>
                                            <Button
                                                variant="outline-info"
                                                size="sm"
                                                className="flex-fill"
                                                href={`/tour-detail/${tour.id}`}
                                            >
                                                <Eye size={16} className="me-1" />
                                                Ver
                                            </Button>
                                            <Button
                                                variant="outline-danger"
                                                size="sm"
                                                onClick={() => handleDelete(tour.id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            )}

            {/* Modal de Edición */}
            <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Editar Tour</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Título</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editForm.title || ''}
                                        onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Categoría</Form.Label>
                                    <Form.Select
                                        value={editForm.category || 'General'}
                                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                                    >
                                        <option value="General">General</option>
                                        <option value="Cultural">Cultural</option>
                                        <option value="Gastronómico">Gastronómico</option>
                                        <option value="Naturaleza">Naturaleza</option>
                                        <option value="Aventura">Aventura</option>
                                    </Form.Select>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Form.Group className="mb-3">
                            <Form.Label>Descripción</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={editForm.description || ''}
                                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                            />
                        </Form.Group>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ubicación</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editForm.location || ''}
                                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Duración</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editForm.duration || ''}
                                        onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Precio Base</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={editForm.base_price || ''}
                                        onChange={(e) => setEditForm({ ...editForm, base_price: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                            <Col md={6}>
                                <Form.Group className="mb-3">
                                    <Form.Label>Máximo Viajeros</Form.Label>
                                    <Form.Control
                                        type="number"
                                        value={editForm.max_travelers || 10}
                                        onChange={(e) => setEditForm({ ...editForm, max_travelers: e.target.value })}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                        Cancelar
                    </Button>
                    <Button variant="primary" onClick={handleSaveEdit}>
                        Guardar Cambios
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
