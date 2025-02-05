import pandas as pd
from sqlalchemy.orm import Session
from database import engine, HouseElection, SenateElection, PresidentialElection, StateElectionStatus, KeyIssue
import numpy as np

# Function to insert data from CSV
def insert_data_from_csv():
    # Create a session
    with Session(engine) as session:

        # Clear existing data
        session.query(HouseElection).delete()
        session.query(SenateElection).delete()
        session.query(PresidentialElection).delete()
        session.query(StateElectionStatus).delete()
        session.query(KeyIssue).delete()

        # Load and insert HouseElections data
        house_data = pd.read_csv("HouseElections.csv", encoding="utf-8")
        house_data['r_percentile'] = house_data['republicans'].rank(ascending=False).astype(int)
        house_data['d_percentile'] = house_data['democrats'].rank(ascending=False).astype(int)
        for _, row in house_data.iterrows():
            house_election = HouseElection(
                year=int(row["year"]),
                democrats=int(row['democrats']),
                republicans=int(row['republicans']),
                independents=int(row['independents']),
                republican_percentile=row["r_percentile"],
                democrat_percentile=row["d_percentile"],
            )
            session.add(house_election)

        # Load and insert SenateElections data
        senate_data = pd.read_csv("SenateElections.csv", encoding="utf-8")
        senate_data['r_percentile'] = senate_data['republicans'].rank(ascending=False).astype(int)
        senate_data['d_percentile'] = senate_data['democrats'].rank(ascending=False).astype(int)
        print(senate_data.head())  # Debug print to check data structure

        for _, row in senate_data.iterrows():
            senate_election = SenateElection(
                year=int(row["year"]),
                democrats=int(row['democrats']),
                republicans=int(row['republicans']),
                independents=int(row['independents']),
                republican_percentile=row["r_percentile"],
                democrat_percentile=row["d_percentile"],
            )
            session.add(senate_election)

        state_status_data = pd.read_csv("StateElectionStatus.csv", encoding="utf-8")
        print(state_status_data.head())
        for _, row in state_status_data.iterrows():
            state_status = StateElectionStatus(
                year=int(row["year"]),
                state=row["STATE"],
                state_pos=row["STATE_POS"],
                state_status=row["status"],
                total_votes=int(row["TOTAL VOTES"]),
                blue_votes=int(row["BLUE_VOTES"]),
                blue_percentage=row["BLUE_PERCENT"],
                blue_ev=int(row["BLUE_EV"]),
                red_votes=int(row["RED_VOTES"]),
                red_percentage=row["RED_PERCENT"],
                red_ev=int(row["RED_EV"]),
                yellow_votes=int(row["YELLOW_VOTES"]),
                yellow_percentage=row["YELLOW_PERCENT"],
                yellow_ev=int(row["YELLOW_EV"]),
            )
            session.add(state_status)

        key_issue_data = pd.read_csv("KeyIssues.csv", encoding="utf-8")
        print(key_issue_data.head())
        for _, row in key_issue_data.iterrows():
            key_issue = KeyIssue(
                year=int(row["year"]),
                issue=row["issue"],
            )
            session.add(key_issue)

        # Load and insert PresidentialElections data
        presidential_data = pd.read_csv("PresidentialElections.csv", encoding="utf-8")
        print(presidential_data.head())  # Debug print to check data structure
        presidential_data['blue_votes'] = np.where(
            presidential_data['winning_party'] == 'D',
            presidential_data['electoral_college_votes_winner'],
            presidential_data['electoral_college_votes_runnerUp']
        )

        presidential_data['red_votes'] = np.where(
            presidential_data['winning_party'] == 'R',
            presidential_data['electoral_college_votes_winner'],
            presidential_data['electoral_college_votes_runnerUp']
        )

        presidential_data['blue_candidate'] = np.where(
            presidential_data['winning_party'] == 'D',
            presidential_data['winner'],
            presidential_data['runnerUp']
        )

        presidential_data['red_candidate'] = np.where(
            presidential_data['winning_party'] == 'R',
            presidential_data['winner'],
            presidential_data['runnerUp']
        )

        for _, row in presidential_data.iterrows():
            # Create and insert PresidentialElection record
            presidential_election = PresidentialElection(
                year=int(row["year"]),  # Convert np.int64 to int
                winning_party=row["winning_party"],
                winner=row["winner"],
                runnerUp=row["runnerUp"],
                blue_candidate=row["blue_candidate"],
                red_candidate=row["red_candidate"],
                blue_votes=int(row["blue_votes"]),
                red_votes=int(row["red_votes"]),
                electoral_college_votes_winner=int(str(row["electoral_college_votes_winner"]).replace(",", "")),  # Remove commas and convert to int
                electoral_college_votes_runnerUp=int(str(row["electoral_college_votes_runnerUp"]).replace(",", "")),  # Remove commas and convert to int
                total_votes_winner=int(str(row["total_votes_winner"]).replace(",", "")),  # Remove commas and convert to int
                total_votes_runnerUp=int(str(row["total_votes_runnerUp"]).replace(",", "")),  # Remove commas and convert to int
            )
            session.add(presidential_election)

        # Commit the transaction
        session.commit()
        print("Data inserted successfully!")


if __name__ == "__main__":
    insert_data_from_csv()
