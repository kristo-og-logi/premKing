import json

# Initialize an empty list to hold all objects from the 'data' attributes
all_objects = []

# Loop through each file to read and extract the 'data' attribute
for page in range(1, 9):
    # Open and read the JSON file
    with open(f'page_{page}.json', 'r') as file:
        # Load the JSON data from file
        json_data = json.load(file)
        
        # Extract the 'data' list and extend it to our main list
        all_objects.extend(json_data['data'])

# Now save this combined list to a new JSON file
with open('combined_data.json', 'w') as output_file:
    json.dump(all_objects, output_file)

print("Successfully combined the data into combined_data.json")
