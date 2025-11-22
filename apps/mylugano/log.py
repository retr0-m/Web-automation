from datetime import datetime
def log(*msg):
    with open("./log.txt", "w") as f:
        for m in msg:
            f.write(f"{datetime.now()}\t{m}\n")
