from PIL import Image

def tight_crop(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    
    # Get pixel data
    pixels = img.load()
    width, height = img.size
    
    min_x, min_y = width, height
    max_x, max_y = 0, 0
    
    # Find bounding box of non-white, non-transparent pixels
    for y in range(height):
        for x in range(width):
            r, g, b, a = pixels[x, y]
            # Consider a pixel "content" if it's not nearly white AND not nearly transparent
            if a > 20 and not (r > 235 and g > 235 and b > 235):
                if x < min_x: min_x = x
                if x > max_x: max_x = x
                if y < min_y: min_y = y
                if y > max_y: max_y = y

    # Add a tiny padding (2% of size)
    pad = int(min(max_x - min_x, max_y - min_y) * 0.05)
    min_x = max(0, min_x - pad)
    min_y = max(0, min_y - pad)
    max_x = min(width, max_x + pad)
    max_y = min(height, max_y + pad)

    cropped = img.crop((min_x, min_y, max_x, max_y))
    
    # Make it square
    w, h = cropped.size
    side = max(w, h)
    square = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    square.paste(cropped, ((side - w) // 2, (side - h) // 2))
    
    square.save(output_path, format="PNG")
    print(f"Done! Saved to {output_path}, size: {square.size}")

tight_crop("src/app/icon.png", "src/app/icon.png")
