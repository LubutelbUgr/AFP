# FAST API Python бекэнд

Ну типа на другом языке, прикольно, стильно, молодежно. Добавим в резюме, что умеем дрюкать на питоне

## DEPENDENCIES
```
py -m pip install fastapi[standart]
py -m pip install uvicorn[standart]
py -m pip install sqlalchemy     
```

## START

```
python3 -m venv .venv
source .venv/bin/activate
py main.py
```

## БД

Схема по ТЗ: `plants`, 
             `plant_characteristics`, 
             `locations`, 
             `exhibits`, 
             `categories`, 
             `garden_staff`, 
             `roles`.

Наполнить тестовыми растениями:

```
py -m db.seed
```
