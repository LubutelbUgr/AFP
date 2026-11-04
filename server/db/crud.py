from dataclasses import dataclass, field
from datetime import date
from typing import Optional, Sequence

from sqlalchemy.orm import Session

from db.models import Category, Exhibit, Location, Plant, PlantCharacteristic


@dataclass
class PlantInput:
    russian_name: str
    latin_name: str
    family: str
    life_form: str
    description: str
    geographic_origin: str
    watering: str
    light: str
    temperature: Optional[str] = None
    humidity: Optional[str] = None
    category_names: list[str] = field(default_factory=list)
    inventory_number: Optional[str] = None
    location_id: Optional[int] = None
    location_sector_code: Optional[str] = None
    care_status: str = "stable"
    curator_id: Optional[int] = None
    planted_at: Optional[date] = None
    notes: Optional[str] = None


def _get_or_create_category(db: Session, name: str) -> Category:
    category = db.query(Category).filter(Category.name == name).one_or_none()
    if category is None:
        category = Category(name=name)
        db.add(category)
        db.flush()
    return category


def _resolve_location(db: Session, data: PlantInput) -> Location:
    if data.location_id is not None:
        location = db.get(Location, data.location_id)
        if location is None:
            raise ValueError(f"Локация с id={data.location_id} не обнаружена")
        return location

    if data.location_sector_code:
        location = (
            db.query(Location)
            .filter(Location.sector_code == data.location_sector_code)
            .one_or_none()
        )

        if location is None:
            raise ValueError(
                f"Локация с сектором {data.location_sector_code} не обнаружена"
            )

        return location

    raise ValueError("Для экземпляра нужна локация: location_id или location_sector_code")


def insert_plant(db: Session, data: PlantInput, *, commit: bool = True) -> Plant:
    existing = db.query(Plant).filter(Plant.latin_name == data.latin_name).one_or_none()
    
    if existing is not None:
        raise ValueError(f"Растение с не русским названием {data.latin_name} уже есть")

    plant = Plant(
        russian_name=data.russian_name,
        latin_name=data.latin_name,
        family=data.family,
        life_form=data.life_form,
        description=data.description,
        geographic_origin=data.geographic_origin,
    )

    plant.characteristics = PlantCharacteristic(
        watering=data.watering,
        light=data.light,
        temperature=data.temperature,
        humidity=data.humidity,
    )

    plant.categories = [
        _get_or_create_category(db, name) for name in data.category_names
    ]

    if data.inventory_number:
        existing_exhibit = (
            db.query(Exhibit)
            .filter(Exhibit.inventory_number == data.inventory_number)
            .one_or_none()
        )

        if existing_exhibit is not None:
            raise ValueError(
                f"Инвентарный номер {data.inventory_number} уже занят"
            )
            
        location = _resolve_location(db, data)
        plant.exhibits.append(
            Exhibit(
                inventory_number=data.inventory_number,
                location=location,
                curator_id=data.curator_id,
                care_status=data.care_status,
                planted_at=data.planted_at,
                notes=data.notes,
            )
        )

    db.add(plant)
    if commit:
        db.commit()
        db.refresh(plant)
    else:
        db.flush()
    return plant


def insert_plants(
    db: Session,
    items: Sequence[PlantInput],
    *,
    commit: bool = True,
) -> list[Plant]:
    plants = [insert_plant(db, item, commit=False) for item in items]
    if commit:
        db.commit()
        for plant in plants:
            db.refresh(plant)
    return plants
