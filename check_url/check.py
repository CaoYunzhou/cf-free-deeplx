import requests
import json
from time import sleep

def check_url(url: str, max_retries=5):
    payload = json.dumps({
        "text": "hello world",
        "source_lang": "EN",
        "target_lang": "ZH"
    })
    headers = {
        'Content-Type': 'application/json'
    }

    for attempt in range(1, max_retries + 1):
        try:
            requests_url = url + "/translate"
            response = requests.request("POST", url=requests_url, headers=headers, data=payload, verify=True)
            response.raise_for_status()  # Raise HTTPError for bad responses
            response_json = response.json()
            print(url,response_json)
            return response_json
        except Exception as e:
            print(f"Error for URL {url} (Attempt {attempt}/{max_retries}): {e}")
            if attempt < max_retries:
                sleep(1)  # Sleep for 1 second before retrying

    print(f"All {max_retries} attempts failed. Defaulting to failure.")
    return {'code': None, 'data': None}  # Default values


def process_urls(input_file, success_file):
    unique_urls = set()  # Set to store unique URLs
    success_results = []  # List to store results

    # Load existing success URLs from the success_file
    try:
        with open(success_file, 'r') as existing_file:
            existing_urls = {line.strip() for line in existing_file}
        unique_urls.update(existing_urls)
    except FileNotFoundError:
        pass  # Ignore if the file doesn't exist yet

    with open(input_file, 'r') as file:
        urls = file.readlines()

    for url in urls:
        url = url.strip()
        result = check_url(url)
        if url not in unique_urls and result.get('code') == 200 and '世界' in result.get('data', ''):
            unique_urls.add(url)
            with open(success_file, 'a') as valid_file:
                valid_file.write(url + '\n')

            success_results.append(url)  # Append result to the list


def list_file(input_file, output_file):
    with open(input_file, 'r') as input_file_content:
        lines = input_file_content.readlines()

    flattened_lines = ','.join(line.strip() for line in lines)

    with open(output_file, 'w') as result_file:
        result_file.write(flattened_lines)

process_urls('input.txt', 'success.txt')
list_file('success.txt', 'success_result.txt')

