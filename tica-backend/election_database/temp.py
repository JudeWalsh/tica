import pandas as pd

# Load the CSV file
data = pd.read_csv('StateElectionStatus.csv')

# Remove '%' from all columns
for column in data.columns:
    if data[column].dtype == object:  # Check if the column contains strings
        data[column] = data[column].str.replace('%', '', regex=False)

# Save the updated CSV file
data.to_csv('StateElectionStatus.csv', index=False)

print("All '%' signs have been removed and the updated file is saved as 'StateElectionStatus.csv'.")
