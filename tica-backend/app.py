from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3
from typing import List, Optional
import pandas as pd

app = FastAPI()

# CORS settings
origins = [
    "http://localhost:3000",  # Allow requests from the frontend (React app)
    "http://127.0.0.1:3000", # If you use 127.0.0.1 for your frontend
    # You can add more allowed origins if needed
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allows specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)


# Define a Pydantic model for the API response
class ElectionResponse(BaseModel):
    year: int
    presidential_year: int
    candidate: str
    opponent: str
    blue_candidate: str
    red_candidate: str
    blue_votes: int
    red_votes: int
    yellow_votes: int
    electoral_votes_winner: int
    electoral_votes_runnerUp: int
    total_votes_winner: int
    total_votes_runnerUp: int
    blue_states: List[str]
    red_states: List[str]
    yellow_states: List[str]
    key_issues: List[str]
    dem_senators: int
    rep_senators: int
    ind_senators: int
    dem_reps: int
    rep_reps: int
    ind_reps: int


# Function to connect to the SQLite election_database
def get_db_connection():
    conn = sqlite3.connect("election_database/elections.db")
    conn.row_factory = sqlite3.Row  # Access columns by name
    return conn


# Endpoint to get election results by year
@app.get("/elections/{year}", response_model=ElectionResponse)
def get_election_by_year(year: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Query PresidentialElections
    cursor.execute("SELECT * FROM PresidentialElections WHERE year = ?", (year,))
    president_data = cursor.fetchone()

    # If no presidential data for the year, fetch for `year - 2` (most recent presidential election)
    if not president_data:
        presidential_year = year - 2
        cursor.execute("SELECT * FROM PresidentialElections WHERE year = ?", (presidential_year,))
        president_data = cursor.fetchone()

        if not president_data:
            raise HTTPException(status_code=404, detail=f"No data found for year {year} or {year - 2}.")
    else:
        presidential_year = year

    # Query StateElectionStatus for blue, red, and yellow states
    cursor.execute("SELECT state, state_status FROM StateElectionStatus WHERE year = ?", (presidential_year,))
    state_status_data = cursor.fetchall()

    # Parse state statuses
    blue_states = [row["state"] for row in state_status_data if row["state_status"] == "blue"]
    red_states = [row["state"] for row in state_status_data if row["state_status"] == "red"]
    yellow_states = [row["state"] for row in state_status_data if row["state_status"] == "yellow"]

    # Query KeyIssues for the presidential election year
    cursor.execute("SELECT issue FROM KeyIssues WHERE year = ?", (presidential_year,))
    key_issues_data = cursor.fetchall()
    key_issues = [row["issue"] for row in key_issues_data]

    # Query SenateElections
    cursor.execute("SELECT * FROM SenateElections WHERE year = ?", (year,))
    senate_data = cursor.fetchone()

    # Query HouseElections
    cursor.execute("SELECT * FROM HouseElections WHERE year = ?", (year,))
    house_data = cursor.fetchone()

    # Build the response with default values for missing data
    election_data = ElectionResponse(
        year=year,
        presidential_year=presidential_year,
        candidate=president_data["winner"],
        opponent=president_data["runnerUp"],
        blue_candidate=president_data["blue_candidate"],
        red_candidate=president_data["red_candidate"],
        blue_votes=president_data['blue_votes'],
        red_votes=president_data['red_votes'],
        yellow_votes=0,
        electoral_votes_winner=president_data["electoral_college_votes_winner"],
        electoral_votes_runnerUp=president_data["electoral_college_votes_runnerUp"],
        total_votes_winner=president_data["total_votes_winner"],
        total_votes_runnerUp=president_data["total_votes_runnerUp"],
        blue_states=blue_states,
        red_states=red_states,
        yellow_states=yellow_states,
        key_issues=key_issues,
        dem_senators=senate_data["democrats"] if senate_data else 0,
        rep_senators=senate_data["republicans"] if senate_data else 0,
        ind_senators=senate_data["independents"] if senate_data else 0,
        dem_reps=house_data["democrats"] if house_data else 0,
        rep_reps=house_data["republicans"] if house_data else 0,
        ind_reps=house_data["independents"] if house_data else 0,
    )

    conn.close()
    return election_data

@app.get("/election_years")
def get_all_years():
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT year FROM SenateElections ORDER BY year ASC")
    years = [row["year"] for row in cursor.fetchall()]

    conn.close()
    return {"years": years}

@app.get("/house_analytics/{year}")
def get_house_analytics(year: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Execute the query
    cursor.execute("SELECT * FROM HouseElections")

    # Fetch all rows
    house_data = cursor.fetchall()

    # Get column names from the cursor
    column_names = [desc[0] for desc in cursor.description]

    # Convert to pandas DataFrame
    house_df = pd.DataFrame(house_data, columns=column_names)
    house_df['party_control'] = house_df.apply(
        lambda row: 'R' if row['republicans'] > row['democrats']
        else 'D' if row['democrats'] > row['republicans']
        else 'T',
        axis=1
    )
    average_r_reps = round(house_df['republicans'].mean(), 1)
    average_d_reps = round(house_df['democrats'].mean(), 1)

    house_df['d_percentile_r_senate'] = (
        house_df.loc[house_df['party_control'] == 'R', 'democrats'].rank(ascending=False)
    )

    house_df['r_percentile_r_senate'] = (
        house_df.loc[house_df['party_control'] == 'R', 'republicans'].rank(ascending=False)
    )

    house_df['d_percentile_d_senate'] = (
        house_df.loc[house_df['party_control'] == 'D', 'democrats'].rank(ascending=False)
    )

    house_df['r_percentile_d_senate'] = (
        house_df.loc[house_df['party_control'] == 'D', 'republicans'].rank(ascending=False)
    )

    yearly_df = house_df[house_df['year'] == year]

    if int(yearly_df['republicans']) > int(yearly_df['democrats']):
        control = "Republican"
        control_percent = round((house_df['party_control'] == 'R').mean() * 100, 1)
        d_percentile_control = float(yearly_df["d_percentile_r_senate"])
        r_percentile_control = float(yearly_df["r_percentile_r_senate"])
    elif int(yearly_df['democrats']) > int(yearly_df['republicans']):
        control = "Democratic"
        control_percent = round((house_df['party_control'] == 'D').mean() * 100, 1)
        d_percentile_control = float(yearly_df["d_percentile_d_senate"])
        r_percentile_control = float(yearly_df["r_percentile_d_senate"])
    else:
        control = "Tie"
        control_percent = round((house_df['party_control'] == 'D').mean() * 100, 1)
        d_percentile_control = 100.0
        r_percentile_control = 100.0

    results = {
        "republicans": int(yearly_df["republicans"]),
        "democrats": int(yearly_df["democrats"]),
        "independents": int(yearly_df["independents"]),
        "analytics": {
            "control": control,
            "control_percent": control_percent,
            "average_r_reps": average_r_reps,
            "average_d_reps": average_d_reps,
            "partyRankings": {
                "democratic_percentile": float(yearly_df["democrat_percentile"]),
                "republican_percentile": float(yearly_df["republican_percentile"]),
            },
            "partyRankings_control": {
                "democratic_percentile": d_percentile_control,
                "republican_percentile": r_percentile_control,
            }
        },
    }

    conn.close()
    return results

@app.get("/senate_analytics/{year}")
def get_senate_analytics(year: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    # Execute the query
    cursor.execute("SELECT * FROM SenateElections")

    # Fetch all rows
    senate_data = cursor.fetchall()

    # Get column names from the cursor
    column_names = [desc[0] for desc in cursor.description]

    # Convert to pandas DataFrame
    senate_df = pd.DataFrame(senate_data, columns=column_names)
    senate_df['party_control'] = senate_df.apply(
        lambda row: 'R' if row['republicans'] > row['democrats']
        else 'D' if row['democrats'] > row['republicans']
        else 'T',
        axis=1
    )
    average_r_senators = round(senate_df['republicans'].mean(), 1)
    average_d_senators = round(senate_df['democrats'].mean(), 1)

    senate_df['d_percentile_r_senate'] = (
        senate_df.loc[senate_df['party_control'] == 'R', 'democrats'].rank(ascending=False)
    )

    senate_df['r_percentile_r_senate'] = (
        senate_df.loc[senate_df['party_control'] == 'R', 'republicans'].rank(ascending=False)
    )

    senate_df['d_percentile_d_senate'] = (
        senate_df.loc[senate_df['party_control'] == 'D', 'democrats'].rank(ascending=False)
    )

    senate_df['r_percentile_d_senate'] = (
        senate_df.loc[senate_df['party_control'] == 'D', 'republicans'].rank(ascending=False)
    )

    yearly_df = senate_df[senate_df['year'] == year]

    if int(yearly_df['republicans']) > int(yearly_df['democrats']):
        control = "Republican"
        control_percent = round((senate_df['party_control'] == 'R').mean() * 100, 1)
        d_percentile_control = float(yearly_df["d_percentile_r_senate"])
        r_percentile_control = float(yearly_df["r_percentile_r_senate"])
    elif int(yearly_df['democrats']) > int(yearly_df['republicans']):
        control = "Democratic"
        control_percent = round((senate_df['party_control'] == 'D').mean() * 100, 1)
        d_percentile_control = float(yearly_df["d_percentile_d_senate"])
        r_percentile_control = float(yearly_df["r_percentile_d_senate"])
    else:
        control = "Bipartisan"
        control_percent = round((senate_df['party_control'] == 'T').mean() * 100, 1)
        d_percentile_control = '--'
        r_percentile_control = '--'

    results = {
        "republicans": int(yearly_df["republicans"]),
        "democrats": int(yearly_df["democrats"]),
        "independents": int(yearly_df["independents"]),
        "analytics": {
            "control": control,
            "control_percent": control_percent,
            "average_r_senators": average_r_senators,
            "average_d_senators": average_d_senators,
            "partyRankings": {
                "democratic_percentile": float(yearly_df["democrat_percentile"]),
                "republican_percentile": float(yearly_df["republican_percentile"]),
            },
            "partyRankings_control": {
                "democratic_percentile": d_percentile_control,
                "republican_percentile": r_percentile_control,
            }
        },
    }

    conn.close()
    return results

@app.get("/president_analytics/{year}")
def get_president_analytics(year: int):
    try:
        conn = get_db_connection()
        cursor = conn.cursor()

        cursor.execute("SELECT * FROM PresidentialElections ")

        president_data = cursor.fetchall()

        column_names = [desc[0] for desc in cursor.description]

        # Convert to pandas DataFrame
        president_df = pd.DataFrame(president_data, columns=column_names)

        if year not in president_df['year'].values:
            year -= 2
        yearly_df = president_df[president_df['year'] == year]
        control = yearly_df['winning_party'].iloc[0]

        red_votes = int(yearly_df['red_votes'].iloc[0])
        blue_votes = int(yearly_df['blue_votes'].iloc[0])

        republican_percent = (president_df['winning_party'] == 'R').mean() * 100
        democrat_percent = (president_df['winning_party'] == 'D').mean() * 100

        average_r_electoral_votes = president_df["red_votes"].mean()
        average_d_electoral_votes = president_df["blue_votes"].mean()

        if control == "R":
            winner = "Republican"
        else:
            winner = "Democratic"

        average_r_winner_votes = president_df[president_df['winning_party'] == 'R']['red_votes'].mean()
        average_r_loser_votes = president_df[president_df['winning_party'] == 'D']['red_votes'].mean()

        cursor.execute("SELECT state, state_status FROM StateElectionStatus WHERE year = ?", (year,))
        state_status_data = cursor.fetchall()

        # Parse state statuses
        blue_states = [row["state"] for row in state_status_data if row["state_status"] == "blue"]
        red_states = [row["state"] for row in state_status_data if row["state_status"] == "red"]
        yellow_states = [row["state"] for row in state_status_data if row["state_status"] == "yellow"]



        results = {
            "analytics": {
                "winner": winner,
                "presidential_year": year,
                "republican_percent": republican_percent,
                "democrat_percent": democrat_percent,
                "average_r_electoral_votes": average_r_electoral_votes,
                "average_d_electoral_votes": average_d_electoral_votes,
                "average_r_winner_votes": average_r_winner_votes,
                "average_r_loser_votes": average_r_loser_votes,
                "red_votes": red_votes,
                "blue_votes": blue_votes,
                "yellow_votes": 0
            },
            "blue_states": blue_states,
            "red_states": red_states,
            "yellow_states": yellow_states,
        }

        return results
    except Exception as e:
        return {'error': str(e)}

@app.get("/state_analytics/{state}/{year}")
def get_state_analytics(state: str, year: int):
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT * FROM StateElectionStatus WHERE state_pos = ?", (state,))

    state_data = cursor.fetchall()
    column_names = [desc[0] for desc in cursor.description]

    # Convert to pandas DataFrame
    state_df = pd.DataFrame(state_data, columns=column_names)
    if year not in state_df['year'].values:
        year -= 2
    yearly_df = state_df[state_df['year'] == year]

    blue_percent = state_df["blue_percentage"].mean()
    red_percent = state_df["red_percentage"].mean()
    distribution = state_df['state_status'].value_counts(normalize=True) * 100

    return {
        "BluePercent": blue_percent,
        "RedPercent": red_percent,
        "Distribution": distribution,
        "yearly_df": {
            "BluePercent": yearly_df['blue_percentage'].iloc[0],
            "RedPercent": yearly_df['red_percentage'].iloc[0],
            "StateStatus": yearly_df['state_status'].iloc[0],
        }
    }