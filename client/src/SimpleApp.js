import React, { useEffect, useState } from 'react';
import { createPlant, loadPlants } from './services/plantsApi';

function SimpleApp() {
    const [tab, setTab] = useState('catalog');
    const [plants, setPlants] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPlants()
            .then((data) => setPlants(data))
            .finally(() => setLoading(false));
    }, []);

    const handleCreate = async (plant) => {
        const created = await createPlant(plant);
        setPlants((prev) => [...prev, created]);
        return created;
    };

    return (
        <div>
            <h1>Ботанический сад</h1>

            <button type="button" onClick={() => setTab('catalog')}>
                Каталог ({plants.length})
            </button>{' '}
            <button type="button" onClick={() => setTab('admin')}>
                Админка
            </button>

            <hr />

            {loading && <p>Загрузка…</p>}

            {!loading && tab === 'catalog' && <Catalog plants={plants} />}

            {!loading && tab === 'admin' && <AdminPanel onCreate={handleCreate} />}
        </div>
    );
}

function Catalog({ plants }) {
    if (plants.length === 0) {
        return <p>В базе пока нет растений.</p>;
    }

    return (
        <ul>
            {plants.map((plant) => (
                <li key={plant.id}>
                    <p>
                        <b>{plant.russian_name}</b> <i>({plant.latin_name})</i>
                    </p>
                    <p>
                        Семейство: {plant.family}. Форма: {plant.life_form}. Происхождение:{' '}
                        {plant.geographic_origin}
                    </p>
                    <p>
                        Полив: {plant.watering}. Свет: {plant.light}. Температура:{' '}
                        {plant.temperature || '—'}. Влажность: {plant.humidity || '—'}
                    </p>
                    <p>Категории: {(plant.categories || []).join(', ') || '—'}</p>
                    <p>
                        Инв. №: {plant.inventory_number || '—'}. Локация: {plant.location || '—'}.
                        Статус: {plant.care_status || '—'}
                    </p>
                    <p>{plant.description}</p>
                </li>
            ))}
        </ul>
    );
}

const EMPTY_FORM = {
    russian_name: '',
    latin_name: '',
    family: '',
    life_form: '',
    description: '',
    geographic_origin: '',
    watering: '',
    light: '',
    temperature: '',
    humidity: '',
    categories: '',
    inventory_number: '',
    location: '',
    care_status: 'stable',
    planted_at: '',
    notes: '',
};

const REQUIRED_FIELDS = [
    'russian_name',
    'latin_name',
    'family',
    'life_form',
    'description',
    'geographic_origin',
    'watering',
    'light',
];

function AdminPanel({ onCreate }) {
    const [form, setForm] = useState(EMPTY_FORM);
    const [message, setMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const hasEmptyField = REQUIRED_FIELDS.some((name) => !form[name].trim());
        if (hasEmptyField) {
            setMessage('Заполните обязательные поля');
            return;
        }

        try {
            const created = await onCreate({
                ...form,
                categories: form.categories
                    .split(',')
                    .map((name) => name.trim())
                    .filter(Boolean),
            });
            setForm(EMPTY_FORM);
            setMessage(`Добавлено: ${created.russian_name}`);
        } catch (e) {
            setMessage(`Ошибка: ${e.message}`);
        }
    };

    const textField = (name, label, type = 'text') => (
        <p>
            <label>
                {label}
                <br />
                <input type={type} name={name} value={form[name]} onChange={handleChange} />
            </label>
        </p>
    );

    const textareaField = (name, label) => (
        <p>
            <label>
                {label}
                <br />
                <textarea name={name} rows="3" value={form[name]} onChange={handleChange} />
            </label>
        </p>
    );

    return (
        <form onSubmit={handleSubmit}>
            <h2>Новое растение</h2>
            <p>Поля со звёздочкой обязательны. Категории — через запятую.</p>

            {textField('russian_name', 'Русское название *')}
            {textField('latin_name', 'Латинское название *')}
            {textField('family', 'Семейство *')}
            {textField('life_form', 'Жизненная форма *')}

            {textareaField('description', 'Описание *')}
            {textField('geographic_origin', 'Происхождение *')}
            {textField('watering', 'Полив *')}
            {textField('light', 'Свет *')}
            {textField('temperature', 'Температура')}
            {textField('humidity', 'Влажность')}
            {textField('categories', 'Категории (через запятую)')}
            {textField('inventory_number', 'Инвентарный номер')}
            {textField('location', 'Локация')}

            <p>
                <label>
                    Статус ухода
                    <br />
                    <select name="care_status" value={form.care_status} onChange={handleChange}>
                        <option value="stable">Стабильное</option>
                        <option value="needs_attention">Требует внимания</option>
                        <option value="protected">Охраняемый</option>
                    </select>
                </label>
            </p>

            {textField('planted_at', 'Дата посадки', 'date')}
            {textareaField('notes', 'Примечание')}

            <p>
                <button type="submit">Добавить</button>
            </p>

            {message && <p>{message}</p>}
        </form>
    );
}

export default SimpleApp;
