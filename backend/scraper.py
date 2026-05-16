import requests
from datetime import datetime
import json
import schemas

def sync_codeforces(db_session):
    try:
        response = requests.get("https://codeforces.com/api/contest.list?gym=false")
        data = response.json()
        if data["status"] == "OK":
            contests = data["result"]
            # Get upcoming contests (phase = 'BEFORE')
            upcoming = [c for c in contests if c.get("phase") == "BEFORE"]
            
            for c in upcoming:
                start_time = datetime.fromtimestamp(c["startTimeSeconds"]).strftime("%b %d, %Y %H:%M")
                duration_hours = c["durationSeconds"] // 3600
                duration_minutes = (c["durationSeconds"] % 3600) // 60
                duration = f"{duration_hours}h {duration_minutes:02d}m"
                link = f"https://codeforces.com/contests/{c['id']}"
                
                existing = db_session.query(schemas.ContestDB).filter_by(link=link).first()
                if not existing:
                    new_contest = schemas.ContestDB(
                        platform="Codeforces",
                        title=c["name"],
                        start_time=start_time,
                        duration=duration,
                        link=link
                    )
                    db_session.add(new_contest)
            db_session.commit()
    except Exception as e:
        print(f"Error syncing Codeforces: {e}")

def sync_leetcode(db_session):
    # LeetCode GraphQL query for upcoming contests
    url = "https://leetcode.com/graphql"
    query = """
    {
      allContests {
        title
        titleSlug
        startTime
        duration
      }
    }
    """
    try:
        response = requests.post(url, json={"query": query})
        data = response.json()
        if "data" in data and "allContests" in data["data"]:
            contests = data["data"]["allContests"]
            now = datetime.now().timestamp()
            
            for c in contests:
                if c["startTime"] > now:
                    start_time = datetime.fromtimestamp(c["startTime"]).strftime("%b %d, %Y %H:%M")
                    duration_hours = int(c["duration"]) // 3600
                    duration_minutes = (int(c["duration"]) % 3600) // 60
                    duration = f"{duration_hours}h {duration_minutes:02d}m"
                    link = f"https://leetcode.com/contest/{c['titleSlug']}"
                    
                    existing = db_session.query(schemas.ContestDB).filter_by(link=link).first()
                    if not existing:
                        new_contest = schemas.ContestDB(
                            platform="LeetCode",
                            title=c["title"],
                            start_time=start_time,
                            duration=duration,
                            link=link
                        )
                        db_session.add(new_contest)
            db_session.commit()
    except Exception as e:
        print(f"Error syncing LeetCode: {e}")

def seed_mock_data(db_session):
    # If DB is completely empty, insert some mock data
    if db_session.query(schemas.ContestDB).count() == 0:
        mocks = [
            {
                "platform": "CodeChef",
                "title": "Starters 134 (Rated for All)",
                "start_time": "May 15, 2024 20:00",
                "duration": "2h 00m",
                "link": "https://www.codechef.com/START134"
            },
            {
                "platform": "AtCoder",
                "title": "AtCoder Beginner Contest 354",
                "start_time": "May 18, 2024 17:30",
                "duration": "1h 40m",
                "link": "https://atcoder.jp/contests/abc354"
            },
            {
                "platform": "HackerRank",
                "title": "ProjectEuler+",
                "start_time": "May 20, 2024 00:00",
                "duration": "24h 00m",
                "link": "https://www.hackerrank.com/contests/projecteuler"
            }
        ]
        for m in mocks:
            new_contest = schemas.ContestDB(**m)
            db_session.add(new_contest)
        db_session.commit()

def sync_all():
    db = schemas.SessionLocal()
    try:
        sync_codeforces(db)
        sync_leetcode(db)
        seed_mock_data(db)
    finally:
        db.close()
