from rembg import new_session
import time

print("Testing standard u2net session...")
t0 = time.time()
s = new_session("u2net")
print(f"u2net session ready in {time.time() - t0:.2f}s!")
