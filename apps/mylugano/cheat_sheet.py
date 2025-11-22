import uiautomator2 as u2
d = u2.connect()   # connect to emulator
print(d.info)


d.click(300, 800)

d.swipe(500, 1500, 500, 300, 0.2)

d.send_keys("hello world")

d.screenshot("screen.png")

d.app_start("com.android.settings")

d.app_stop("com.android.settings")

d.app_clear("com.android.settings")

d.app_wait("com.android.settings")

d.dump_hierarchy()
#This gives you all buttons, text fields, ids — perfect for automation.
