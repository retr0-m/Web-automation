import uiautomator2 as u2
from time import sleep
from log import log

def init():
    d = u2.connect()   
    print("="*50)
    print(d.info) 
    print("="*50)
    return d
    

def click_on_element_by_text(d,e):
    el = d(text=e) 
    x, y = el.center()
    d.click(x, y)

# Obsolete
def create_gmail_acc(d):
    log("Initializing sequence for Google Account creation")
    #kill prev sess
    try:
        d.app_stop("com.google.android.gm")
    except:
        pass
    
    d.app_start("com.google.android.gm")
    sleep(1.5)
    width, height = d.window_size()
    d.click(width - 50, 100)  #profile
    

    click_on_element_by_text(d,"Add another account")
    sleep(1)
    click_on_element_by_text(d,"Google")
    sleep(0.1)
    click_on_element_by_text(d,"Create account")
    sleep(0.1)
    click_on_element_by_text(d,"For my personal use")
    sleep(0.1)
    click_on_element_by_text(d,"First name")
    d.send_keys("Marco")
    sleep(0.1)
    click_on_element_by_text(d,"Last name (optional)")
    d.send_keys("Capocchia")
    click_on_element_by_text(d,"NEXT")
    sleep(3)

def create_lugapoints_acc(d):
    log("Initializing sequence for Lugapoints Account creation")
    #kill prev sess
    try:
        d.app_stop("com.lugapoints.android")
    except:
        pass
    d.app_start("ch.mylugano.app")
    sleep(1)
    click_on_element_by_text(d,"Signup")
    log(d.dump_hierarchy())


def main():
    d=init()
    # create_gmail_acc(d)
    create_lugapoints_acc(d)
    
    
if __name__ == "__main__":
    main()