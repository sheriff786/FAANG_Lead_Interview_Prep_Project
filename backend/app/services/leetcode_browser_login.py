"""
LeetCode Browser Login — Opens a real browser for Google/GitHub SSO login,
then automatically captures the LEETCODE_SESSION cookie.

Runs Playwright in a subprocess to avoid event-loop conflicts with uvicorn.
"""

import asyncio
import json
import subprocess
import sys
import os
import tempfile

# Script that runs in a separate Python process
_LOGIN_SCRIPT = r'''
import json, sys, time
from playwright.sync_api import sync_playwright

timeout_seconds = int(sys.argv[1]) if len(sys.argv) > 1 else 120

pw = sync_playwright().start()
try:
    browser = pw.chromium.launch(headless=False, args=["--start-maximized"])
    ctx = browser.new_context(
        viewport={"width": 1280, "height": 900},
        user_agent=(
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
            "AppleWebKit/537.36 (KHTML, like Gecko) "
            "Chrome/131.0.0.0 Safari/537.36"
        ),
    )
    page = ctx.new_page()
    page.goto("https://leetcode.com/accounts/login/", wait_until="domcontentloaded")

    session_cookie = None
    csrf_token = None
    deadline = time.time() + timeout_seconds

    while time.time() < deadline:
        cookies = ctx.cookies("https://leetcode.com")
        for c in cookies:
            if c["name"] == "LEETCODE_SESSION" and len(c["value"]) > 20:
                session_cookie = c["value"]
            if c["name"] == "csrftoken":
                csrf_token = c["value"]
        if session_cookie:
            break
        time.sleep(0.5)

    browser.close()
finally:
    pw.stop()

if session_cookie:
    print(json.dumps({"ok": True, "session_cookie": session_cookie, "csrf_token": csrf_token}))
else:
    print(json.dumps({"ok": False, "error": "Login timed out. Complete login within " + str(timeout_seconds) + " seconds."}))
'''


async def browser_login_and_capture_cookies(timeout_seconds: int = 120) -> dict:
    """
    Spawns a subprocess with Playwright to open Chromium for LeetCode login.
    Uses asyncio.to_thread to avoid Windows asyncio subprocess issues.
    """
    # Write script to a temp file to avoid quoting issues
    script_path = os.path.join(tempfile.gettempdir(), "_lc_browser_login.py")
    with open(script_path, "w", encoding="utf-8") as f:
        f.write(_LOGIN_SCRIPT)

    return await asyncio.to_thread(_run_login_subprocess, script_path, timeout_seconds)


def _run_login_subprocess(script_path: str, timeout_seconds: int) -> dict:
    """Run the login script in a subprocess (blocking, runs in thread)."""
    python_exe = sys.executable
    proc = subprocess.Popen(
        [python_exe, script_path, str(timeout_seconds)],
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
    )
    stdout, stderr = proc.communicate(timeout=timeout_seconds + 10)
    output = stdout.decode("utf-8").strip()

    if not output:
        err = stderr.decode("utf-8").strip()
        raise RuntimeError(f"Browser process produced no output. stderr: {err[:500]}")

    data = json.loads(output)
    if not data.get("ok"):
        raise TimeoutError(data.get("error", "Login timed out"))

    return {
        "session_cookie": data["session_cookie"],
        "csrf_token": data.get("csrf_token"),
    }
