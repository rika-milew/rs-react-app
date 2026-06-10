# Performance

## Initial Profiling

### 1. Sorting Countries

**Sorting by name ascending:**
![Screenshot](src/assets/image-2.png)

- Commit duration: 1.1 ms
- Render duration: 443.9 ms
- Flame chart:
![Flame chart](src/assets/image-3.png)

**Sorting by name descending:**

![Screenshot](src/assets/image.png)

- Commit duration: 1.5 ms
- Render duration: 477.8 ms
- Flame chart:
![Flame chart](src/assets/image-1.png)

**Sorting by population ascending:**
![Screenshot](src/assets/image-4.png)

- Commit duration: 1.9 ms
- Render duration: 519.8 ms
- Flame chart:
![Flame chart](src/assets/image-5.png)

**Sorting by population descending:**
![Screenshot](src/assets/image-6.png)

- Commit duration: 1 ms
- Render duration: 491.5 ms
- Flame chart:
![Flame chart](src/assets/image-7.png)

### 2. Searching for a country
![Screenshot](src/assets/image-9.png)
- Commit duration: 1.3 ms
- Render duration: 282.4 ms
- Flame chart:
![Flame chart](src/assets/image-10.png)

### 3. Selecting a different year
![Screenshot](src/assets/image-11.png)
- Commit duration: 2.8 ms
- Render duration: 546.9 ms
- Flame chart:
![Flame chart](src/assets/image-12.png)

### 4. Toggling columns
![Screenshot](src/assets/image-13.png)

- Commit duration: 1.1 ms
- Render duration: 469.2 ms
- Flame chart:
![Flame chart](src/assets/image-14.png)