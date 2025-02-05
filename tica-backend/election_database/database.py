from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.types import Float

# SQLite election_database URL
DATABASE_URL = "sqlite:///./elections.db"

# SQLAlchemy setup
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Define election_database models
class HouseElection(Base):
    __tablename__ = "HouseElections"
    year = Column(Integer, primary_key=True, unique=True, index=True)
    democrats = Column(Integer)
    republicans = Column(Integer)
    independents = Column(Integer)
    republican_percentile = Column(Float)
    democrat_percentile = Column(Float)

class SenateElection(Base):
    __tablename__ = "SenateElections"
    year = Column(Integer, primary_key=True, unique=True, index=True)
    democrats = Column(Integer)
    republicans = Column(Integer)
    independents = Column(Integer)
    republican_percentile = Column(Float)
    democrat_percentile = Column(Float)


class StateElectionStatus(Base):
    __tablename__ = "StateElectionStatus"
    id = Column(Integer, primary_key=True, autoincrement=True)
    year = Column(Integer, ForeignKey('PresidentialElections.year'), nullable=False)
    state = Column(String, nullable=False)
    state_pos = Column(String, nullable=False)
    state_status = Column(String(10), nullable=False)
    total_votes = Column(Integer, nullable=False)
    blue_votes = Column(Integer, nullable=False)
    blue_percentage = Column(Float, nullable=False)
    blue_ev = Column(Integer, nullable=False)
    red_votes = Column(Integer, nullable=False)
    red_percentage = Column(Float, nullable=False)
    red_ev = Column(Integer, nullable=False)
    yellow_votes = Column(Integer, nullable=False)
    yellow_percentage = Column(Float, nullable=False)
    yellow_ev = Column(Integer, nullable=False)


class KeyIssue(Base):
    __tablename__ = "KeyIssues"
    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, ForeignKey('PresidentialElections.year'), nullable=False)
    issue = Column(String, nullable=False)

class PresidentialElection(Base):
    __tablename__ = "PresidentialElections"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer, unique=True, index=True)
    winning_party = Column(String(1))
    winner = Column(String)
    runnerUp = Column(String)
    blue_votes = Column(Integer)
    red_votes = Column(Integer)
    blue_candidate = Column(String)
    red_candidate = Column(String)
    electoral_college_votes_winner = Column(Integer)
    electoral_college_votes_runnerUp = Column(Integer)
    total_votes_winner = Column(Integer)
    total_votes_runnerUp = Column(Integer)


# Create tables
def init_db():
    Base.metadata.create_all(bind=engine)

# Dependency for FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Entry point to create the election_database
if __name__ == "__main__":
    init_db()
    print("Database initialized successfully!")
