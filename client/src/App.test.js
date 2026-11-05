import { fireEvent, render, screen } from '@testing-library/react';
import SimpleApp, { ADMIN_PASSWORD } from './SimpleApp';

const fill = (label, value) => {
    fireEvent.change(screen.getByLabelText(label), { target: { value } });
};

const openAdmin = () => {
    fireEvent.click(screen.getByRole('button', { name: 'Админка' }));
    fill('Пароль', ADMIN_PASSWORD);
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
};

beforeEach(() => {
    window.localStorage.clear();
    window.sessionStorage.clear();
});

test('каталог показывает растение из заглушки', async () => {
    render(<SimpleApp />);

    expect(screen.getByRole('heading', { name: 'Ботанический сад' })).toBeInTheDocument();
    expect(await screen.findByText('Завьяловский гладкий вареник')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Каталог (1)' })).toBeInTheDocument();
});

test('админка просит пароль', async () => {
    render(<SimpleApp />);
    await screen.findByText('Завьяловский гладкий вареник');

    fireEvent.click(screen.getByRole('button', { name: 'Админка' }));

    expect(screen.getByRole('heading', { name: 'Вход в админку' })).toBeInTheDocument();

    fill('Пароль', 'неверный');
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
    expect(await screen.findByText('Неверный пароль')).toBeInTheDocument();

    fill('Пароль', ADMIN_PASSWORD);
    fireEvent.click(screen.getByRole('button', { name: 'Войти' }));
    expect(await screen.findByRole('heading', { name: 'Новое растение' })).toBeInTheDocument();
});

test('админка добавляет растение', async () => {
    render(<SimpleApp />);
    await screen.findByText('Завьяловский гладкий вареник');

    openAdmin();

    fill(/Русское название/, 'Тестовое растение');
    fill(/Латинское название/, 'Testus plantus');
    fill(/Семейство/, 'Testaceae');
    fill(/Жизненная форма/, 'травянистое');
    fill(/Описание/, 'Растение для проверки админки');
    fill(/Происхождение/, 'Тестовая местность');
    fill(/Полив/, 'умеренный');
    fill(/Свет/, 'яркий рассеянный');

    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(await screen.findByText('Добавлено: Тестовое растение')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Каталог (2)' })).toBeInTheDocument();
});

