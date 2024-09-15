from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import sessionmaker, declarative_base
from fastapi.middleware.cors import CORSMiddleware

import json

DATABASE_URL = "sqlite:///./data/tasks.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(bind=engine)
Base = declarative_base()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],   # Allows all methods
    allow_headers=["*"],   # Allows all headers
)
class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    attributes = Column(Text)  # Store attributes as JSON string

Base.metadata.create_all(bind=engine)

class TaskCreate(BaseModel):
    title: str
    attributes: Dict[str, Any]

class TaskOut(TaskCreate):
    id: int

    class Config:
        orm_mode = True

@app.post("/tasks/", response_model=TaskOut)
def create_task(task: TaskCreate):
    db = SessionLocal()
    db_task = Task(title=task.title, attributes=json.dumps(task.attributes))
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    db_task.attributes = task.attributes  # Convert JSON string back to dict
    db.close()
    return db_task

@app.get("/tasks/", response_model=List[TaskOut])
def read_tasks():
    db = SessionLocal()
    tasks = db.query(Task).all()
    for task in tasks:
        task.attributes = json.loads(task.attributes)
    db.close()
    return tasks

@app.get("/tasks/{task_id}", response_model=TaskOut)
def read_task(task_id: int):
    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()
    if task is None:
        db.close()
        raise HTTPException(status_code=404, detail="Task not found")
    task.attributes = json.loads(task.attributes)
    db.close()
    return task

@app.put("/tasks/{task_id}", response_model=TaskOut)
def update_task(task_id: int, task_update: TaskCreate):
    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()
    if task is None:
        db.close()
        raise HTTPException(status_code=404, detail="Task not found")
    task.title = task_update.title
    task.attributes = json.dumps(task_update.attributes)
    db.commit()
    db.refresh(task)
    task.attributes = task_update.attributes
    db.close()
    return task

@app.delete("/tasks/{task_id}")
def delete_task(task_id: int):
    db = SessionLocal()
    task = db.query(Task).filter(Task.id == task_id).first()
    if task is None:
        db.close()
        raise HTTPException(status_code=404, detail="Task not found")
    db.delete(task)
    db.commit()
    db.close()
    return {"detail": "Task deleted"}