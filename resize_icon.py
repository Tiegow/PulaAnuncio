import os
from PIL import Image

def main():
    source_image = r"C:\Users\thiag\.gemini\antigravity\brain\29eac064-1470-4ccd-b511-95e1dd5af617\app_icon_1780340736184.png"
    res_dir = r"C:\Users\thiag\Desktop\Arquivos\ProjetosReact\Pulanuncio\PulaAnuncio\android\app\src\main\res"

    sizes = {
        "mipmap-mdpi": 48,
        "mipmap-hdpi": 72,
        "mipmap-xhdpi": 96,
        "mipmap-xxhdpi": 144,
        "mipmap-xxxhdpi": 192
    }

    try:
        img = Image.open(source_image)
        # Convert to RGBA just in case
        img = img.convert("RGBA")

        for folder, size in sizes.items():
            target_folder = os.path.join(res_dir, folder)
            if not os.path.exists(target_folder):
                os.makedirs(target_folder)
            
            resized = img.resize((size, size), Image.Resampling.LANCZOS)
            
            # Save standard icon
            resized.save(os.path.join(target_folder, "ic_launcher.png"))
            
            # Save round icon (same image for now since it's flat design)
            # Alternatively we could crop it into a circle, but square is fine.
            resized.save(os.path.join(target_folder, "ic_launcher_round.png"))
            
            print(f"Generated {size}x{size} in {folder}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    main()
