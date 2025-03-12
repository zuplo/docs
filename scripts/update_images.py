import os
import re
import requests

# Downloads any images in markdown files that are on the CDN and moves them to
# the public/media directory

def download_image(url, save_path):
    os.makedirs(os.path.dirname(save_path), exist_ok=True)
    response = requests.get(url)
    if response.status_code == 200:
        with open(save_path, 'wb') as file:
            file.write(response.content)
        print(f"Downloaded {url} to {save_path}")
    else:
        print(f"Failed to download {url}")

def update_markdown_file(file_path, image_url, new_image_path):
    with open(file_path, 'r') as file:
        content = file.read()

    updated_content = content.replace(image_url, new_image_path)

    with open(file_path, 'w') as file:
        file.write(updated_content)
    print(f"Updated {file_path} with new image path {new_image_path}")

def process_markdown_files(root_dir):
    articles_dir = os.path.join(root_dir, 'docs')
    
    for subdir, _, files in os.walk(articles_dir):
        for file in files:
            if file.endswith(('.md', '.mdx')):
                file_path = os.path.join(subdir, file)
                
                # Get the article name without extension (foo.md -> foo)
                article_name = os.path.splitext(os.path.basename(file_path))[0]
                
                with open(file_path, 'r') as f:
                    content = f.read()
                    image_urls = re.findall(r'!\[.*?\]\((https://cdn\.zuplo\.com/.*?)\)', content)
                    
                    for image_url in image_urls:
                        # Create the directory structure at project root: /public/media/foo/
                        new_image_dir = os.path.join(root_dir, 'public', 'media', article_name)
                        
                        # Full path to save the image
                        new_image_path = os.path.join(new_image_dir, os.path.basename(image_url))
                        
                        # Download the image
                        download_image(image_url, new_image_path)
                        
                        # Calculate the relative path for the markdown file
                        new_image_path_relative = os.path.join('..', '..', 'public', 'media', 
                                                            article_name, 
                                                            os.path.basename(image_url))
                        
                        # Update the markdown file
                        update_markdown_file(file_path, image_url, new_image_path_relative)

if __name__ == "__main__":
    docs_dir = os.getcwd()
    process_markdown_files(docs_dir)
