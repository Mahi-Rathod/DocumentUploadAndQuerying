import requests

def download_document(presigned_url, fileName):
    try:
        save_path = 'Documents/'+fileName
        # Send GET request to the presigned URL
        response = requests.get(presigned_url)
        print(response.content)
        if response.status_code == 200:
            with open(save_path, 'wb') as f:
                f.write(response.content)
        else:
            print(f"Failed to download document. Status code: {response.status_code}")
    except Exception as e:
        print(f"Error: {e}")

