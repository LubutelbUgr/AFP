import { MOCK_PLANTS } from '../data/mockPlants';

export const SERVER_URL = 'http://localhost:8000';
export const USE_SERVER = false;

// Если поменял данные в src/data/mockPlants.js увеличь версию ключа
// иначе браузер продолжит ебашить старые данные из localStorage
const STORAGE_KEY = 'plants-v2';

function readLocalPlants() {
    const raw = window.localStorage.getItem(STORAGE_KEY);

    if (raw) {
        try {
            return JSON.parse(raw);
        } catch (e) {
            console.warn('Не удалось прочитать localStorage', e);
        }
    }

    writeLocalPlants(MOCK_PLANTS);
    return MOCK_PLANTS;
}

function writeLocalPlants(plants) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(plants));
}

function nextId(plants) {
    return plants.reduce((max, plant) => Math.max(max, Number(plant.id) || 0), 0) + 1;
}

async function request(path, options) {
    const response = await fetch(`${SERVER_URL}${path}`, options);

    if (!response.ok) {
        throw new Error(`Сервер ответил ${response.status}`);
    }

    return response.json();
}

export async function loadPlants() {
    if (USE_SERVER) {
        try {
            return await request('/plants');
        } catch (e) {
            console.warn('Сервер недоступен, показываю заглушку', e);
        }
    }

    return readLocalPlants();
}

export async function createPlant(plant) {
    if (USE_SERVER) {
        return request('/plants', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(plant),
        });
    }

    const plants = readLocalPlants();
    const created = { ...plant, id: nextId(plants) };

    writeLocalPlants([...plants, created]);
    return created;
}
