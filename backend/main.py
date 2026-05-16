from fastapi import FastAPI, Depends, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import schemas
import scraper
import asyncio

app = FastAPI(title="Contest Tracker API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = schemas.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/contests", response_model=List[schemas.Contest])
def read_contests(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    contests = db.query(schemas.ContestDB).offset(skip).limit(limit).all()
    # If empty, let's sync
    if not contests:
        scraper.sync_all()
        contests = db.query(schemas.ContestDB).offset(skip).limit(limit).all()
    return contests

@app.post("/contests/sync")
def sync_contests():
    scraper.sync_all()
    return {"message": "Sync triggered successfully"}

@app.post("/bookmarks/{contest_id}")
def toggle_bookmark(contest_id: int, db: Session = Depends(get_db)):
    contest = db.query(schemas.ContestDB).filter(schemas.ContestDB.id == contest_id).first()
    if not contest:
        raise HTTPException(status_code=404, detail="Contest not found")
    
    # Toggle
    contest.is_bookmarked = 0 if contest.is_bookmarked else 1
    db.commit()
    
    # Return updated contest
    db.refresh(contest)
    return contest

@app.post("/chat")
async def chat_endpoint(payload: dict = Body(...)):
    message = payload.get("message", "").lower()
    
    # Simulated AI response
    await asyncio.sleep(1) # Simulate think time
    
    response = "I'm your AI Contest Assistant! "
    
    if "hello" in message or "hi" in message:
        response += "Hello there! Ask me about upcoming contests."
    elif "codeforces" in message:
        response += "Codeforces usually has Div 2 and Div 3 rounds weekly. You can check the upcoming rounds in the dashboard!"
    elif "leetcode" in message:
        response += "LeetCode hosts Weekly Contests every Sunday and Biweekly Contests every other Saturday."
    elif "schedule" in message or "upcoming" in message:
        response += "There are a lot of contests upcoming! Take a look at the dashboard and filter by your favorite platforms."
    else:
        response += "I can help you keep track of your programming contests. (Simulated Response Mode)"
        
    return {"reply": response}
