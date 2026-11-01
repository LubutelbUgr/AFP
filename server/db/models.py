from sqlalchemy import Column, Integer, String
from db.db import Base

#TODO Модели баз данных и работа с ними. Ну ибо sqlite дерьмо
class Plants(Base):
    __tablename__ = "___" 

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)